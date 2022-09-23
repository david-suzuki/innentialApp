import {
  Organization,
  User,
  UserProfile,
  Team,
  TeamStageResult,
  TeamSharedContentList,
  UserContentInteractions,
  UserEvaluation,
  ReviewTemplate,
  Review,
  ReviewResults,
  Goal,
  DevelopmentPlan,
  RoleRequirements,
  RoleGroup
} from '~/models'
import { sentryCaptureException } from '~/utils'

export default async organizationId => {
  return new Promise(async (resolve, reject) => {
    try {
      const users = await User.find({ organizationId })
      const teams = await Team.find({ organizationId })

      // delete all demo users and related crap
      await Promise.all(
        users.map(async ({ _id, email }) => {
          // user, userProfile, contentInteractions, userEvaluations
          if (email.split('@')[0] === String(_id)) {
            await User.deleteOne({ _id })
            await UserProfile.deleteOne({ user: _id })
            await UserContentInteractions.deleteOne({ user: _id })
            await UserEvaluation.deleteOne({ user: _id })
            await Goal.deleteMany({ user: _id })
            await DevelopmentPlan.deleteMany({ user: _id })

            return _id
          }

          return null
        })
      )

      await ReviewTemplate.deleteMany({ organizationId })
      await Review.deleteMany({ organizationId })
      await ReviewResults.deleteMany({ organizationId })
      await RoleRequirements.deleteMany({ organizationId })
      await RoleGroup.deleteMany({ organizationId })

      // HANDLE TEAM DELETION!
      await Promise.all(
        teams.map(async team => {
          await TeamStageResult.deleteOne({
            teamId: team._id,
            engagement: null
          })
          await Team.deleteOne({ _id: team._id })
          await TeamSharedContentList.deleteOne({ _id: team._id })
        })
      )

      await Organization.findOneAndUpdate(
        { _id: organizationId },
        { isDemoOrganization: false },
        { new: true }
      )

      await User.updateMany(
        { organizationId, isDemoUser: true },
        { isDemoUser: false }
      )
      resolve('ok')
    } catch (e) {
      sentryCaptureException(e)
      reject(e)
    }
  })
}
