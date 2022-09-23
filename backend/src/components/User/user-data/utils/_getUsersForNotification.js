import { User } from '~/models'
import { getDownloadLink } from '~/utils'

const getUsersForNotification = async query => {
  const activeTeamMembers = await User.find({
    ...query,
    status: 'active'
  })
    .select({ _id: 1, firstName: 1, lastName: 1 })
    .limit(3)

  return Promise.all(
    activeTeamMembers.map(async user => {
      return {
        _id: user._id,
        name: `${user.firstName} ${user.lastName}`,
        imgLink: await getDownloadLink({
          _id: user._id,
          key: 'users/profileImgs',
          expires: 604800
        }),
        roleAtWork: await user.getRoleAtWork()
      }
    })
  )
}

export default getUsersForNotification
