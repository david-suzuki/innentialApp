export default `
  input OrganizationAddData {
    organizationName: String!
    admins: [String]!
    slug: String!
  }

  input OrganizationEditData {
    _id: ID!
    organizationName: String!
  }
  
  input OrganizationAddEmployeeData {
      organizationId: ID!
      employeeEmail: String!
      employeeRole: String!
  }

  input OrganizationOnboardingInput {
    organizationName: String 
    organizationSize: String
    industry: String
    locations: [String]
    approvals: Boolean
  }

  input TeamMemberInput {
    name: String!
    email: String!
  }
  
  input OrganizationAddTeamData {
    organizationId: ID!
    teamName: String!
    leader: String!
    members: [String]
  }

  input OrganizationCreateTeamData {
    teamName: String!
    leader: String!
    members: [String]
    invite: Boolean
  }
`
