import {
  Team,
  User,
  Skills,
  TeamStageResult,
  TeamLearningContent,
  Organization,
  TeamSharedContentList,
  TeamContentStats,
  UserProfile,
  OrganizationSettings
} from '~/models'
import { isInnentialAdmin, isUser, isAdmin } from '~/directives'
import { ROLES_PERMISSIONS, SCOPES } from '~/config'
import { Types } from 'mongoose'
import axios from 'axios'
import {
  sendEmail,
  appUrls,
  addTeamMemberTemplate,
  changeTeamLeaderTemplate,
  typeform,
  newTeamLeaderInvitationTemplate,
  newTeamMemberInvitationTemplate,
  existingTeamMemberInvitationTemplate,
  sendTeamInvitesToMembers,
  sentryCaptureException,
  firstInvitationTemplate,
  teamRequiredSkillsNotification,
  getDownloadLink
} from '~/utils'
import getUsersForNotification from '../../User/user-data/utils/_getUsersForNotification'
import allSettled from 'promise.allsettled'

const slugfunction = require('slug')

export const mutationTypes = `
  type Mutation {
    addNewTeam(inputData: OrganizationAddTeamData): Team @${isInnentialAdmin}
    createNewTeam(inputData: OrganizationCreateTeamData): String @${isAdmin}
    renameTeam(teamName: String!, teamId: ID!): Team @${isUser}

    addMember(inputdata: MemberInput!): String @${isInnentialAdmin}
    archiveTeam(teamId: ID!): Team @${isAdmin}
    deleteTeam(teamId: ID!): String @${isAdmin}
    changeTeamLeader(inputdata: MemberInput!): String @${isInnentialAdmin}

    addTeamLearningContent(inputdata: TeamContentInput!): String @${isInnentialAdmin}
    deleteTeamLearningContent(contentId: ID!): String @${isInnentialAdmin}
    toggleMembersGetReport(teamId: ID!): Boolean @${isInnentialAdmin}

    addNewMember(inputData: MemberInput!): Member @${isUser}
    removeTeamMember(uid: String!, teamId: String!): String @${isUser}
    setNewLeader(uid: String!, teamId: String!): String @${isUser}

    setTeamsRequiredSkills(inputData: TeamRelevancyInput!): String @${isUser}
    setTeamRecommendedLearningPaths(recommendedPaths: [ID], teamId: ID!): Team @${isInnentialAdmin}
  }
`

const { innentialFbUrl } = typeform

const addRequiredToProfile = (skills, userQuery) =>
  Promise.all(
    skills.map(async ({ skillId }) => {
      const skillFound = await Skills.findById(skillId)
        .select({ slug: 1 })
        .lean()

      if (!skillFound) return

      await UserProfile.updateMany(
        {
          user: userQuery,
          'selectedWorkSkills._id': {
            $ne: skillId
          }
        },
        {
          $push: {
            selectedWorkSkills: {
              _id: skillId,
              slug: skillFound.slug,
              level: 0
            }
          },
          $set: {
            updatedAt: new Date()
          }
        }
      )
    })
  )

export const mutationResolvers = {
  Mutation: {
    addNewTeam: async (
      _,
      { inputData: { organizationId, teamName, leader, members } },
      { user }
    ) => {
      const organization = await Organization.findById(organizationId)
      if (!organization) throw new Error(`Organization not found`)
      const { organizationName } = organization

      const team = await Team.findOne({
        teamName,
        organizationId,
        active: true
      })
      if (team) throw new Error(`Team with that name already exists`)

      const leaderCheck = await User.findOne({ email: leader })
      const appLink = `${appUrls['user']}`

      const teamId = new Types.ObjectId()

      if (
        leaderCheck &&
        leaderCheck.organizationId &&
        !organization._id.equals(leaderCheck.organizationId)
      )
        throw new Error(
          `${leaderCheck.email} belongs to a different organization`
        )

      const leaderUser = await User.findOneAndUpdate(
        { email: leader },
        { $set: { organizationId: organizationId } }
      )

      const usersForEmail = await getUsersForNotification({
        email: { $in: [leader, ...members] }
      })

      if (leaderUser) {
        const { firstName, email } = leaderUser
        try {
          if (leaderUser.invitation.pendingInvitation) {
            appLink &&
              (await sendEmail(
                email,
                `You are invited to a new team at ${organization.organizationName}`,
                firstInvitationTemplate({
                  invitingPerson: null,
                  organizationName: organization.organizationName,
                  invitation: leaderUser.invitation.pendingInvitation,
                  appUrl: appLink,
                  users: usersForEmail,
                  totalCount:
                    (await User.countDocuments({
                      organizationId,
                      status: 'active'
                    })) - usersForEmail.length
                })
              ))
          } else {
            appLink &&
              (await sendEmail(
                email,
                `You have been added to a new team at ${organization.organizationName}`,
                changeTeamLeaderTemplate({
                  name: firstName,
                  teamName,
                  organizationName,
                  admin: 'Organizational Admin',
                  appUrl: `${appLink}/teams`
                })
              ))
          }
        } catch (e) {
          sentryCaptureException(e)
          console.log(`Failed to send email to: ${email} reason: ${e}`)
        }
      } else {
        const newUser = await User.create({
          // firstName: leader.name,
          email: leader,
          roles: [ROLES_PERMISSIONS.USER.NAME],
          permissions: [
            ...ROLES_PERMISSIONS.USER.PERMISSIONS[SCOPES.OPERATION.READ].map(
              permission => `${SCOPES.OPERATION.READ}:${permission}`
            )
          ],
          organizationId: organizationId,
          status: 'invited',
          invitation: {
            pendingInvitation: new Types.ObjectId(),
            invitedOn: Date.now()
          }
        })
        if (newUser) {
          const { /* firstName, */ email, invitation } = newUser
          try {
            appLink &&
              (await sendEmail(
                email,
                `You are invited to a new team at ${organization.organizationName}`,
                firstInvitationTemplate({
                  invitingPerson: null,
                  organizationName: organization.organizationName,
                  invitation: invitation.pendingInvitation,
                  appUrl: appLink,
                  users: usersForEmail,
                  totalCount:
                    (await User.countDocuments({
                      organizationId,
                      status: 'active'
                    })) - usersForEmail.length
                })
              ))
          } catch (e) {
            sentryCaptureException(e)
            console.log(`Failed to send email to: ${email} reason: ${e}`)
          }
        }
      }

      const leaderData = await User.findOne({ email: leader }).lean()

      const allMembers = await Promise.all(
        members.map(async member => {
          const memberCheck = await User.findOne({ email: member })

          if (
            memberCheck &&
            memberCheck.organizationId &&
            !organization._id.equals(memberCheck.organizationId)
          )
            throw new Error(
              `${memberCheck.email} belongs to a different organization`
            )

          const memberUser = await User.findOneAndUpdate(
            { email: member },
            { $set: { organizationId: organizationId } }
          )
          if (memberUser) {
            const { _id, firstName, email } = memberUser
            try {
              if (memberUser.invitation.pendingInvitation) {
                appLink &&
                  (await sendEmail(
                    email,
                    `You are invited to a new team at ${organization.organizationName}`,
                    firstInvitationTemplate({
                      invitingPerson: null,
                      organizationName: organization.organizationName,
                      invitation: memberUser.invitation.pendingInvitation,
                      appUrl: appLink,
                      users: usersForEmail,
                      totalCount:
                        (await User.countDocuments({
                          organizationId,
                          status: 'active'
                        })) - usersForEmail.length
                    })
                  ))
              } else {
                appLink &&
                  (await sendEmail(
                    email,
                    `You have been added to a new team at ${organization.organizationName}`,
                    existingTeamMemberInvitationTemplate({
                      name: firstName,
                      teamName,
                      organizationName,
                      leader: 'Team Leader',
                      appUrl: `${appLink}/teams`
                    })
                  ))
              }
            } catch (e) {
              sentryCaptureException(e)
              console.log(`Failed to send email to: ${email} reason: ${e}`)
            }

            return _id
          } else {
            const newUser = await User.create({
              // firstName: member.name,
              email: member,
              roles: [ROLES_PERMISSIONS.USER.NAME],
              permissions: [
                ...ROLES_PERMISSIONS.USER.PERMISSIONS[
                  SCOPES.OPERATION.READ
                ].map(permission => `${SCOPES.OPERATION.READ}:${permission}`)
              ],
              organizationId: organizationId,
              status: 'invited',
              invitation: {
                pendingInvitation: new Types.ObjectId(),
                invitedOn: Date.now()
              }
            })
            if (newUser) {
              const { _id /*, firstName */, email, invitation } = newUser
              try {
                appLink &&
                  (await sendEmail(
                    email,
                    `You are invited to a new team at ${organization.organizationName}`,
                    firstInvitationTemplate({
                      invitingPerson: null,
                      organizationName: organization.organizationName,
                      invitation: newUser.invitation.pendingInvitation,
                      appUrl: appLink,
                      users: usersForEmail,
                      totalCount:
                        (await User.countDocuments({
                          organizationId,
                          status: 'active'
                        })) - usersForEmail.length
                    })
                  ))
              } catch (e) {
                sentryCaptureException(e)
                console.log(`Failed to send email to: ${email} reason: ${e}`)
              }
              return _id
            }
          }
        })
      )

      const newTeam = await Team.create({
        _id: teamId,
        teamName,
        slug: slugfunction(teamName, {
          replacement: '_'
        }),
        organizationId: organization._id,
        leader: leaderData._id,
        createdAt: Date.now(),
        members: allMembers
      })

      await TeamContentStats.create({
        teamId: newTeam._id
      })

      return newTeam
    },
    createNewTeam: async (
      _,
      { inputData: { teamName, leader, members, invite } },
      { user: { _id, organizationId } }
    ) => {
      // const { _id, email, organizationId } = user
      const addingUser = await User.findById(_id)

      if (!addingUser) {
        throw new Error('Something went wrong')
      }

      const appLink = `${appUrls['user']}`

      let addedMembers = []
      // if (
      //   _id !== undefined &&
      //   email !== undefined &&
      //   organizationId !== undefined
      // ) {
      try {
        const teamId = new Types.ObjectId()

        const organization = await Organization.findOne({
          _id: organizationId
        })
        // if (
        //   organization &&
        //   organization.admins.some(
        //     adminId => adminId.toString() === _id.toString()
        //   )
        // ) {

        const existingTeam = await Team.findOne({
          teamName,
          organizationId,
          active: true
        })

        if (existingTeam) {
          return 'A team with that name already exists in this organization'
        }

        const usersForEmail = await getUsersForNotification({
          email: { $in: [leader, ...members] }
        })

        const invitingPerson = {
          name: `${addingUser.firstName} ${addingUser.lastName}`,
          roleAtWork: await addingUser.getRoleAtWork(),
          imgLink: await getDownloadLink({
            _id: addingUser._id,
            key: 'users/profileImgs',
            expires: 604800
          })
        }

        const allMembers = await Promise.all(
          members.map(async member => {
            const memberUser = await User.findOne({ email: member })

            if (
              memberUser &&
              memberUser.organizationId &&
              String(organizationId) !== String(memberUser.organizationId)
              // !organization._id.equals(memberUser.organizationId)
            )
              throw new Error('User belongs to a different organization!')

            if (memberUser) {
              if (!memberUser.organizationId) {
                await User.findOneAndUpdate(
                  { email: memberUser.email },
                  { $set: { organizationId: organization._id } }
                )
              }
              if (memberUser.status !== 'active') {
                addedMembers.push({ user: memberUser, isNewUser: true })
              } else {
                addedMembers.push({ user: memberUser, isNewUser: false })
              }
              return memberUser._id
            } else {
              const newUser = await User.create({
                email: member,
                // firstName: member.name,
                roles: [ROLES_PERMISSIONS.USER.NAME],
                permissions: [
                  ...ROLES_PERMISSIONS.USER.PERMISSIONS[
                    SCOPES.OPERATION.READ
                  ].map(permission => `${SCOPES.OPERATION.READ}:${permission}`)
                ],
                organizationId: organization._id,
                status: invite ? 'invited' : 'disabled',
                ...(invite && {
                  invitation: {
                    pendingInvitation: new Types.ObjectId(),
                    invitedOn: Date.now()
                  }
                })
              })

              if (newUser) {
                addedMembers.push({ user: newUser, isNewUser: true })
                return newUser._id
              }
            }
          })
        )

        const leaderUser = await User.findOne({ email: leader })

        if (leaderUser) {
          if (
            leaderUser.organizationId &&
            !organization._id.equals(leaderUser.organizationId)
          ) {
            throw new Error('User belongs to a different organization!')
          } else {
            if (!leaderUser.organizationId) {
              await User.findOneAndUpdate(
                { email: leaderUser.email },
                { $set: { organizationId: organization._id } }
              )
            }
            const { /* firstName, */ email } = leaderUser
            if (leaderUser.status !== 'active') {
              appLink &&
                invite &&
                (await sendEmail(
                  email,
                  `You are invited to a new team at ${organization.organizationName}`,
                  firstInvitationTemplate({
                    invitingPerson,
                    organizationName: organization.organizationName,
                    invitation: leaderUser.invitation.pendingInvitation,
                    appUrl: appLink,
                    users: usersForEmail,
                    totalCount:
                      (await User.countDocuments({
                        organizationId,
                        status: 'active'
                      })) - usersForEmail.length
                  })
                ))
            } else {
              appLink &&
                (await sendEmail(
                  leaderUser.email,
                  `You have been added to a new team at ${organization.organizationName}`,
                  changeTeamLeaderTemplate({
                    name: leaderUser.firstName,
                    teamName,
                    organizationName: organization.organizationName,
                    admin: `${addingUser.firstName} ${addingUser.lastName}`,
                    appUrl: `${appLink}/teams`
                  })
                ))
            }
          }
        } else {
          const newLeader = await User.create({
            email: leader,
            // firstName: leader.name,
            roles: [ROLES_PERMISSIONS.USER.NAME],
            permissions: [
              ...ROLES_PERMISSIONS.USER.PERMISSIONS[SCOPES.OPERATION.READ].map(
                permission => `${SCOPES.OPERATION.READ}:${permission}`
              )
            ],
            organizationId: organization._id,
            status: invite ? 'invited' : 'disabled',
            ...(invite && {
              invitation: {
                pendingInvitation: new Types.ObjectId(),
                invitedOn: Date.now()
              }
            })
          })
          if (newLeader) {
            appLink &&
              invite &&
              (await sendEmail(
                newLeader.email,
                `${invitingPerson.name} invited you to join Innential`,
                firstInvitationTemplate({
                  invitingPerson,
                  organizationName: organization.organizationName,
                  invitation: newLeader.invitation.pendingInvitation,
                  appUrl: appLink,
                  corporate: organization.corporate,
                  users: usersForEmail,
                  totalCount:
                    (await User.countDocuments({
                      organizationId,
                      status: 'active'
                    })) - usersForEmail.length
                })
              ))
          }
        }

        const leaderData = await User.findOne({
          email: leader
        }).lean()

        const newTeam = await Team.create({
          _id: teamId,
          teamName,
          slug: slugfunction(teamName, {
            replacement: '_',
            lower: true
          }),
          organizationId: organization._id,
          leader: leaderData._id,
          members: [...allMembers]
        })

        await TeamContentStats.create({
          teamId: newTeam._id
        })

        if (addedMembers.length > 0) {
          await sendTeamInvitesToMembers(
            addedMembers.filter(member => invite || !member.isNewUser),
            `${addingUser.firstName} (${addingUser.email})`,
            organization,
            newTeam,
            appLink,
            invitingPerson,
            usersForEmail
          )
        }

        return 'success'
        // } else {
        //   return null
        // }
      } catch (e) {
        sentryCaptureException(e)
        if (e.message === 'User belongs to a different organization!') {
          return e.message
        } else return null
      }
      // } else {
      //   return null
      // }
    },
    renameTeam: async (
      _,
      { teamName, teamId },
      { user: { _id, organizationId, roles } }
    ) => {
      const team = await Team.findById(teamId)
        .select({ organizationId: 1, leader: 1 })
        .lean()
      if (!team) throw new Error(`Team does not exist`)

      const sameOrganization =
        String(team.organizationId) === String(organizationId)
      const permission =
        roles.indexOf('ADMIN') !== -1 || String(team.leader) === String(_id)
      if (!sameOrganization || !permission) throw new Error(`Forbidden!`)

      const existingTeam = await Team.findOne({
        organizationId,
        teamName,
        active: true
      })
        .select({ _id: 1 })
        .lean()
      if (existingTeam) throw new Error(`Team with that name exists`)

      try {
        const result = await Team.findByIdAndUpdate(
          team._id,
          {
            $set: {
              teamName,
              updatedAt: new Date()
            }
          },
          { new: true }
        )
        return result
      } catch (error) {
        sentryCaptureException(error)
        throw new Error(`Something went wrong`)
      }
    },
    addMember: async (_, { inputdata: { email, teamId } }, context) => {
      const team = await Team.findById(teamId)
      if (!team) {
        throw new Error(`No such team exists`)
      }
      const addingUser = await User.findById(context.user._id)
      if (!addingUser) throw new Error('Something went wrong')

      const leader = await User.findById(team.leader)
      const members = await Promise.all(
        team.members.map(async member => {
          const user = await User.findById(member)
          return user
        })
      )

      if (leader.email === email)
        throw new Error(`This user is already the leader of this team`)

      if (members.findIndex(member => member.email === email) !== -1)
        throw new Error(`User is already a member of the team`)

      const appLink = `${appUrls['user']}`
      const newMember = await User.findOne({ email })
      const organization = await Organization.findById(team.organizationId)
      const adminUser = await User.findById(organization.admins[0])

      const invitingPerson = {
        name: `${addingUser.firstName} ${addingUser.lastName}`,
        roleAtWork: await addingUser.getRoleAtWork(),
        imgLink: await getDownloadLink({
          _id: addingUser._id,
          key: 'users/profileImgs',
          expires: 604800
        })
      }

      const usersForEmail = await getUsersForNotification({
        _id: { $in: [team.leader, ...team.members] }
      })

      if (!newMember) {
        try {
          const newUser = await User.create({
            // firstName: name,
            email,
            roles: [ROLES_PERMISSIONS.USER.NAME],
            permissions: [
              ...ROLES_PERMISSIONS.USER.PERMISSIONS[SCOPES.OPERATION.READ].map(
                permission => `${SCOPES.OPERATION.READ}:${permission}`
              )
            ],
            organizationId: organization._id,
            status: 'invited',
            invitation: {
              pendingInvitation: new Types.ObjectId(),
              invitedOn: Date.now()
            }
          })
          if (team.autoassignedPaths.length > 0) {
            await allSettled(
              await team.autoassignedPaths.reduce(
                async (arr, autoassignedPath) => {
                  try {
                    await arr
                    return [
                      ...(await arr),
                      await context.dataSources.LearningPath.transform({
                        organization: newUser.organizationId,
                        userId: context.user._id,
                        id: autoassignedPath,
                        targetUser: newUser._id
                      })
                    ]
                  } catch (e) {
                    sentryCaptureException(new Error(`Error : ${e}`))
                  }
                },
                []
              )
            )
          }
          appLink &&
            (await sendEmail(
              newUser.email,
              `You are invited to a new team at ${organization.organizationName}`,
              firstInvitationTemplate({
                invitingPerson,
                organizationName: organization.organizationName,
                invitation: newUser.invitation.pendingInvitation,
                appUrl: appLink,
                users: usersForEmail,
                totalCount:
                  (await User.countDocuments({
                    organizationId: organization._id,
                    status: 'active'
                  })) - usersForEmail.length
              })
            ))
          await Team.findOneAndUpdate(
            { _id: team._id },
            {
              $set: {
                members: [...team.members, newUser._id]
              }
            }
          )
          return newUser.email
        } catch (e) {
          sentryCaptureException(e)
          throw new Error(`Error creating user`)
        }
      } else {
        if (
          newMember.organizationId &&
          team.organizationId !== newMember.organizationId
        )
          throw new Error(`Member belongs to a different organization`)
        if (!newMember.organizationId) {
          await User.findOneAndUpdate(
            { _id: newMember._id },
            {
              $set: {
                organizationId: organization._id
              }
            }
          )
          if (organization.corporate) {
            const requiredSkills = team.requiredSkills || []
            await addRequiredToProfile(requiredSkills, newMember._id)
          }
        }
        await Team.findOneAndUpdate(
          { _id: team._id },
          {
            $set: {
              members: [...team.members, newMember._id]
            }
          }
        )
        if (newMember.invitation.pendingInvitation) {
          appLink &&
            (await sendEmail(
              newMember.email,
              `You are invited to a new team at ${organization.organizationName}`,
              firstInvitationTemplate({
                invitingPerson,
                organizationName: organization.organizationName,
                invitation: newMember.invitation.pendingInvitation,
                appUrl: appLink,
                users: usersForEmail,
                totalCount:
                  (await User.countDocuments({
                    organizationId: organization._id,
                    status: 'active'
                  })) - usersForEmail.length
              })
            ))
        } else {
          appLink &&
            (await sendEmail(
              newMember.email,
              `You have been added to a new team at ${organization.organizationName}`,
              addTeamMemberTemplate({
                // name: newMember.firstName,
                teamName: team.teamName,
                leader: `${addingUser.firstName} ${addingUser.lastName}`,
                organizationName: organization.organizationName,
                appUrl: `${appLink}/teams`,
                adminName: adminUser.firstName
              })
            ))
          return 'success'
        }
      }
    },
    archiveTeam: async (_, { teamId }) => {
      const team = await Team.findById(teamId)
      if (!team) throw new Error(`No such team exists`)

      try {
        await TeamStageResult.deleteOne({ teamId: team._id, engagement: null })
        const result = await Team.findOneAndUpdate(
          { _id: team._id },
          {
            $set: {
              active: false
            }
          },
          { new: true }
        )
        return result
      } catch (err) {
        sentryCaptureException(err)
      }
    },
    deleteTeam: async (_, { teamId }) => {
      const team = await Team.findById(teamId)
      if (!team) throw new Error(`No such team exists`)

      try {
        await TeamStageResult.deleteOne({ teamId: team._id, engagement: null })
        await Team.findByIdAndRemove(teamId)
        await TeamLearningContent.deleteOne({ teamId: team._id })
        await TeamSharedContentList.deleteOne({ teamId: team._id })

        return 'success'
      } catch (err) {
        sentryCaptureException(err)
      }
    },
    changeTeamLeader: async (
      _,
      { inputdata: { name, email, teamId } },
      context
    ) => {
      const team = await Team.findById(teamId)
      const addingUser = await User.findById(context.user._id)
      if (!team) throw new Error(`No such team exists`)
      if (!addingUser) throw new Error('Something went wrong!')

      const oldLeader = await User.findById(team.leader)

      if (oldLeader.email === email) {
        throw new Error(`This user is already the leader of this team`)
      }

      const appLink = `${appUrls['user']}`
      const organization = await Organization.findById(team.organizationId)
      const newLeader = await User.findOne({ email })
      if (!newLeader) {
        try {
          const newUser = await User.create({
            firstName: name,
            email,
            roles: [ROLES_PERMISSIONS.USER.NAME],
            permissions: [
              ...ROLES_PERMISSIONS.USER.PERMISSIONS[SCOPES.OPERATION.READ].map(
                permission => `${SCOPES.OPERATION.READ}:${permission}`
              )
            ],
            organizationId: organization._id,
            status: 'invited',
            invitation: {
              pendingInvitation: new Types.ObjectId(),
              invitedOn: Date.now()
            }
          })
          await Team.findOneAndUpdate(
            { _id: team._id },
            {
              $set: {
                leader: newUser._id,
                members: [...team.members, oldLeader._id]
              }
            }
          )

          appLink &&
            (await sendEmail(
              newUser.email,
              `You are invited to a new team at ${organization.organizationName}`,
              newTeamLeaderInvitationTemplate({
                // name: newUser.firstName,
                teamName: team.teamName,
                admin: `${addingUser.firstName} ${addingUser.lastName} (${addingUser.email})`,
                organizationName: organization.organizationName,
                invitation: newUser.invitation.pendingInvitation,
                appUrl: appLink
              })
            ))
          return newUser.email
        } catch (e) {
          sentryCaptureException(e)
        }
      } else {
        try {
          if (
            newLeader.organizationId &&
            newLeader.organizationId !== team.organizationId
          )
            throw new Error(`This user is part of a different organization`)

          await Team.findOneAndUpdate(
            { _id: team._id },
            {
              $set: {
                leader: newLeader._id,
                members: [
                  ...team.members.filter(
                    member => !member.equals(newLeader._id)
                  ), // Check if new leader wasn't a member before
                  oldLeader._id
                ]
              }
            }
          )
          if (newLeader.invitation.pendingInvitation) {
            appLink &&
              (await sendEmail(
                newLeader.email,
                `You are invited to a new team at ${organization.organizationName}`,
                newTeamLeaderInvitationTemplate({
                  // name: firstName,
                  teamName: team.teamName,
                  organizationName: organization.organizationName,
                  admin: `${addingUser.firstName} ${addingUser.lastName}`,
                  invitation: newLeader.invitation.pendingInvitation,
                  appUrl: appLink
                })
              ))
          } else {
            appLink &&
              (await sendEmail(
                newLeader.email,
                'You have been appointed as a team leader',
                changeTeamLeaderTemplate({
                  name: newLeader.firstName,
                  teamName: team.teamName,
                  admin: `${addingUser.firstName} ${addingUser.lastName}`,
                  organizationName: organization.organizationName,
                  appUrl: `${appLink}/teams`
                })
              ))
          }
          return newLeader.email
        } catch (e) {
          sentryCaptureException(e)
          throw new Error(e)
        }
      }
    },
    addTeamLearningContent: async (_, { inputdata }) => {
      const newContent = await TeamLearningContent.create(inputdata)
      return newContent.title
    },
    toggleMembersGetReport: async (_, { teamId }) => {
      const team = await Team.findById(teamId)
      if (!team) throw new Error(`No such team exists`)

      try {
        await Team.findOneAndUpdate(
          { _id: team._id },
          {
            $set: {
              membersGetStageReport: !team.membersGetStageReport
            }
          }
        )
        return true
      } catch (e) {
        sentryCaptureException(e)
      }
    },
    addNewMember: async (
      _,
      { inputData: { teamId, email, invite } },
      context
    ) => {
      try {
        const team = await Team.findById(teamId)

        const organization = await Organization.findById(team.organizationId)

        const addingUser = await User.findById(context.user._id)
        if (!team) throw new Error(`No such team exists`)
        if (!organization) throw new Error(`No such organization exists`)
        if (!addingUser) throw new Error('Something went wrong!')
        const invitingPerson = {
          name: `${addingUser.firstName} ${addingUser.lastName}`,
          roleAtWork: await addingUser.getRoleAtWork(),
          imgLink: await getDownloadLink({
            _id: addingUser._id,
            key: 'users/profileImgs',
            expires: 604800
          })
        }
        const usersForEmail = await getUsersForNotification({
          _id: { $in: [team.leader, ...team.members] }
        })
        const adminUser = await User.findById(organization.admins[0])

        if (
          String(team.leader) === String(context.user._id) ||
          context.user.roles.includes('ADMIN')
        ) {
          const existingUser = await User.findOne({ email })

          if (existingUser) {
            if (
              existingUser.organizationId &&
              String(existingUser.organizationId) !==
                String(team.organizationId)
            )
              throw new Error('User belongs to a different organization')
            if (
              team.members.some(m => String(m) === String(existingUser._id)) ||
              String(team.leader) === String(existingUser._id)
            ) {
              throw new Error('User is already in team')
            }
            if (!existingUser.organizationId) {
              await User.findOneAndUpdate(
                { _id: existingUser._id },
                {
                  $set: {
                    organizationId: organization._id
                  }
                }
              )
              await UserProfile.findOneAndUpdate(
                { user: existingUser._id },
                {
                  $set: {
                    organizationId: organization._id
                  }
                }
              )
            }

            let newMembers = team.members
            newMembers.push(existingUser._id)
            const newTeam = await Team.findOneAndUpdate(
              { _id: teamId },
              {
                $set: {
                  members: newMembers
                }
              },
              { new: true }
            )

            if (organization.corporate) {
              const requiredSkills = team.requiredSkills || []
              await addRequiredToProfile(requiredSkills, existingUser._id)
            }
            if (newTeam) {
              const appLink = `${appUrls['user']}`
              if (existingUser.status !== 'active') {
                appLink &&
                  invite &&
                  (await sendEmail(
                    existingUser.email,
                    `${invitingPerson.name} invited you to join Innential`,
                    firstInvitationTemplate({
                      invitingPerson,
                      organizationName: organization.organizationName,
                      invitation: existingUser.invitation.pendingInvitation,
                      appUrl: appLink,
                      // customInvitationMessage:
                      //   orgSettings && orgSettings.customInvitationEnabled
                      //     ? orgSettings.customInvitationMessage
                      //     : false
                      corporate: organization.corporate,
                      users: usersForEmail,
                      totalCount:
                        (await User.countDocuments({
                          organizationId: organization._id,
                          status: 'active'
                        })) - usersForEmail.length
                    })
                  ))
              } else {
                appLink &&
                  (await sendEmail(
                    existingUser.email,
                    `You have been added to a new team at ${organization.organizationName}`,
                    addTeamMemberTemplate({
                      // name: existingUser.firstName,
                      teamName: team.teamName,
                      leader: `${addingUser.firstName} ${addingUser.lastName}`,
                      organizationName: organization.organizationName,
                      appUrl: `${appLink}/teams`,
                      adminName: adminUser ? adminUser.firstName : ''
                    })
                  ))

                return existingUser
              }
              return existingUser
            }
          } else {
            const newUser = await User.create({
              // firstName,
              email,
              roles: [ROLES_PERMISSIONS.USER.NAME],
              permissions: [
                ...ROLES_PERMISSIONS.USER.PERMISSIONS[
                  SCOPES.OPERATION.READ
                ].map(permission => `${SCOPES.OPERATION.READ}:${permission}`)
              ],
              organizationId: team.organizationId,
              status: invite ? 'invited' : 'disabled',
              ...(invite && {
                invitation: {
                  pendingInvitation: new Types.ObjectId(),
                  invitedOn: Date.now()
                }
              })
            })
            if (newUser) {
              let newMembers = team.members
              newMembers.push(newUser._id)
              if (team.autoassignedPaths.length > 0) {
                await allSettled(
                  await team.autoassignedPaths.reduce(
                    async (arr, autoassignedPath) => {
                      try {
                        await arr
                        return [
                          ...(await arr),
                          await context.dataSources.LearningPath.transform({
                            organization: newUser.organizationId,
                            userId: context.user._id,
                            id: autoassignedPath,
                            targetUser: newUser._id
                          })
                        ]
                      } catch (e) {
                        sentryCaptureException(new Error(`Error : ${e}`))
                      }
                    },
                    []
                  )
                )
              }
              const newTeam = await Team.findOneAndUpdate(
                { _id: teamId },
                {
                  $set: {
                    members: newMembers
                  }
                },
                { new: true }
              )
              if (newTeam) {
                const appLink = `${appUrls['user']}`
                const orgSettings = await OrganizationSettings.findOne({
                  organizationId: organization._id
                })
                appLink &&
                  invite &&
                  (await sendEmail(
                    newUser.email,
                    `${invitingPerson.name} invited you to join Innential`,
                    firstInvitationTemplate({
                      invitingPerson,
                      organizationName: organization.organizationName,
                      invitation: newUser.invitation.pendingInvitation,
                      appUrl: appLink,
                      // customInvitationMessage:
                      //   orgSettings && orgSettings.customInvitationEnabled
                      //     ? orgSettings.customInvitationMessage
                      //     : false
                      corporate: organization.corporate,
                      users: usersForEmail,
                      totalCount:
                        (await User.countDocuments({
                          organizationId: organization._id,
                          status: 'active'
                        })) - usersForEmail.length
                    })
                  ))

                return newUser
              }
            }
          }
        } else throw new Error(``)
      } catch (e) {
        sentryCaptureException(e)
        if (e.message === 'User belongs to a different organization') return e
        if (e.message === 'User is already in team')
          throw new Error(`User ${email} is already part of the team`)
        return null
      }
    },
    removeTeamMember: async (_, { uid, teamId }, context) => {
      try {
        const team = await Team.findById(teamId)
        if (!team) throw new Error(`No such team exists`)
        if (
          String(team.leader) === String(context.user._id) ||
          context.user.roles.includes('ADMIN')
        ) {
          const existingUser = await User.findById(uid)
          if (existingUser) {
            if (
              String(existingUser.organizationId) !==
              String(team.organizationId)
            )
              throw new Error('User belongs to a different organization')

            if (
              team.members.some(m => String(m) === String(existingUser._id))
            ) {
              const newMembers = team.members.reduce((acc, curr) => {
                if (String(curr) === String(existingUser._id)) return [...acc]
                else return [...acc, curr]
              }, [])
              const updatedTeam = await Team.findOneAndUpdate(
                { _id: teamId },
                {
                  $set: {
                    members: newMembers
                  }
                },
                { new: true }
              )
              const openAssessment = await TeamStageResult.findOne({
                teamId: team._id,
                assessmentIterator: team.stageAssessments
              })

              if (openAssessment) {
                const userData = {
                  email: existingUser.email
                }
                await axios
                  .post(`${innentialFbUrl}/team=${team._id}/remove`, userData)
                  .catch(err => {
                    throw new Error(err)
                  })
              }
              if (updatedTeam) {
                return 'success'
              }
            }
          } else {
            const newMembers = team.members.reduce((acc, curr) => {
              if (String(curr) === String(existingUser._id)) return [...acc]
              else return [...acc, curr]
            }, [])
            const updatedTeam = await Team.findOneAndUpdate(
              { _id: teamId },
              {
                $set: {
                  members: newMembers
                }
              },
              { new: true }
            )

            if (updatedTeam) {
              return 'success'
            }
          }
        }
      } catch (e) {
        sentryCaptureException(e)
        return null
      }
    },
    setNewLeader: async (_, { uid, teamId }) => {
      try {
        const team = await Team.findById(teamId)
        const oldLeader = team.leader
        const newMembers = team.members.map(m => {
          if (String(m) === uid) return oldLeader
          else return m
        })
        await Team.findByIdAndUpdate(teamId, {
          members: newMembers,
          leader: uid
        })
        return 'ok'
      } catch (error) {
        return 'oops'
      }
    },
    deleteTeamLearningContent: async (_, { contentId }) => {
      const teamContent = await TeamLearningContent.findOne({ _id: contentId })
      if (teamContent) {
        try {
          await TeamLearningContent.deleteOne({ _id: contentId })
          return 'Content removed'
        } catch (err) {
          sentryCaptureException(err)
          throw new Error(`${err}`)
        }
      } else return 'OK'
    },
    setTeamsRequiredSkills: async (
      _,
      { inputData: { teamId, skills } },
      { user: { firstName, organizationId } }
    ) => {
      try {
        const team = await Team.findByIdAndUpdate(teamId, {
          $set: {
            requiredSkills: skills
          }
        })

        const organization = await Organization.findById(organizationId)
          .select({ corporate: 1 })
          .lean()

        const corporate = organization && organization.corporate

        const { leader, members } = team

        const userIds = [leader, ...members]

        if (corporate) {
          // ADD REQUIRED SKILLS TO PROFILES (POSTFINANCE ONLY)
          await addRequiredToProfile(skills, { $in: userIds })
        }

        return 'success'
      } catch (e) {
        sentryCaptureException(e)
        return null
      }
    },
    setTeamRecommendedLearningPaths: async (_, { recommendedPaths, teamId }) =>
      Team.findOneAndUpdate(
        { _id: teamId },
        {
          $set: {
            recommendedPaths
          }
        },
        { new: true }
      )
  }
}
