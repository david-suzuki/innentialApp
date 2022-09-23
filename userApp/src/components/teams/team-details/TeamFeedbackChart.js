import React from 'react'
import { ChartLegend } from '../../ui-components'
import { useQuery } from 'react-apollo'
import { fetchTeamFeedbackEvaluation } from '../../../api'
import { sortSkillGapItems } from '../_teamUtils'
import '../../../styles/theme/notification.css'
import { captureFilteredError } from '../../general'
import SkillGapChart from '../../ui-components/SkillGapChart'

const getDataForSkillGapChart = skills => {
  const labels = []
  const skillAvailable = []
  const skillNeeded = []
  skills
    .filter(skill => !!skill.skillNeeded)
    .forEach(skill => {
      labels.push(skill.name)
      skillAvailable.push(Number(skill.skillAvailable).toFixed(2))
      skillNeeded.push(skill.skillNeeded)
    })
  return { labels, skillAvailable, skillNeeded }
}

const TeamFeedbackChart = ({ teamId }) => {
  const { data, loading, error } = useQuery(fetchTeamFeedbackEvaluation, {
    variables: {
      teamId
    },
    fetchPolicy: 'cache-and-network'
  })

  if (loading) return null

  if (error) {
    captureFilteredError(error)
    return null
  }

  if (data && data.fetchTeamFeedbackEvaluation) {
    const finalItems = sortSkillGapItems(data.fetchTeamFeedbackEvaluation)
    const chartData = getDataForSkillGapChart(finalItems)

    if (chartData?.skillNeeded?.length > 0 && finalItems.length > 0) {
      return (
        <div style={{ marginBottom: '45px' }}>
          <div style={{ marginBottom: '45px' }}>
            {chartData.skillNeeded && chartData.skillNeeded.length > 0 && (
              <SkillGapChart
                labels={chartData.labels}
                skills={{
                  available: chartData.skillAvailable,
                  needed: chartData.skillNeeded
                }}
              />
            )}
          </div>
          <ChartLegend availableLabel='Feedback' />
        </div>
      )
    }
  }
  return null
}

export default TeamFeedbackChart

// export const skillGapTabMember = ({ teamId, team, memberId }) => {
//   return (
//     <Query query={fetchLatestTeamEvaluation} variables={{ teamId }}>
//       {({ data, loading, error }) => {
//         if (loading) return <p>Loading</p>
//         if (error) {
//           return <p>Error</p>
//         }

//         if (data && data.fetchLatestTeamEvaluation) {
//           const latestEval = data.fetchLatestTeamEvaluation
//           if (latestEval) {
//             const items = latestEval.requiredSkills.map(skill => {
//               const skillNeeded = skill.level * 20
//               let users = []
//               let sumofSkills = 0
//               let countOfMembers = 0
//               const leadersSkill = latestEval.leadersSkills.find(
//                 ls => ls.name === skill.name
//               )
//               if (leadersSkill) {
//                 sumofSkills += leadersSkill.level
//                 ++countOfMembers
//                 users.push({
//                   id: team.leader._id,
//                   image: userPlaceholder,
//                   url: ''
//                 })
//               }

//               latestEval.memberEvaluations.forEach(mEval => {
//                 const membersSkill = mEval.skills.find(
//                   ls => ls.skillId === skill.skillId
//                 )
//                 if (membersSkill) {
//                   sumofSkills +=
//                     (membersSkill.evaluatedLevel + membersSkill.membersLevel) /
//                     2
//                   ++countOfMembers
//                   users.push({
//                     id: mEval.userId,
//                     image: userPlaceholder,
//                     url: ''
//                   })
//                 }
//               })

//               let skillAvailable = 0
//               if (sumofSkills > 0) {
//                 skillAvailable = Math.round((sumofSkills / countOfMembers) * 20)
//               } else {
//                 skillAvailable = 0
//               }

//               return {
//                 id: skill._id,
//                 name: skill.name,
//                 skillNeeded,
//                 skillAvailable,
//                 users
//               }
//             })

//             const finalItems = items.reduce((acc = [], curr) => {
//               if (curr.users.length === 0) {
//                 return [...acc, curr]
//               }
//               const x = curr.users.find(user => user.id === memberId)
//               if (x !== undefined) {
//                 return [...acc, { ...curr, users: [x] }]
//               }
//               return acc
//             }, [])

//             return <SkillItems items={finalItems} />
//           }
//         }
//         return null
//       }}
//     </Query>
//   )
// }
