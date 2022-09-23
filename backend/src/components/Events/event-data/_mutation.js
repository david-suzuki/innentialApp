import { isUser, isAdmin } from '~/directives'
import { Event, User, Team, Skills } from '~/models'
import {
  sendEmail,
  appUrls,
  inviteEventNotification,
  deleteAWSContent
} from '~/utils'

export const mutationTypes = `
  type Mutation {
    createEvent(inputData: CreateEventInput!): Event @${isAdmin}
    editEvent(inputData: EditEventInput!): Event @${isAdmin}
    deleteEvent(_id: ID!): Event @${isAdmin}
    publicEvent(_id: ID!): Event @${isAdmin}
    inviteToEvent(inputData: InviteEventInput!): Event @${isAdmin}
    deleteEventImage(_id : ID! , key : String) : String @${isAdmin}
    acceptInvitation(_id: ID!): Event @${isUser}
    declineInvitation(_id: ID!): Event @${isUser}
  }
`

export const mutationResolvers = {
  Mutation: {
    createEvent: async (
      _,
      { inputData },
      { user: { _id: createrId, organizationId: createrOrganization } }
    ) => {
      const {
        inviteLinkUrl,
        inviteLinkStatus,
        attendeeType,
        attendeeIds,
        ...rest
      } = inputData

      const inviteLink = { url: inviteLinkUrl, status: inviteLinkStatus }
      const attendee = { attendeeType, attendeeIds }

      let invitations = []
      if (attendeeType === 'everyone') {
        const users = await User.find({
          status: 'active',
          organizationId: createrOrganization
        })
        invitations = users.map(user => {
          return { invitationId: user._id, invitationStatus: 'pending' }
        })
      } else if (attendeeType === 'specificusers') {
        invitations = attendeeIds.map(attendeeId => {
          return { invitationId: attendeeId, invitationStatus: 'pending' }
        })
      } else if (
        attendeeType === 'specificteams' ||
        attendeeType === 'myteams'
      ) {
        let teammembers = []
        for (let attendeeId of attendeeIds) {
          const team = await Team.find({ _id: attendeeId, active: true })
          const members = team.members
          teammembers = [...teammembers, ...members, team.leader]
        }
        invitations = teammembers.map(memberId => {
          return { invitationId: memberId, invitationStatus: 'pending' }
        })
      }

      const event = await Event.create({
        ...rest,
        inviteLink,
        attendee,
        invitations,
        createrId,
        invitationDate: new Date()
      })

      const appLink = `${appUrls['user']}`
      const eventUser = await User.findOne({ _id: createrId })
      await Promise.all(
        invitations.map(async invitation => {
          const user = await User.findOne({
            _id: invitation.invitationId
          })
          const email = user.email
          await sendEmail(
            email,
            'Event invitation email',
            inviteEventNotification({
              name: user.firstName,
              from: eventUser
                ? `${eventUser.firstName} ${eventUser.lastName}`
                : null,
              appLink,
              eventId: event._id
            })
          )
        })
      )

      return event
    },
    editEvent: async (_, { inputData }, { user: { _id: createrId } }) => {
      const {
        inviteLinkUrl,
        inviteLinkStatus,
        attendeeType,
        attendeeIds,
        ...rest
      } = inputData

      const inviteLink = { url: inviteLinkUrl, status: inviteLinkStatus }
      const attendee = { attendeeType, attendeeIds }

      const event = Event.findOneAndUpdate(
        { _id: inputData._id },
        {
          $set: {
            ...rest,
            inviteLink,
            attendee,
            createrId,
            updatedAt: new Date()
          }
        },
        { new: true }
      )
      return event
    },
    deleteEvent: async (_, { _id }) => {
      const event = await Event.findByIdAndRemove(_id)
      return event
    },
    publicEvent: async (_, { _id }) => {
      const event = Event.findOneAndUpdate(
        { _id },
        {
          $set: {
            isDraft: false,
            updatedAt: new Date()
          }
        },
        { new: true }
      )
      return event
    },
    inviteToEvent: async (
      _,
      { inputData },
      { user: { _id: senderId, organizationId: createrOrganization } }
    ) => {
      const { attendeeType, attendeeIds } = inputData
      let invitations = []
      if (attendeeType === 'everyone') {
        const users = await User.find({
          status: 'active',
          organizationId: createrOrganization
        })
        invitations = users.map(user => {
          return { invitationId: user._id, invitationStatus: 'pending' }
        })
      } else if (attendeeType === 'specificusers') {
        invitations = attendeeIds.map(attendeeId => {
          return { invitationId: attendeeId, invitationStatus: 'pending' }
        })
      } else if (
        attendeeType === 'specificteams' ||
        attendeeType === 'myteams'
      ) {
        let teammembers = []
        for (let attendeeId of attendeeIds) {
          const team = await Team.find({ _id: attendeeId, active: true })
          const members = team.members
          teammembers = [...teammembers, ...members, team.leader]
        }
        invitations = teammembers.map(memberId => {
          return { invitationId: memberId, invitationStatus: 'pending' }
        })
      }

      const appLink = `${appUrls['user']}`
      const eventUser = await User.findOne({ _id: senderId })

      await Promise.all(
        invitations.map(async invitation => {
          const user = await User.findOne({
            _id: invitation.invitationId
          })
          const email = user.email
          await sendEmail(
            email,
            'Event invitation email',
            inviteEventNotification({
              name: user.firstName,
              from: eventUser
                ? `${eventUser.firstName} ${eventUser.lastName}`
                : null,
              appLink,
              eventId: inputData._id
            })
          )
        })
      )

      const event = Event.findOneAndUpdate(
        { _id: inputData._id },
        {
          $set: {
            invitations,
            invitationDate: new Date(),
            updatedAt: new Date()
          }
        },
        { new: true }
      )
      return event
    },
    acceptInvitation: async (_, { _id }, { user: { _id: invitationId } }) => {
      const event = await Event.findOneAndUpdate(
        { _id: _id, 'invitations.invitationId': invitationId },
        {
          $set: {
            'invitations.$.invitationStatus': 'accept',
            updatedAt: new Date()
          }
        },
        { new: true }
      ).lean()
      const skillIds = event.skillIds
      const skills = await Skills.find({ _id: { $in: skillIds } })

      const eventInvitations = event.invitations
      const eventInvitationIds = eventInvitations.map(
        invitation => invitation.invitationId
      )
      const users = await User.find({
        _id: { $in: eventInvitationIds }
      })

      const invitations = users.map(u => {
        return {
          _id: u._id,
          firstName: u.firstName,
          lastName: u.lastName,
          status: eventInvitations.find(eventInvitation =>
            eventInvitation.invitationId.equals(u._id)
          ).invitationStatus
        }
      })

      const resultEvent = {
        ...event,
        skills,
        invitations
      }
      return resultEvent
    },
    declineInvitation: async (_, { _id }, { user: { _id: invitationId } }) => {
      const event = await Event.findOneAndUpdate(
        { _id: _id, 'invitations.invitationId': invitationId },
        {
          $set: {
            'invitations.$.invitationStatus': 'decline',
            updatedAt: new Date()
          }
        },
        { new: true }
      ).lean()
      const skillIds = event.skillIds
      const skills = await Skills.find({ _id: { $in: skillIds } })

      const eventInvitations = event.invitations
      const eventInvitationIds = eventInvitations.map(
        invitation => invitation.invitationId
      )
      const users = await User.find({
        _id: { $in: eventInvitationIds }
      })

      const invitations = users.map(u => {
        return {
          _id: u._id,
          firstName: u.firstName,
          lastName: u.lastName,
          status: eventInvitations.find(eventInvitation =>
            eventInvitation.invitationId.equals(u._id)
          ).invitationStatus
        }
      })

      const resultEvent = {
        ...event,
        skills,
        invitations
      }
      return resultEvent
    },
    deleteEventImage: async (_, args, { dataSources }) => {
      await deleteAWSContent({ awsId: args._id, key: args.key })
      return 'Banner deleted'
    }
  }
}
