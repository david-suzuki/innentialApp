import { UserProfile, User } from '~/models'
;(async () => {
  const profilesWithoutOrgId = await UserProfile.find({ organizationId: null })
  await Promise.all(
    profilesWithoutOrgId.map(async profile => {
      // find profiles user
      const user = await User.findById(profile.user)
      if (user) {
        // dummy check
        const dummyCheck = user.email
          .split('@')
          .join(', ')
          .split('.')[0]
          .split(', ')

        if (dummyCheck[0].length === 24 && dummyCheck[0] === String(user._id)) {
          await UserProfile.findOneAndUpdate(
            { _id: profile._id },
            { organizationId: user.organizationId }
          )
        }
      }
    })
  )
})()
