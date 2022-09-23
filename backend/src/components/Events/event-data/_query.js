import { Event, User, Skills, Team } from '~/models'
import { isUser, isAdmin } from '~/directives'
import { getUploadLink } from '../../../utils'

export const queryTypes = `
  type Query {
    fetchAllMyEvents: [Event] @${isUser}
    fetchAllInvitations: [Event] @${isUser}
    fetchAllPastEvents: [Event] @${isUser}
    fetchEventById(_id: ID!): Event @${isUser}
    fetchAllUpcomingAdminEvents: [Event] @${isAdmin}
    fetchAllPastAdminEvents: [Event] @${isAdmin}
    fetchAllDraftAdminEvents: [Event] @${isAdmin}
    fetchEventImageUploadLink(_id: ID!, contentType: String): URL @${isAdmin}
    fetchAttendeeUsers: [AttendeeUser] @${isAdmin}
    fetchAttendeeTeams: [AttendeeTeam] @${isAdmin}
  }
`

export const queryResolvers = {
  Query: {
    fetchAllMyEvents: async (_, args, { user: { _id: id } }) => {
      const events = await Event.find({
        invitations: {
          $elemMatch: {
            invitationId: id,
            invitationStatus: 'accept'
          }
        },
        $or: [
          {
            $and: [
              { isOnedayEvent: false },
              { scheduleToDate: { $gte: new Date() } }
            ]
          },
          {
            $and: [
              { isOnedayEvent: true },
              { scheduleFromDate: { $gte: new Date() } }
            ]
          }
        ]
      })
        .sort({ createdAt: 'desc' })
        // .skip(1)
        // .limit(1)
        .lean()

      const createrIds = events.map(event => event.createrId)
      const creaters = await User.find({ _id: { $in: createrIds } })
      const eventsWithCreater = events.map(event => {
        const createrUser = creaters.find(creater =>
          creater._id.equals(event.createrId)
        )
        const creater = {
          _id: createrUser._id,
          firstName: createrUser.firstName,
          lastName: createrUser.lastName
        }
        return { ...event, creater }
      })

      return eventsWithCreater
    },

    fetchAllInvitations: async (_, args, { user: { _id: id } }) => {
      const events = await Event.find({
        invitations: {
          $elemMatch: {
            invitationId: id,
            invitationStatus: 'pending'
          }
        },
        $or: [
          {
            $and: [
              { isOnedayEvent: false },
              { scheduleToDate: { $gte: new Date() } }
            ]
          },
          {
            $and: [
              { isOnedayEvent: true },
              { scheduleFromDate: { $gte: new Date() } }
            ]
          }
        ]
      })
        .sort({ invitationDate: 'desc' })
        // .skip(1)
        // .limit(1)
        .lean()
      const createrIds = events.map(event => event.createrId)
      const creaters = await User.find({ _id: { $in: createrIds } })
      const eventsWithCreater = events.map(event => {
        const createrUser = creaters.find(creater =>
          creater._id.equals(event.createrId)
        )
        const creater = {
          _id: createrUser._id,
          firstName: createrUser.firstName,
          lastName: createrUser.lastName
        }
        return { ...event, creater }
      })
      return eventsWithCreater
    },

    fetchAllPastEvents: async (_, args, { user: { _id: id } }) => {
      const events = await Event.find({
        invitations: {
          $elemMatch: {
            invitationId: id
          }
        },
        $or: [
          {
            $and: [
              { isOnedayEvent: false },
              { scheduleToDate: { $lt: new Date() } }
            ]
          },
          {
            $and: [
              { isOnedayEvent: true },
              { scheduleFromDate: { $lt: new Date() } }
            ]
          }
        ]
      })
        .sort({ createdAt: 'desc' })
        // .skip(1)
        // .limit(1)
        .lean()
      const createrIds = events.map(event => event.createrId)
      const creaters = await User.find({ _id: { $in: createrIds } })
      const eventsWithCreater = events.map(event => {
        const createrUser = creaters.find(creater =>
          creater._id.equals(event.createrId)
        )
        const creater = {
          _id: createrUser._id,
          firstName: createrUser.firstName,
          lastName: createrUser.lastName
        }
        return { ...event, creater }
      })
      return eventsWithCreater
    },

    fetchEventById: async (_, { _id }) => {
      const event = await Event.findById(_id).lean()
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

    fetchAllUpcomingAdminEvents: async (_, args, { user: { _id: id } }) => {
      const events = await Event.find({
        createrId: id,
        $or: [
          {
            $and: [
              { isOnedayEvent: false },
              { scheduleToDate: { $gte: new Date() } }
            ]
          },
          {
            $and: [
              { isOnedayEvent: true },
              { scheduleFromDate: { $gte: new Date() } }
            ]
          }
        ],
        isDraft: false
      })
        .sort({ createdAt: 'desc' })
        // .skip(1)
        // .limit(1)
        .lean()

      const createrIds = events.map(event => event.createrId)
      const creaters = await User.find({ _id: { $in: createrIds } })
      const resultEvents = events.map(async event => {
        const createrUser = creaters.find(creater =>
          creater._id.equals(event.createrId)
        )
        const creater = {
          _id: createrUser._id,
          firstName: createrUser.firstName,
          lastName: createrUser.lastName
        }

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

        return { ...event, creater, invitations }
      })

      return resultEvents
    },

    fetchAllDraftAdminEvents: async (_, args, { user: { _id: id } }) => {
      const events = await Event.find({
        createrId: id,
        $or: [
          {
            $and: [
              { isOnedayEvent: false },
              { scheduleToDate: { $gte: new Date() } }
            ]
          },
          {
            $and: [
              { isOnedayEvent: true },
              { scheduleFromDate: { $gte: new Date() } }
            ]
          }
        ],
        isDraft: true
      })
        .sort({ createdAt: 'desc' })
        // .skip(1)
        // .limit(1)
        .lean()

      const createrIds = events.map(event => event.createrId)
      const creaters = await User.find({ _id: { $in: createrIds } })
      const resultEvents = events.map(async event => {
        const createrUser = creaters.find(creater =>
          creater._id.equals(event.createrId)
        )
        const creater = {
          _id: createrUser._id,
          firstName: createrUser.firstName,
          lastName: createrUser.lastName
        }

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

        return { ...event, creater, invitations }
      })

      return resultEvents
    },

    fetchAllPastAdminEvents: async (_, args, { user: { _id: id } }) => {
      const events = await Event.find({
        createrId: id,
        $or: [
          {
            $and: [
              { isOnedayEvent: false },
              { scheduleToDate: { $lt: new Date() } }
            ]
          },
          {
            $and: [
              { isOnedayEvent: true },
              { scheduleFromDate: { $lt: new Date() } }
            ]
          }
        ]
      })
        .sort({ createdAt: 'desc' })
        // .skip(1)
        // .limit(1)
        .lean()

      const createrIds = events.map(event => event.createrId)
      const creaters = await User.find({ _id: { $in: createrIds } })
      const resultEvents = events.map(async event => {
        const createrUser = creaters.find(creater =>
          creater._id.equals(event.createrId)
        )
        const creater = {
          _id: createrUser._id,
          firstName: createrUser.firstName,
          lastName: createrUser.lastName
        }

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

        return { ...event, creater, invitations }
      })
      return resultEvents
    },

    fetchEventImageUploadLink: async (_, args) => {
      const { _id, contentType } = args
      return getUploadLink({
        _id,
        contentType,
        key: 'eventTemplateForm/icons'
      })
    },

    fetchAttendeeUsers: async (
      _,
      args,
      { user: { organizationId: createrOrganization } }
    ) => {
      try {
        const users = await User.find({
          organizationId: createrOrganization
        }).lean()
        const resultUsers = users.map(user => {
          return { ...user, assigned: false }
        })
        return resultUsers
      } catch (e) {
        sentryCaptureException(e)
        console.log('There is an error while fetching users', e)
        return []
      }
    },

    fetchAttendeeTeams: async (
      _,
      args,
      { user: { organizationId: createrOrganization } }
    ) => {
      try {
        const teams = await Team.find({
          organizationId: createrOrganization
        }).lean()
        const resultTeams = teams.map(team => {
          return { ...team, assigned: false }
        })
        return resultTeams
      } catch (e) {
        sentryCaptureException(e)
        console.log('There is an error while fetching users', e)
        return []
      }
    }
  }
}
