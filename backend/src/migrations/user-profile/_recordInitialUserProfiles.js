import { User, UserProfile, UserProgress, Organization } from '~/models'

const recordUsersProgress = async (
  { user, ...profile }, // UserProfile
  updatedKeys // ['selectedInterests', 'selectedWorkSkills'. 'neededWorkSkills']
) => {
  const usersProgress = await UserProgress.findOne({ user }).lean()
  const mapItems = key => {
    if (key === 'selectedInterests')
      return ({ _id, slug }) => ({ interestId: _id, slug })
    else if (key === 'selectedWorkSkills')
      return ({ _id, slug, level }) => ({ skillId: _id, slug, level })
    else if (key === 'neededWorkSkills')
      return ({ _id, slug }) => ({ skillId: _id, slug })
    else {
      throw new Error(
        `Invalid key supplied to recordUsersProgress() key=${key}`
      )
    }
  }

  let updatedProgress = { user }
  if (usersProgress) {
    updatedKeys.forEach(key => {
      const previousEntry = usersProgress[key] && usersProgress[key][0]
      if (previousEntry) {
        const snapshot = profile[key].map(mapItems(key))
        const lastChanged = new Date(Date.now() - previousEntry.changedAt)
        if (lastChanged.getHours() > 24) {
          // TODO: CHANGE TO HOURS - This is for testing purposes!
          updatedProgress[key] = usersProgress[key]
          updatedProgress[key].unshift({ snapshot })
        } else {
          updatedProgress[key] = usersProgress[key]
          updatedProgress[key][0] = { snapshot }
        }
      } else {
        const snapshot = profile[key].map(mapItems(key))
        updatedProgress[key] = [{ snapshot }]
      }
    })

    await UserProgress.findOneAndUpdate(
      { user },
      {
        $set: updatedProgress
      },
      { new: true }
    )
  } else {
    updatedKeys.forEach(key => {
      const snapshot = profile[key].map(mapItems(key))
      updatedProgress[key] = [{ snapshot }]
    })

    await UserProgress.create(updatedProgress)
  }
}

;(async () => {
  let validOrgCount = 0
  const allUsers = await User.find()
  await Promise.all(
    allUsers.map(async user => {
      const dummyCheck = user.email
        .split('@')
        .join(', ')
        .split('.')[0]
        .split(', ')
      if (dummyCheck[0].length === 24 && dummyCheck[1] === 'innential') {
        return
      }

      const usersProfile = await UserProfile.findOne({ user: user._id }).lean()
      if (!usersProfile) {
        return
      }

      const orgCheck = await Organization.findById(user.organizationId)
      if (orgCheck) {
        const profile = await UserProfile.findOne({ user: user._id })
        if (profile && !profile.organizationId) {
          await UserProfile.findOneAndUpdate(
            { user: user._id },
            {
              $set: { organizationId: orgCheck._id }
            }
          )
          validOrgCount++
        }
      }

      await recordUsersProgress(usersProfile, [
        'selectedWorkSkills',
        'neededWorkSkills',
        'selectedInterests'
      ])
    })
  )

  if (validOrgCount) {
    console.log('ORGANIZATIONS ADDED TO PROFILES! ', { validOrgCount })
  }
})()
