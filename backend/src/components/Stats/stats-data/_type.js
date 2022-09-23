import { Types } from 'mongoose'

export const types = `
  type StatsOverviewData {
    employees: Int!
    newEmployees: Int!
    teams: Int!
    newTeams: Int!
    feedback: Int!
    newFeedback: Int!
  }

  type TeamContentStats {
    _id: String!
    liked: Int!
    added: Int!
    opened: Int!
    shared: Int!
  }

  type AdminTeamStats {
    _id: String!
    teamName: String!
    total: TeamContentStats
  }

  type SkillCount {
    _id: String!
    name: String!
    employeesCount: Int!
  }

  type TeamSkillGap {
    _id: String!
    teamName: String!
    teamMemberCount: Int!
    neededSkills: [Int]!
    availableSkills: [Float]!
    neededSkillsNames: [String]!
  }

  type StatsTeamsData {
    teamsSkillGap: [TeamSkillGap]!
    mostRequiredSkills: [SkillCount]!
  }

  type FetchStatsGrowthData {
    _id: ID!
    skillsPeopleHave: [SkillCount]!
    mostNeededSkills:[SkillCount]!
    interests: [SkillCount]!
  }

  type LearningPathStatistics {
    _id: String!
    name: String
    learningPathId: ID
    inProgressCount: Int
    completedCount: Int
    learningGoalStatistics: [LearningGoalStatistics]
  }

  type LearningGoalStatistics {
    _id: String!
    name: String
    goalId: ID
    inProgressCount: Int
    completedCount: Int
    learningContentStatistics: [LearningContentStatistics]
  }

  type LearningContentStatistics {
    _id: String!
    title: String
    type: String
    contentId: ID
    notStartedCount: Int
    inProgressCount: Int
    completedCount: Int
  }
`
export const typeResolvers = {
  LearningPathStatistics: {
    _id: () => new Types.ObjectId()
  },
  LearningGoalStatistics: {
    _id: () => new Types.ObjectId()
  },
  LearningContentStatistics: {
    _id: () => new Types.ObjectId()
  },
  FetchStatsGrowthData: {
    _id: () => new Types.ObjectId()
  }
}
