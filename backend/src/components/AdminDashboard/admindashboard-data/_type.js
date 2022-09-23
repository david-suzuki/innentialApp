export const types = `
type PopularResource {
  _id: ID!
  qty: Int!
  users: Int!
  type: String
}

type TopInDemand {
    mostNeededSkills:[SkillCount]!
  }

type Activity {
  learningCompleted: [Int]
  learningStarted: [Int]
  xAxis: [String]
}
`
