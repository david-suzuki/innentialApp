import { User, LearningContent } from '~/models'

const filterRequestsWithNoUserOrContent = async requests => {
  return (
    await Promise.all(
      requests.map(async r => {
        const requestData = r._doc || r
        return {
          ...requestData,
          userExists: await User.findById(r.user)
            .select({ _id: 1 })
            .lean(),
          contentExists: await LearningContent.findById(r.contentId)
            .select({ _id: 1 })
            .lean()
        }
      })
    )
  )
    .filter(r => !!r.userExists && !!r.contentExists)
    .map(({ userExists, contentExists, ...r }) => r)
}

export default filterRequestsWithNoUserOrContent
