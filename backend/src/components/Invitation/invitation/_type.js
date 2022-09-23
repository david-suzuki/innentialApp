export const types = `
  type CreatedBy {
    organizationName: String
    organizationAdmin: String
  }
  type Invitation {
    createdBy: CreatedBy
    createdAt: DateTime
    userEmail: String
    status: String
  }
`

export const typeResolvers = {
  //
}
