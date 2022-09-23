export default `
  input CreateEventInput {
    title: String!
    description: String
    eventType: String!
    format: String!
    eventLink: String
    eventLinkExternal: String
    eventLocation: String
    scheduleFromDate: DateTime!
    scheduleToDate: DateTime
    isOnedayEvent: Boolean!
    isPaid: Int
    price: Float
    currency: String
    inviteLinkUrl: String
    inviteLinkStatus: Boolean
    skillIds: [ID]
    attendeeType: String
    attendeeIds: [ID]
    invitationDate: DateTime
    isDraft: Int!
  }

  input EditEventInput {
    _id: ID!
    title: String!
    description: String
    eventType: String!
    format: String!
    eventLink: String
    eventLinkExternal: String
    eventLocation: String
    scheduleFromDate: DateTime!
    scheduleToDate: DateTime
    isOnedayEvent: Boolean!
    isPaid: Int
    price: Float
    currency: String
    inviteLinkUrl: String
    inviteLinkStatus: Boolean
    skillIds: [ID]
    attendeeType: String
    attendeeIds: [ID]
    isDraft: Int!
  }

  input InviteEventInput {
    _id: ID!
    attendeeType: String
    attendeeIds: [ID]
  }
`
