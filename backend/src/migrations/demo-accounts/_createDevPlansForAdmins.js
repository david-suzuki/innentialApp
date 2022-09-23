import { DevelopmentPlan, User, UserProfile, UserProgress } from '~/models'

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
        if (lastChanged.getMinutes() > 5) {
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
  const allAdmins = await User.find({
    status: 'active',
    roles: 'ADMIN'
  })

  await Promise.all(
    allAdmins.map(async admin => {
      const hasPlan = await DevelopmentPlan.findOne({ user: admin._id })
      if (!hasPlan) {
        console.log(`user ${admin.email}: didn't have dev plan`)
        await DevelopmentPlan.create({
          user: admin._id,
          setBy: admin._id,
          organizationId: admin.organizationId
        })
      }

      const usersProfile = await UserProfile.findOne({ user: admin._id }).lean()
      const usersProgress = await UserProgress.findOne({
        user: admin._id
      }).lean()
      if (usersProfile && !usersProgress) {
        await recordUsersProgress(usersProfile, [
          'selectedWorkSkills',
          'selectedInterests',
          'neededWorkSkills'
        ])
      }
    })
  )
})()
