export default `
  input CreatedByInput {
    organizationName: String
    organizationAdmin: String
  }
  input InvitationInput {
    createdBy: CreatedByInput
    userEmail: String
    status: String
  }
`
