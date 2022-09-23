import { UserProfile, User, JourneyNextSteps } from '../../models'
;(async () => {
  try {
    const profiles = await UserProfile.find({ neededWorkSkills: [] })
      .select({ user: 1 })
      .lean()

    const xlps = await JourneyNextSteps.find().lean()

    const { nModified } = await User.updateMany(
      {
        status: 'active',
        technician: { $ne: true },
        _id: {
          $in: [...profiles].map(({ user }) => user),
          $nin: [...xlps].map(({ user }) => user)
        }
        // _id: { $nin: [...xlps].map(({ user }) => user) }
      },
      {
        $set: {
          status: 'not-onboarded'
        }
      }
    )

    nModified > 0 && console.log(`Updated ${nModified} user profiles' status`)
  } catch (err) {
    console.error(err)
  }
})()
