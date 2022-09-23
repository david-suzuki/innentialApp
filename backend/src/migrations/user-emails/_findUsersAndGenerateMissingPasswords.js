import { User } from '~/models'
import { encryptor } from '~/utils'
;(async () => {
  const allUsers = await User.find({
    createdAt: { $gt: new Date('01-09-2020') },
    password: { $ne: null }
  })
    .select({ email: 1, password: 1 })
    .lean()

  const emptyPassword =
    'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855'

  let updatedCount = 0

  await Promise.all(
    allUsers.map(async user => {
      const passwordIsEmptyString = await encryptor.verify(
        { digest: emptyPassword },
        user.password
      )
      if (passwordIsEmptyString) {
        updatedCount++
        return User.findOneAndUpdate(
          { _id: user._id },
          {
            $set: {
              password: await encryptor.encrypt({
                digest: Math.random()
                  .toString(36)
                  .substr(2, 9)
              })
            }
          }
        )
      }
      return null
    })
  )

  updatedCount &&
    console.log(
      `Found ${updatedCount} users with empty password; Generated random passwords for security.`
    )
})()
