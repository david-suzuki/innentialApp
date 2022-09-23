export default `
  input EvaluationSkillInput {
    skillId: String!
    evaluatedLevel: Int!
  }

  input UserEvaluationInput {
    userId: String!
    skills: [EvaluationSkillInput]
    recommendedSkills: [EvaluationSkillInput]
    feedback: String
  }
`
