// import { Team, User, TeamStageResult, Organization } from '~/models'
// import { isInnentialAdmin, isUser } from '~/directives'
// import {
//   teamStageResults,
//   sendEmail,
//   typeform,
//   areaLabelAndTip, //eslint-disable-line
//   appUrls,
//   teamLeaderNewAssessmentTemplate,
//   teamMemberNewAssessmentTemplate,
//   // createPdf,
//   sentryCaptureException
// } from '~/utils'
// import axios from 'axios'
// import { Types } from 'mongoose'

export const mutationTypes = `
  type Mutation {

  }
`

// createTeamStageAssessment(teamId: ID!): String @${isUser}
// fetchFormsAndMakeResult(teamId: ID!): String @${isInnentialAdmin}

// const { innentialFbUrl, formDefinition } = typeform

export const mutationResolvers = {
  Mutation: {
    // createTeamStageAssessment: async (_, { teamId }, context) => {
    //   const team = await Team.findById(teamId)
    //   if (!team) throw new Error(`No such team exists`)
    //   const openAssessment = await TeamStageResult.findOne({
    //     teamId,
    //     assessmentIterator: team.stageAssessments
    //   })
    //   if (openAssessment)
    //     throw new Error(`There is an assessment already open for this team`)
    //   const appLink = `${appUrls['user']}`
    //   await TeamStageResult.create({
    //     teamId: team._id,
    //     assessmentIterator: team.stageAssessments
    //   })
    //   const leaderUser = await User.findById(team.leader)
    //   const allMembers = await Promise.all(
    //     team.members.map(async member => {
    //       const user = await User.findById(member)
    //       return user
    //     })
    //   )
    //   appLink &&
    //     leaderUser.status === 'active' &&
    //     (await sendEmail(
    //       leaderUser.email,
    //       'New team assessment open',
    //       teamLeaderNewAssessmentTemplate({
    //         name: leaderUser.firstName,
    //         appUrl: `${appLink}}`
    //       })
    //     ))
    //   await Promise.all(
    //     allMembers.map(async member => {
    //       appLink &&
    //         member.status === 'active' &&
    //         (await sendEmail(
    //           member.email,
    //           'New team assessment open',
    //           teamMemberNewAssessmentTemplate({
    //             name: member.firstName,
    //             leader: context.user.firstName,
    //             appUrl: `${appLink}`
    //           })
    //         ))
    //     })
    //   )
    //   const leaderData = {
    //     _id: leaderUser._id,
    //     email: leaderUser.email
    //   }
    //   const participants = [
    //     leaderData,
    //     ...allMembers.map(member => {
    //       const { _id, email } = member
    //       return { _id, email }
    //     })
    //   ]
    //   await axios.post(`${innentialFbUrl}/team=${team._id}`, participants)
    //   return 'Stage assessment open'
    // },
    // fetchFormsAndMakeResult: async (_, { teamId }) => {
    //   const team = await Team.findById(teamId)
    //   if (!team) throw new Error(`No such team exists`)
    //   const organization = await Organization.findById(team.organizationId)
    //   if (!organization) throw new Error(`Organization not found`)
    //   const openAssessment = await TeamStageResult.findOne({
    //     teamId: team._id,
    //     assessmentIterator: team.stageAssessments
    //   })
    //   const membersParticipated = []
    //   const results = await axios({
    //     method: 'get',
    //     url: `${innentialFbUrl}/request_type=fetch/formID=${formDefinition.id}/teamID=${team._id}/assessment=${openAssessment._id}`
    //   })
    //     .then(res => {
    //       return res.data.map(el => {
    //         membersParticipated.push(el.email)
    //         return el.answers
    //       })
    //     })
    //     .catch(() => {
    //       throw new Error(`Could not fetch forms from database`)
    //     })
    //   if (results.length === 0) {
    //     await TeamStageResult.findOneAndRemove({
    //       _id: openAssessment._id
    //     })
    //     return 'Assessment closed with no results'
    //   } else {
    //     const {
    //       engagement,
    //       stage,
    //       keyPerformance,
    //       comments
    //     } = teamStageResults(results)
    //     const memberIDs = await Promise.all(
    //       membersParticipated.map(async email => {
    //         const user = await User.findOne({ email })
    //         return user._id
    //       })
    //     )
    //     const result = await TeamStageResult.findOneAndUpdate( //eslint-disable-line
    //       { _id: openAssessment._id },
    //       {
    //         $set: {
    //           closedAt: Date.now(),
    //           engagement,
    //           stage,
    //           keyPerformance: {
    //             _id: new Types.ObjectId(),
    //             ...keyPerformance
    //           },
    //           comments,
    //           membersParticipated: memberIDs
    //         }
    //       },
    //       { new: true }
    //     )
    //     const assessments = team.stageAssessments + 1
    //     try {
    //       await Team.findOneAndUpdate(
    //         { _id: team._id },
    //         {
    //           $set: {
    //             stageAssessments: assessments
    //           }
    //         }
    //       )
    //       const lowestPerformance = Object.entries(keyPerformance) //eslint-disable-line
    //         .filter(([key, value]) => typeof value === 'number')
    //         .sort(([key1, value1], [key2, value2]) => value1 - value2)
    //         .slice(0, 3)
    //         .map(area => {
    //           const [key, value] = area //eslint-disable-line
    //           return key
    //         })
    //       const allResults = await TeamStageResult.find({
    //         engagement: {
    //           $exists: true
    //         },
    //         teamId: {
    //           $ne: team._id
    //         }
    //       }).lean()
    //       const allTeams = await Team.find({ _id: { $ne: team._id } }).lean()
    //       const allTeamAverages = allTeams.map(t => {
    //         const allTeamResults = allResults
    //           .filter(result => t._id.equals(result.teamId))
    //           .map(result => result.engagement)
    //         const avgEngagement =
    //           allTeamResults.length > 0
    //             ? allTeamResults.reduce((a, b) => (a + b) / 2) /
    //               allTeamResults.length
    //             : []
    //         return avgEngagement
    //       })
    //       const allAvgLength =
    //         allTeamAverages.length > 0 ? allTeamAverages.length : 1
    //       const filteredAvgLength =
    //         allTeamAverages.length > 0
    //           ? allTeamAverages.filter(e => e < engagement)
    //           : 0
    //       const betterThan = (filteredAvgLength.length / allAvgLength) * 100 //eslint-disable-line
    //       // await createPdf({
    //       //   teamName: team.teamName,
    //       //   teamCount: team.members.length + 1,
    //       //   organizationName: organization.organizationName,
    //       //   stageResultInfo: {
    //       //     ...result._doc,
    //       //     betterThan,
    //       //     lowestPerformanceAreas: areaLabelAndTip(lowestPerformance)
    //       //   }
    //       // })
    //     } catch (e) {
    //       sentryCaptureException(e)
    //     }
    //     return 'Team results calculated'
    //   }
    // }
  }
}
