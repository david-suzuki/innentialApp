import { User, UserContentInteractions } from '~/models'
;(async () => {
  const users = await User.find()
    .select({ _id: 1, status: 1 })
    .lean()
  let count = 0

  await Promise.all(
    users.map(async user => {
      const { _id, email } = user
      const interaction = await UserContentInteractions.findOne({ user: _id })
      if (!interaction && user.status === 'active') {
        // if (email.split('@')[0] === String(_id)) return

        await UserContentInteractions.create({ user: _id })
        count++
        // console.log(`Creating content interactions for user ${user.email}`)
      }
    })
  )

  count &&
    console.log(
      `Created ${count} content interaction profiles for users/demo users`
    )
})()
