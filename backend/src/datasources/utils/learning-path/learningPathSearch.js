const learningPathSearch = async ({
  dataSource,
  search,
  organizationId,
  teamIds = [],
  categories = []
}) => {
  const searchRegexp = new RegExp(
    `${search.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')}`,
    'i'
  )

  let searchQuery
  let searchedPaths = []

  searchQuery = {
    $and: [
      {
        $or: [
          { name: { $regex: searchRegexp } },
          { description: { $regex: searchRegexp } },
          { targetGroup: { $regex: searchRegexp } },
          { author: { $regex: searchRegexp } }
        ]
      },
      (categories.length > 0 ? { targetGroup: { $in: categories } } : {}),
      organizationId
        ? {
          organization: organizationId,
          $or: [{ active: true }, { 'team.teamId': { $in: teamIds } }]
        }
        : { organization: null, hasContent: true, active: true }
      // { hasContent: true },
      // {
      //   $or: [{ organization: null }, { organization: organizationId }]
      // }
    ]
  }

  searchedPaths = await dataSource.getAllLean(searchQuery)

  if (searchedPaths.length === 0) {
    const individualStrings = search
      .split(' ')
      .reduce((acc = [], curr) => {
        if (curr.length === 1) return acc
        else return [...acc, curr]
      }, [])
      .map(
        st =>
          new RegExp(`^${st.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')}`, 'i')
      )

    searchQuery = {
      $and: [
        {
          $or: [
            { name: { $in: individualStrings } },
            { description: { $regex: searchRegexp } },
            { targetGroup: { $in: individualStrings } },
            { author: { $in: individualStrings } }
          ]
        },
        ...(categories.length > 0 && { targetGroup: { $in: categories } }),
        organizationId
          ? { organization: organizationId }
          : { organization: null, hasContent: true },
        { active: true }
      ]
    }

    searchedPaths = await dataSource.getAllLean(searchQuery)
  }

  return searchedPaths || []
}

export default learningPathSearch
