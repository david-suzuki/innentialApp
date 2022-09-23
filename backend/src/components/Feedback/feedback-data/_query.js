import {
  User,
  Team,
  UserEvaluation,
  Skills,
  UserProfile,
  Organization,
  SkillsFramework
} from '~/models'
import { isUser } from '~/directives'
import { Types } from 'mongoose'
import { FORBIDDEN } from '../../../environment/_authorization'
import { findFrameworkForSkill } from '../../Skills/skill-data/utils/_findFrameworkForSkill'

export const queryTypes = `
  type Query {
    fetchPeerFeedbackInfo(feedbackShareKey: String!): EvaluateInfo @${isUser}
    publicFetchExternalFeedbackInfo(token: String!): EvaluateInfo
    fetchUsersEvaluateInfo(userId: String!): [Skill] @${isUser}
    fetchUserPeerFeedback: [TextFeedback] @${isUser}
    fetchPeerFeedback(userId: ID!): [TextFeedback] @${isUser}
    fetchFeedbackReceipts: [TextFeedback] @${isUser}
    fetchUserPeerFeedbackRequests(userId: ID): [FeedbackRequest] @${isUser}
    fetchUserPendingFeedbackRequests: [FeedbackRequest] @${isUser}
  }
`

const normaliseSkills = async (skills, organizationId) =>
  (
    await Promise.all(
      skills.map(async ({ _id, skillId, level }) => {
        const sId = skillId || _id
        const apolloId = skillId ? _id : new Types.ObjectId()
        const normalisedSkill = await Skills.findById(sId).lean()
        if (normalisedSkill) {
          const frameworkId = await findFrameworkForSkill(
            sId,
            normalisedSkill.category,
            organizationId
          )
          return {
            ...normalisedSkill,
            _id: apolloId,
            skillId: sId,
            level,
            framework: await SkillsFramework.findById(frameworkId)
          }
        }
        return null
      })
    )
  ).filter(item => !!item)

export const queryResolvers = {
  Query: {
    fetchPeerFeedbackInfo: async (
      _,
      { feedbackShareKey },
      { user: { _id, organizationId } }
    ) => {
      const user = await User.findOne({
        feedbackShareKey,
        organizationId,
        status: 'active'
      })
        .select({ _id: 1, firstName: 1, lastName: 1 })
        .lean()

      if (!user) {
        const team = await Team.findOne({
          feedbackShareKey,
          organizationId,
          active: true
        })
          .select({ _id: 1, teamName: 1 })
          .lean()

        if (!team)
          throw new Error(
            `User/Team with keystring:${feedbackShareKey} isn't active or doesn't exist in the organization`
          )

        const { teamName } = team

        return {
          _id: team._id,
          userName: teamName
        }
      }

      if (String(user._id) === String(_id)) {
        return null
      }

      const { firstName, lastName } = user

      return {
        _id: user._id,
        userName: `${firstName} ${lastName}`
      }
    },
    publicFetchExternalFeedbackInfo: async (_, { token }, __) => {
      // const now = new Date()

      const user = await User.findOne({
        'externalFeedback.token': token,
        status: 'active'
      })
        .select({
          _id: 1,
          firstName: 1,
          lastName: 1,
          'externalFeedback.validUntil': 1,
          organizationId: 1
        })
        .lean()

      if (!user) {
        const team = await Team.findOne({
          'externalFeedback.token': token,
          active: true
        })
          .select({
            _id: 1,
            teamName: 1,
            'externalFeedback.validUntil': 1,
            requiredSkills: 1,
            organizationId: 1
          })
          .lean()

        if (!team) throw new Error(`NOT_FOUND`)

        // if (now > new Date(team.externalFeedback.validUntil))
        //   throw new Error(`EXPIRED`)

        const { teamName } = team

        const organization = await Organization.findById(team.organizationId)
          .select({ corporate: 1 })
          .lean()

        return {
          _id: team._id,
          userName: teamName,
          skills: await normaliseSkills(
            team.requiredSkills || [],
            team.organizationId
          ),
          corporate: organization && organization.corporate
        }
      }

      // if (now > new Date(user.externalFeedback.validUntil))
      //   throw new Error(`EXPIRED`)

      const { firstName, lastName } = user

      const organization = await Organization.findById(user.organizationId)
        .select({ corporate: 1 })
        .lean()

      const userProfile = await UserProfile.findOne({ user: user._id })
        .select({ selectedWorkSkills: 1 })
        .lean()

      return {
        _id: user._id,
        userName: `${firstName} ${lastName}`,
        skills: userProfile
          ? await normaliseSkills(
              userProfile.selectedWorkSkills,
              user.organizationId
            )
          : [],
        corporate: organization && organization.corporate
      }
    },
    fetchUsersEvaluateInfo: async (
      _,
      { userId },
      { user: { organizationId } }
    ) => {
      // try {
      const usersProfile = await UserProfile.findOne({ user: userId })
      if (usersProfile) {
        const orgCheck =
          String(usersProfile.organizationId) === String(organizationId)

        if (!orgCheck) throw new Error(FORBIDDEN)

        const { selectedWorkSkills } = usersProfile

        return normaliseSkills(selectedWorkSkills)
      } else {
        // SPECIAL CASE FOR POSTFINANCE: EVALUATING TEAM AS IF IT WERE A USER
        const team = await Team.findById(userId)
          .select({ requiredSkills: 1, organizationId: 1 })
          .lean()

        if (team) {
          const orgCheck =
            String(team.organizationId) === String(organizationId)

          if (!orgCheck) throw new Error(FORBIDDEN)

          return normaliseSkills(team.requiredSkills)
        }
      }
      return []
      // } catch (e) {
      //   sentryCaptureException(e)
      //   return null
      // }
    },
    fetchUserPeerFeedback: async (_, args, { user: { _id: user } }) => {
      const evaluation = await UserEvaluation.findOne({ user }).lean()
      if (evaluation) {
        const { feedback = [] } = evaluation
        return feedback.reverse()
      }
      return []
    },
    fetchPeerFeedback: async (_, { userId: user }) => {
      const evaluation = await UserEvaluation.findOne({ user }).lean()
      if (evaluation) {
        const { feedback = [] } = evaluation
        return feedback.map(fb => ({ ...fb, evaluated: user })).reverse()
      }
      return []
    },
    fetchFeedbackReceipts: async (_, args, { user: { _id: user } }) => {
      const evaluations = await UserEvaluation.find({
        'feedback.evaluatedBy': user
      })
        .select({ feedback: 1, user: 1 })
        .lean()

      return evaluations
        .map(({ feedback = [], user: evaluated }) => {
          return feedback
            .filter(({ evaluatedBy }) => String(evaluatedBy) === String(user))
            .map(r => ({ ...r, evaluated }))
        })
        .reduce((acc, curr) => [...acc, ...curr], [])
        .sort((a, b) => new Date(b.evaluatedAt) - new Date(a.evaluatedAt))
    },
    fetchUserPeerFeedbackRequests: async (_, { userId }, { user: { _id } }) => {
      const user = userId || _id
      const evaluation = await UserEvaluation.findOne({ user }).lean()
      if (evaluation) {
        const { requests = [] } = evaluation
        return requests.reverse()
      }
      return []
    },
    fetchUserPendingFeedbackRequests: async (
      _,
      args,
      { user: { _id: user } }
    ) => {
      const evaluations = await UserEvaluation.find({ 'requests.userId': user })
        .select({ requests: 1, user: 1 })
        .lean()
      return evaluations
        .map(({ requests = [], user: requestedBy }) => {
          return requests
            .filter(({ userId }) => String(userId) === String(user))
            .map(r => ({ ...r, requestedBy }))
        })
        .reduce((acc, curr) => [...acc, ...curr], [])
        .sort((a, b) => new Date(a.requestedAt) - new Date(b.requestedAt))
    }
  }
}
