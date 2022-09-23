import { Types } from 'mongoose'
import { teamStageResults } from './'
import { User, TeamStageResult, Team, Organization } from '~/models'
import { areaLabelAndTip } from '~/utils' //eslint-disable-line

const autoclose = async (forms, assessment) => {
  const membersParticipated = await Promise.all(
    forms.map(async form => {
      const { email } = form
      const user = await User.findOne({ email })
      return user._id
    })
  )

  const answers = forms.map(form => form.answers)

  const openAssessment = await TeamStageResult.findById(assessment)
  if (!openAssessment) throw new Error(`No assessment to be closed`)
  if (openAssessment.engagement) throw new Error(`Assessment already closed`)
  const team = await Team.findById(openAssessment.teamId)
  if (!team) throw new Error(`No team with provided ID found`)
  const organization = await Organization.findById(team.organizationId)
  if (!organization) throw new Error(`No organization with provided ID found`)

  const { engagement, stage, keyPerformance, comments } = teamStageResults(
    answers
  )
  const performance = { ...keyPerformance, _id: new Types.ObjectId() }
  const result = await TeamStageResult.findOneAndUpdate( //eslint-disable-line
    { _id: openAssessment._id },
    {
      $set: {
        closedAt: Date.now(),
        engagement,
        stage,
        keyPerformance: performance,
        comments,
        membersParticipated
      }
    },
    { new: true }
  )

  await Team.findOneAndUpdate(
    { _id: team._id },
    {
      $set: {
        stageAssessments: (team.stageAssessments += 1)
      }
    }
  )

  const lowestPerformance = Object.entries(keyPerformance) //eslint-disable-line
    .filter(([key, value]) => typeof value === 'number')
    .sort(([key1, value1], [key2, value2]) => value1 - value2)
    .slice(0, 3)
    .map(area => {
      const [key, value] = area //eslint-disable-line
      return key
    })

  const allResults = await TeamStageResult.find({
    engagement: {
      $exists: true
    },
    teamId: {
      $ne: team._id
    }
  }).lean()
  const allTeams = await Team.find({ _id: { $ne: team._id } }).lean()
  const allTeamAverages = allTeams.map(t => {
    const allTeamResults = allResults
      .filter(result => t._id.equals(result.teamId))
      .map(result => result.engagement)
    const avgEngagement =
      allTeamResults.length > 0
        ? allTeamResults.reduce((a, b) => (a + b) / 2) / allTeamResults.length
        : []
    return avgEngagement
  })
  const allAvgLength = allTeamAverages.length > 0 ? allTeamAverages.length : 1
  const filteredAvgLength =
    allTeamAverages.length > 0 ? allTeamAverages.filter(e => e < engagement) : 0
  const betterThan = (filteredAvgLength.length / allAvgLength) * 100 //eslint-disable-line

  // await createPdf({
  //   teamName: team.teamName,
  //   teamCount: team.members.length + 1,
  //   stageResultInfo: {
  //     ...result._doc,
  //     betterThan,
  //     lowestPerformanceAreas: areaLabelAndTip(lowestPerformance)
  //   },
  //   organizationName: organization.organizationName
  // })
}

export default autoclose
