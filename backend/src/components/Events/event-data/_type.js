import { getDownloadLink } from '~/utils'

export const types = `
  type Event {
    _id: ID!
    title: String!
    description: String
    eventType: String
    format: String
    eventLink: String
    eventLinkExternal: String
    eventLocation: String
    scheduleFromDate: DateTime
    scheduleToDate: DateTime
    isOnedayEvent: Boolean
    isPaid: Boolean
    price: Float
    currency: String
    inviteLink: inviteLink
    skills: [skill]
    attendee: attendee
    creater: creater
    invitationDate: DateTime
    invitations: [invitation]
    imageLink: String
    isDraft: Boolean
    createdAt: DateTime!
  }

  type inviteLink {
    url: String
    status: Boolean
  }

  type skill {
    _id: ID
    name: String
  }

  type attendee {
    attendeeType: String
    attendeeIds: [ID]
  }

  type invitation {
    _id: ID
    firstName: String
    lastName: String
    status: String
  }

  type creater {
    _id: ID
    firstName: String
    lastName: String
  }

  type AttendeeUser {
    _id: ID,
    firstName: String,
    lastName: String,
    email: String,
    assigned: Boolean
  }

  type AttendeeTeam {
    _id: ID,
    teamName: String,
    assigned: Boolean
  }
`
export const typeResolvers = {
  Event: {
    imageLink: ({ _id }) => {
      return getDownloadLink({
        _id,
        expires: 500 * 60,
        key: 'eventTemplateForm/icons'
      })
    }
  }
}
