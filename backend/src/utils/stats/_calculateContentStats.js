import {
  Team,
  LearningContent,
  UserContentInteractions,
  TeamSharedContentList,
  TeamContentStats
} from '~/models'

export default async teamId => {
  const team = await Team.findById(teamId).lean()
  if (!team)
    return {
      liked: 0,
      opened: 0,
      added: 0,
      shared: 0
    }

  let allLikes = 0
  let allClicks = 0
  let allUploads = 0
  let allShares = 0

  const sharedList = await TeamSharedContentList.findOne({ teamId }).lean()

  if (sharedList) {
    const { sharedContent } = sharedList
    allShares += sharedContent.length
  }

  const allMemberIds = [team.leader, ...team.members]
  const allProfiles = await UserContentInteractions.find({
    user: { $in: allMemberIds }
  }).lean()

  await Promise.all(
    allProfiles.map(async profile => {
      const { likedContent, clickedContent } = profile

      const liked = likedContent.length
      const opened = clickedContent.length

      const userContentCount = await LearningContent.countDocuments({
        uploadedBy: profile.user
      })

      allLikes += liked
      allClicks += opened
      allUploads += userContentCount
    })
  )

  const contentStatList = await TeamContentStats.findOne({ teamId }).lean()

  if (!contentStatList) {
    return {
      liked: allLikes,
      opened: allClicks,
      added: allUploads,
      shared: allShares
    }
  } else {
    const { total } = contentStatList

    const {
      liked: prevLiked,
      opened: prevOpened,
      shared: prevShared,
      added: prevAdded
    } = total

    return {
      liked: allLikes - prevLiked,
      opened: allClicks - prevOpened,
      added: allUploads - prevAdded,
      shared: allShares - prevShared
    }
  }
}
