// import { typeform, downloadPdf } from '../../../utils'
// import { User, Organization, Team } from '~/models'
// import axios from 'axios'

export const types = `
`

// type StageResult {
//   _id: ID!
//   engagement: Float
//   stage: String
//   startDate: DateTime!
//   endDate: DateTime
//   keyPerformance: KeyPerformance
//   comments: [String]
//   membersParticipated: [String]
//   participants: Participated
//   membersCompleted: [String]
//   reportLink: String
// }
// type KeyPerformance {
//   _id: ID
//   goalsManagement: Float
//   independence: Float
//   rolesClarity: Float
//   structure: Float
//   leadership: Float
//   comsAndFeedback: Float
//   planningAndDecisionMaking: Float
//   followUps: Float
//   acceptanceAndNorms: Float
//   cooperation: Float
// }
// type Participated {
//   _id: ID
//   open: Boolean!
//   emails: [String]
//   participants: [String]
// }
// type OpenResult {
//   _id: ID!
//   teamId: String!
//   email: String!
// }

export const typeResolvers = {
  // StageResult: {
  //   startDate: async ({ createdAt }) => {
  //     return createdAt
  //   },
  //   endDate: async ({ closedAt }) => {
  //     return closedAt
  //   },
  //   membersParticipated: async ({ membersParticipated }) => {
  //     return membersParticipated.map(async memberID => {
  //       const user = await User.findById(memberID)
  //       return user ? user.email : '(User deleted)'
  //     })
  //   },
  //   participants: async ({ _id, teamId }) => {
  //     const { innentialFbUrl, formDefinition } = typeform
  //     const data = await axios({
  //       method: 'get',
  //       url: `${innentialFbUrl}/request_type=query/formID=${formDefinition.id}/teamID=${teamId}/assessment=${_id}`
  //       // headers: { Authorization: `Bearer ${token[0]}` }
  //     })
  //       .then(res => {
  //         return res.data
  //       })
  //       .catch(() => {
  //         throw new Error(`Error getting data!`)
  //       })
  //     return {
  //       _id,
  //       open: true,
  //       emails: data.emails || [],
  //       participants: data.participants || []
  //     }
  //   },
  //   reportLink: async ({ engagement, teamId, _id }) => {
  //     if (engagement) {
  //       const team = await Team.findById(teamId)
  //       const org = await Organization.findById(team.organizationId)
  //       return downloadPdf({
  //         organizationName: org.organizationName,
  //         teamName: team.teamName,
  //         stageResultID: _id
  //       })
  //     } else {
  //       return ''
  //     }
  //   }
  // }
}
