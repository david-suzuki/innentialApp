// import { Team, TeamStageResult, User, Organization } from '~/models'
// import { isInnentialAdmin, isUser } from '~/directives'
// import { typeform, sentryCaptureException } from '../../../utils'
// import axios from 'axios'
// import { createTokens } from '../../../authentication/_handle-tokens'

export const queryTypes = `
  type Query {

  }
`

// fetchMembersCompleted(teamId: ID!): Participated @${isInnentialAdmin}
// leaderFetchMembersCompleted(teamId: ID!): Participated @${isUser}
// fetchToolsForReport(assessmentId: ID!): [String] @${isInnentialAdmin}
// fetchAllStageResults(teamId: ID!): [StageResult] @${isUser}
// fetchOpenAssessmentsForUser: [OpenResult] @${isUser}
// fetchCompletedAssesmentsForUser: [StageResult] @${isUser}

// const { innentialFbUrl, formDefinition } = typeform

export const queryResolvers = {
  Query: {
    // fetchMembersCompleted: async (_, { teamId }) => {
    //   const team = await Team.findOne({ _id: teamId })
    //   if (!team) {
    //     throw new Error(`Team does not exist`)
    //   }
    //   const openAssessment = await TeamStageResult.findOne({
    //     teamId: team._id,
    //     assessmentIterator: team.stageAssessments
    //   })
    //   if (!openAssessment) {
    //     return {
    //       open: false,
    //       emails: [],
    //       participants: []
    //     }
    //   }
    //   // const token = await createTokens({ user })
    //   const data = await axios({
    //     method: 'get',
    //     url: `${innentialFbUrl}/request_type=query/formID=${formDefinition.id}/teamID=${team._id}/assessment=${openAssessment._id}`
    //     // headers: { Authorization: `Bearer ${token[0]}` }
    //   })
    //     .then(res => {
    //       return res.data
    //     })
    //     .catch(() => {
    //       throw new Error(`Error getting data!`)
    //     })
    //   return {
    //     open: true,
    //     ...data
    //   }
    // },
    // fetchAllStageResults: async (_, { teamId }) => {
    //   try {
    //     const team = await Team.findOne({ _id: teamId })
    //     const results = await TeamStageResult.find({ teamId: team._id })
    //     if (results.length > 0) {
    //       return results
    //     } else {
    //       return []
    //     }
    //   } catch (e) {
    //     sentryCaptureException(e)
    //     return []
    //   }
    // },
    // // DEPRECATED
    // // fetchToolsForReport: async (_, { assessmentId }) => {
    // //   const assessment = await TeamStageResult.findById(assessmentId)
    // //   if (!assessment.engagement) throw new Error(`Assessment isn't closed`)
    // //   const performance = assessment.keyPerformance
    // //   const lowestPerformance = Object.entries(performance)
    // //     .filter(([key, value]) => typeof value === 'number')
    // //     .sort(([key1, value1], [key2, value2]) => value1 - value2)
    // //     .slice(0, 2)
    // //     .map(area => {
    // //       const [key, value] = area //eslint-disable-line
    // //       return key
    // //     })
    // //   const [area1, area2] = lowestPerformance
    // //   console.log(area1, area2)
    // //   const firstTool = await TeamLearningContent.findOne({
    // //     relatedPerformanceArea: area1
    // //   })
    // //   const secondTool = await TeamLearningContent.findOne({
    // //     relatedPerformanceArea: area2
    // //   })
    // //   return [firstTool.title, secondTool.title]
    // // },
    // fetchOpenAssessmentsForUser: async (_, args, { user }) => {
    //   const { _id } = user
    //   if (_id === undefined) throw new Error(`Cannot find ID of user`)
    //   try {
    //     const user = await User.findOne({ _id })
    //     const organizationId = user.organizationId ? user.organizationId : ''
    //     const organization = await Organization.findOne({
    //       _id: organizationId
    //     })
    //     if (!organization)
    //       throw new Error(`An organization with provided ID could not be found`)
    //     const teams = await Team.find({ organizationId })
    //     const userTeams = teams.filter(team => {
    //       const allMembers = [team.leader, ...team.members]
    //       return allMembers.find(member => member.equals(user._id))
    //     })
    //     const userOpenAssessments = []
    //     await Promise.all(
    //       userTeams.map(async team => {
    //         const openAssessment = await TeamStageResult.findOne({
    //           teamId: team._id,
    //           assessmentIterator: team.stageAssessments
    //         })
    //         if (openAssessment) {
    //           userOpenAssessments.push({
    //             _id: openAssessment._id,
    //             teamId: openAssessment.teamId,
    //             email: user.email
    //           })
    //         }
    //       })
    //     )
    //     if (userOpenAssessments.length === 0) {
    //       return []
    //     } else {
    //       const excludeCompleted = []
    //       await Promise.all(
    //         userOpenAssessments.map(async assessment => {
    //           const data = await axios({
    //             method: 'get',
    //             url: `${innentialFbUrl}/request_type=query/formID=${formDefinition.id}/teamID=${assessment.teamId}/assessment=${assessment._id}`
    //           })
    //             .then(res => {
    //               return res.data
    //             })
    //             .catch(() => {
    //               throw new Error(`Error getting data!`)
    //             })
    //           if (data.emails) {
    //             if (!data.emails.includes(user.email)) {
    //               excludeCompleted.push(assessment)
    //             }
    //           } else {
    //             excludeCompleted.push(assessment)
    //           }
    //         })
    //       )
    //       return excludeCompleted
    //     }
    //   } catch (e) {
    //     sentryCaptureException(e)
    //     return []
    //   }
    // },
    // fetchCompletedAssesmentsForUser: async (_, args, { user }) => {
    //   const { _id } = user
    //   try {
    //     if (_id === undefined) throw new Error(`Cannot find ID of user`)
    //     const user = await User.findOne({ _id })
    //     const organizationId = user.organizationId ? user.organizationId : ''
    //     const organization = await Organization.findOne({
    //       _id: organizationId
    //     })
    //     if (!organization)
    //       throw new Error(`An organization with provided ID could not be found`)
    //     const teams = await Team.find({ organizationId })
    //     const userTeams = teams.filter(team => {
    //       const allMembers = [team.leader, ...team.members]
    //       return allMembers.find(member => member.equals(user._id))
    //     })
    //     let completedAssessments = []
    //     await Promise.all(
    //       userTeams.map(async team => {
    //         const closedAssests = await TeamStageResult.find({
    //           teamId: team._id,
    //           engagement: { $exists: true }
    //         })
    //         completedAssessments.push(...closedAssests)
    //       })
    //     )
    //     return completedAssessments
    //   } catch (e) {
    //     sentryCaptureException(e)
    //     return []
    //   }
    // },
    // leaderFetchMembersCompleted: async (_, { teamId }, { user }) => {
    //   const { _id } = user
    //   if (_id === undefined) {
    //     throw new Error(`Cannot find ID of user`)
    //   }
    //   const team = await Team.findOne({ _id: teamId })
    //   if (!team) {
    //     throw new Error(`Team does not exist`)
    //   }
    //   if (!_id.equals(team.leader)) {
    //     throw new Error(`User is not a leader of this team`)
    //   }
    //   const openAssessment = await TeamStageResult.findOne({
    //     teamId: team._id,
    //     assessmentIterator: team.stageAssessments
    //   })
    //   if (!openAssessment) {
    //     return {
    //       open: false,
    //       emails: [],
    //       participants: []
    //     }
    //   }
    //   // const token = await createTokens({ user })
    //   const data = await axios({
    //     method: 'get',
    //     url: `${innentialFbUrl}/request_type=query/formID=${formDefinition.id}/teamID=${team._id}/assessment=${openAssessment._id}`
    //     // headers: { Authorization: `Bearer ${token[0]}` }
    //   })
    //     .then(res => {
    //       return res.data
    //     })
    //     .catch(() => {
    //       throw new Error(`Error getting data!`)
    //     })
    //   return {
    //     open: true,
    //     ...data
    //   }
    // }
  }
}
