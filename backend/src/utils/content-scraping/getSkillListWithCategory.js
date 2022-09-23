import { Skills, Categories } from '../../models'

const getSkillList = async platformOnly => {
  const allSkills = await Skills.find({
    enabled: true,
    ...(platformOnly && { organizationSpecific: null })
  })
    .sort({ createdAt: -1 })
    .select({ _id: 0, name: 1, slug: 1, category: 1 })
    .lean()
    .then(docs =>
      Promise.all(
        docs.map(async ({ category, ...skill }) => {
          const c = await Categories.findById(category)
            .select({ name: 1 })
            .lean()
          return {
            ...skill,
            category: c ? c.name : ''
          }
        })
      )
    )
    .catch(err => {
      console.error(err)
      return []
    })

  return allSkills.reduce((acc, { name, slug, category }) => {
    return {
      ...acc,
      [category]: [...(acc[category] || []), { [name]: slug }]
    }
  }, {})
}

export default getSkillList
