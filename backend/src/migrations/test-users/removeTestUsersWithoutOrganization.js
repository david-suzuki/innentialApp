import { User, UserContentInteractions, UserProfile } from '../../models'
;(async () => {
  const allUsers = await User.find({ organizationId: null }).lean()

  await Promise.all(
    allUsers.map(async user => {
      const dummyCheck = user.email
        .split('@')
        .join(', ')
        .split('.')[0]
        .split(', ')

      if (dummyCheck[0].length === 24 && dummyCheck[1] === 'innential') {
        await User.deleteOne({ _id: user._id })
        await UserProfile.deleteOne({ user: user._id })
        await UserContentInteractions.deleteOne({ user: user._id })
      }
    })
  )
})()
