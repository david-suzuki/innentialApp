import React from 'react'
import { SkillItemsAdmin, Statement, ChartLegend } from '../../ui-components'
import { Query } from 'react-apollo'
import { fetchLatestTeamEvaluation } from '../../../api'
import { sortSkillGapItems } from '../_teamUtils'
import '../../../styles/theme/notification.css'
import { captureFilteredError, LoadingSpinner } from '../../general'
import SkillGapChart from '../../ui-components/SkillGapChart'
// import { Button } from 'element-react'
import history from '../../../history'

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

export default ({
  isLeader,
  // isAdmin,
  teamId,
  team,
  displayName,
  withHeader
}) => {
  return (
    <Query
      query={fetchLatestTeamEvaluation}
      variables={{ teamId }}
      fetchPolicy='network-only'
    >
      {({ data, loading, error }) => {
        if (loading) return <LoadingSpinner />
        if (error) {
          captureFilteredError(error)
          return <Statement content='Oops! Something went wrong' />
        }

        if (data && data.fetchLatestTeamEvaluation) {
          const finalItems = sortSkillGapItems(data.fetchLatestTeamEvaluation)
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

                {withHeader && finalItems.length > 0 && <ChartLegend />}
                <SkillItemsAdmin
                  items={finalItems}
                  teamName={displayName ? team.teamName : undefined}
                  teamId={team._id}
                  withLink
                  isAdmin
                />
                {/* {(isLeader || isAdmin) && (
                        <Button
                          style={{ marginTop: '30px' }}
                          className="el-button--green"
                          onClick={e => {
                            e.preventDefault()
                            history.push('/evaluate', {
                              teamId: team._id,
                              forceEval: true
                            })
                          }}
                        >
                          Evaluate required skills
                        </Button>
                      )} */}
              </div>
            )
          }
        }
        return (
          <Statement
            content='No skill gap info available'
            button={isLeader && 'Set required skills'}
            onButtonClicked={() =>
              history.push('/evaluate', {
                teamId: team._id,
                forceEval: true,
                redirect: `/team/${team._id}`
              })
            }
          />
        )
      }}
    </Query>
  )
}

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
