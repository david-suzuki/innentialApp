import { User } from '~/models'
;(async () => {
  const allUsers = await User.find().lean()
  await Promise.all(
    allUsers.map(async user => {
      const lowerCaseEmail = user.email.toLowerCase()

      if (lowerCaseEmail !== user.email) {
        await User.findOneAndUpdate(
          {
            _id: user._id
          },
          { $set: { email: lowerCaseEmail } }
        )
      }
    })
  )
})()
