import { isInnentialAdmin, isAdmin } from '~/directives'
import {
  Organization,
  User,
  Team,
  TeamStageResult,
  Skills,
  OrganizationSettings,
  LearningPathTemplate
} from '~/models'
import { Types } from 'mongoose'
import {
  sendEmail,
  appUrls,
  adminInvitationTemplate,
  adminAssignmentOnboardedTemplate,
  employeeAddTemplate,
  employeeInvitationTemplate,
  sentryCaptureException
} from '~/utils'
import { ROLES_PERMISSIONS, SCOPES } from '~/config'
import {
  createDefaultLearningPaths,
  createDemoOrganization,
  resetDemoOrganization
} from './utils'
import cryptoRandomString from 'crypto-random-string'
import getUsersForNotification from '../../User/user-data/utils/_getUsersForNotification'
const slugfunction = require('slug')

// TODO: Update link urls after invitation accept page is introduced for user application
// TODO: To be discussed with Kris how to handle if an existing admin invited for new organization

export const mutationTypes = `
  type Mutation {
    addOrganization(inputData: OrganizationAddData!): Organization @${isInnentialAdmin}
    addDemoOrganization(inputData: OrganizationAddData!): Organization @${isInnentialAdmin}
    editOrganization(inputData: OrganizationEditData!): Organization @${isInnentialAdmin}
    deleteOrganization(organizationId: ID!): String @${isInnentialAdmin}
    resetDemoOrganization(organizationId: ID!): String @${isInnentialAdmin}
    addNewEmployee(inputData: OrganizationAddEmployeeData): Employees @${isInnentialAdmin}
    onboardOrganization(inputData: OrganizationOnboardingInput!): String @${isAdmin}
    setOrganizationLocations(locations: [String]): [String] @${isAdmin}
    setFeedbackVisibility(visible: Boolean): Boolean @${isAdmin}
    setCustomInvitationMessage(
      customInvitationMessage: String,
      customInvitationEnabled: Boolean
    ): CustomInvitationMessage @${isAdmin}
    toggleOrganizationIsPaying(value: Boolean!, organizationId: ID!): Organization @${isInnentialAdmin}
    setOrganizationPremium(value: Boolean!, organizationId: ID!): Organization @${isInnentialAdmin}
    activateOrganization(organizationId: ID!): Organization @${isInnentialAdmin}
    generateInviteLink: Organization @${isAdmin}
    toggleInviteLinkActive(active: Boolean): Organization @${isAdmin}
    toggleApprovalsForOrganization(approvals: Boolean): Organization @${isAdmin}
    toggleApprovalsForTeamLead(teamLeadApprovals: Boolean): Organization @${isAdmin}
    toggleOrganizationIsCorporate(corporate: Boolean!, organizationId: ID!): Organization @${isInnentialAdmin}
    toggleOrganizationFulfillment(fulfillment: Boolean!, organizationId: ID!): Organization @${isInnentialAdmin}
    toggleOrganizationTechnicians(technicians: Boolean!, organizationId: ID!): Organization @${isInnentialAdmin}
    toggleOrganizationEvents(events: Boolean!, organizationId: ID!): Organization @${isInnentialAdmin}
  }
`

// TODO: How to handle if a user is also invited as an admin for another organization
export const mutationResolvers = {
  Mutation: {
    addOrganization: async (
      _,
      { inputData: { organizationName, slug, admins } }
    ) => {
      const existingOrganization = await Organization.findOne({ slug })
      if (existingOrganization) {
        throw new Error('An organization with the same name exists')
      } else {
        let existingAdmins = []
        await Promise.all(
          admins.map(async email => {
            const user = await User.findOne({ email })
            if (user && user.roles.includes('ADMIN')) {
              // special creation case for innential_admin
              if (!user.roles.includes('INNENTIAL_ADMIN')) {
                existingAdmins.push(email)
              }
            }
          })
        )

        if (existingAdmins.length > 0) {
          throw new Error(
            `${existingAdmins.join(', ')} ${
              existingAdmins.length > 1
                ? 'are already admins'
                : 'is already an admin'
            } `
          )
        }

        const organizationId = new Types.ObjectId()
        const parsedData = {
          organizationName,
          slug,
          admins: await Promise.all(
            admins.map(async email => {
              // TODO: we can optimize this by not repeating User.findOne from above
              const user = await User.findOne({ email })
              if (!user) {
                const newUser = await User.create({
                  email,
                  roles: [
                    ROLES_PERMISSIONS.ADMIN.NAME,
                    ROLES_PERMISSIONS.USER.NAME
                  ],
                  permissions: [
                    ...ROLES_PERMISSIONS.ADMIN.PERMISSIONS[
                      SCOPES.OPERATION.READ
                    ].map(
                      permission => `${SCOPES.OPERATION.READ}:${permission}`
                    )
                  ],
                  organizationId,
                  status: 'invited',
                  invitation: {
                    pendingInvitation: new Types.ObjectId(),
                    invitedOn: Date.now()
                  }
                })
                if (newUser) {
                  const invitationLink = `${appUrls['user']}/accept-invitation/${newUser.invitation.pendingInvitation}`
                  invitationLink &&
                    (await sendEmail(
                      email,
                      'You are invited to Innential',
                      adminInvitationTemplate({
                        organizationName,
                        invitationLink
                      })
                    ))
                  return newUser._id
                }
              } else {
                if (!user.organizationId) {
                  console.log(
                    'User did not have an organization, adding as Admin'
                  )
                  await User.findOneAndUpdate(
                    { _id: user._id },
                    {
                      $set: {
                        roles: [...user.roles, ROLES_PERMISSIONS.ADMIN.NAME],
                        organizationId
                      }
                    }
                  )
                  const appLink = `${appUrls['user']}`
                  if (user.invitation.pendingInvitation) {
                    const invitationLink = `${appLink}/accept-invitation/${user.invitation.pendingInvitation}`
                    invitationLink &&
                      (await sendEmail(
                        email,
                        'You are invited to Innential',
                        adminInvitationTemplate({
                          organizationName,
                          invitationLink
                        })
                      ))
                  } else {
                    appLink &&
                      (await sendEmail(
                        email,
                        'You are added as an admin',
                        adminAssignmentOnboardedTemplate({
                          organizationName,
                          appUrl: appLink
                        })
                      ))
                  }
                }
                if (user.roles.includes('INNENTIAL_ADMIN')) {
                  const appLink = `${appUrls['user']}`
                  appLink &&
                    (await sendEmail(
                      email,
                      'You are added as an admin',
                      adminAssignmentOnboardedTemplate({
                        organizationName,
                        appUrl: appLink
                      })
                    ))
                  return user._id
                } else if (user) {
                  const orgCheck = await Organization.findById(
                    user.organizationId
                  )
                  if (!orgCheck) {
                    await User.findOneAndUpdate(
                      { _id: user._id },
                      {
                        $set: {
                          organizationId
                        }
                      }
                    )

                    return user._id
                  } else {
                    throw new Error(
                      'This user belongs to another active organization'
                    )
                  }
                } else {
                  throw new Error('This user is already an admin')
                }
              }
            })
          )
        }

        const disabledSkills = await Skills.find({ enabled: false })

        const result = await Organization.create({
          _id: organizationId,
          ...parsedData,
          disabledSkills
        })
        // We want to add default learning paths to new organizations the paths
        // have already been added to this organization so we get it from there
        try {
          createDefaultLearningPaths(slug, organizationId)
        } catch (error) {
          throw new Error(error.message)
        }

        return result
      }
    },
    addDemoOrganization: async (
      _,
      { inputData: { organizationName, slug, admins } }
    ) => {
      const existingOrganization = await Organization.findOne({ slug })
      let addedUsersId = ''
      // let invitationLink = null
      // let addedUsersEmail = null
      // let addedOrganizationName = null
      if (existingOrganization) {
        throw new Error('An organization with the same name exists')
      } else {
        let existingUsers = []
        await Promise.all(
          admins.map(async email => {
            const user = await User.findOne({ email })
            if (user) {
              // special creation case for innential_admin
              existingUsers.push(email)
            }
          })
        )

        if (existingUsers.length > 0) {
          throw new Error(
            `${existingUsers.join(', ')} ${
              existingUsers.length > 1
                ? 'are already admins'
                : 'is already an admin'
            } `
          )
        }

        const organizationId = new Types.ObjectId()
        const parsedData = {
          organizationName,
          slug,
          admins: await Promise.all(
            admins.map(async (email, i) => {
              const newUser = await User.create({
                email,
                roles: [
                  ROLES_PERMISSIONS.ADMIN.NAME,
                  ROLES_PERMISSIONS.USER.NAME
                ],
                permissions: [
                  ...ROLES_PERMISSIONS.ADMIN.PERMISSIONS[
                    SCOPES.OPERATION.READ
                  ].map(permission => `${SCOPES.OPERATION.READ}:${permission}`)
                ],
                organizationId,
                status: 'invited',
                invitation: {
                  pendingInvitation: new Types.ObjectId(),
                  invitedOn: Date.now()
                },
                isDemoUser: true
              })

              if (i === 0) addedUsersId = newUser._id

              const invitationLink = `${appUrls['user']}/accept-invitation/${newUser.invitation.pendingInvitation}`

              await sendEmail(
                email,
                'You are invited to Innential',
                adminInvitationTemplate({
                  organizationName,
                  invitationLink
                })
              )

              return newUser._id
            })
          )
        }

        const result = await Organization.create({
          _id: organizationId,
          isDemoOrganization: true,
          ...parsedData
        })

        // We want to add default learning paths to demo organizations, the paths
        // have already been added to this organization so we get it from there
        try {
          createDefaultLearningPaths(slug, organizationId)
        } catch (error) {
          throw new Error(error.message)
        }

        try {
          createDemoOrganization({
            organizationId,
            addedUsersId
          })
        } catch (e) {
          sentryCaptureException(e)
        }

        return result
      }
    },
    resetDemoOrganization: async (_, { organizationId }) => {
      try {
        const response = await resetDemoOrganization(organizationId)

        if (response === 'ok') {
          return 'success'
        } else {
          return response
        }
      } catch (e) {
        return e
      }
    },
    deleteOrganization: async (_, { organizationId }) => {
      const organization = await Organization.findOne({
        _id: organizationId
      })
      if (organization) {
        try {
          if (organization.isDemoOrganization) {
            await resetDemoOrganization(organizationId)
          }
          const users = await User.find({ organizationId })
          if (users.length > 0) {
            // TODO: REMOVE THIS! This is done to stop mutating users data (INNENTIAL_ADMIN SPECIAL CASE!)
            await Promise.all(
              users.map(async user => {
                if (!user.roles.includes('INNENTIAL_ADMIN')) {
                  await User.update(
                    { _id: user._id },
                    {
                      $set: {
                        roles: [ROLES_PERMISSIONS.USER.NAME],
                        permissions: [
                          ...ROLES_PERMISSIONS.USER.PERMISSIONS[
                            SCOPES.OPERATION.READ
                          ].map(
                            permission =>
                              `${SCOPES.OPERATION.READ}:${permission}`
                          )
                        ]
                      },
                      $unset: {
                        organizationId
                      }
                    }
                  )
                }
              })
            )
          }

          const teams = await Team.find({ organizationId })
          await Promise.all(
            teams.map(async team => {
              await TeamStageResult.deleteOne({
                teamId: team._id,
                engagement: null
              })
              await Team.deleteOne({ _id: team._id })
            })
          )

          await Organization.deleteOne({ _id: organizationId })
          return organizationId
        } catch (err) {
          sentryCaptureException(err)
        }
      }
      return 'OK'
    },
    editOrganization: async (_, { inputData }) => {
      const organizationSlug = slugfunction(inputData.organizationName, {
        replacement: '_',
        lower: true
      })
      const organization = await Organization.findOne({
        _id: inputData._id
      })
      if (!organization) {
        throw new Error('An organization with provided _id could not be found')
      } else {
        const parsedData = {
          ...organization._doc,
          organizationName: inputData.organizationName,
          slug: organizationSlug
        }
        const result = await Organization.findOneAndUpdate(
          { _id: parsedData._id },
          { ...parsedData },
          { new: true }
        )
        return result
      }
    },
    // TODO: Replace invitation after dedicated collection introduced
    // TODO: A new API later could be created to move createNewUser logic to make it more functional
    addNewEmployee: async (
      _,
      { inputData: { organizationId, employeeRole, employeeEmail } },
      { appId }
    ) => {
      const organization = await Organization.findById(organizationId)
      if (organization) {
        const { organizationName } = organization
        let employee = await User.findOne({ email: employeeEmail })

        const admin = employeeRole === ROLES_PERMISSIONS.ADMIN.NAME

        const appLink = appUrls['user']

        const sendInvite = async invitationLink => {
          const users = await getUsersForNotification({
            organizationId: organization._id
          })
          return sendEmail(
            employeeEmail,
            'You are invited to Innential',
            admin
              ? adminInvitationTemplate({
                  organizationName,
                  invitationLink,
                  users
                })
              : employeeInvitationTemplate({
                  organizationName,
                  invitationLink,
                  users
                })
          )
        }

        const roles = admin
          ? [ROLES_PERMISSIONS.ADMIN.NAME, ROLES_PERMISSIONS.USER.NAME]
          : [ROLES_PERMISSIONS.USER.NAME]

        if (employee) {
          if (employee.organizationId)
            throw new Error(`This user is already a part of an organization`)

          if (employee.invitation.pendingInvitation) {
            const invitationLink = `${appLink}/accept-invitation/${employee.invitation.pendingInvitation}`
            invitationLink && (await sendInvite(invitationLink))
          } else {
            appLink &&
              (await sendEmail(
                employeeEmail,
                admin
                  ? 'You have been added as an admin at Innential'
                  : 'You have been added to a new organization at Innential',
                admin
                  ? adminAssignmentOnboardedTemplate({
                      organizationName,
                      appUrl: appLink
                    })
                  : employeeAddTemplate({
                      organizationName,
                      appLink
                    })
              ))
          }

          return User.findOneAndUpdate(
            { _id: employee._id },
            {
              $set: {
                organizationId: organization._id,
                roles
              }
            },
            { new: true }
          )
        }

        employee = await User.create({
          email: employeeEmail,
          roles,
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

        if (employee) {
          const invitationLink = `${appLink}/accept-invitation/${employee.invitation.pendingInvitation}`
          invitationLink && (await sendInvite(invitationLink))
        }

        admin &&
          (await Organization.findOneAndUpdate(
            { _id: organization._id },
            {
              $addToSet: {
                admins: String(employee._id)
              }
            },
            { new: true }
          ))

        return employee
      } else {
        throw new Error('An organization with provided _id could not be found')
      }
    },
    onboardOrganization: async (_, { inputData }, context) => {
      const { _id } = context.user
      try {
        const user = await User.findOne({ _id })
        if (user) {
          const org = await Organization.findOneAndUpdate(
            { _id: user.organizationId },
            {
              $set: {
                organizationName: inputData.organizationName,
                slug: slugfunction(inputData.organizationName, {
                  replacement: '_',
                  lower: true
                }),
                size: inputData.organizationSize,
                industry: inputData.industry,
                locations: inputData.locations,
                approvals: inputData.approvals
              }
            },
            { new: true }
          )
          if (org) {
            return 'success'
          } else {
            console.log('Organization not found')
          }
        } else {
          console.log('user not found!')
        }
      } catch (e) {
        sentryCaptureException(e)
        return null
      }
    },
    setOrganizationLocations: async (
      _,
      { locations },
      { user: { organizationId } }
    ) => {
      try {
        const organization = await Organization.findById(organizationId).lean()
        if (!organization) {
          throw new Error('Organization not found')
        }

        await Organization.findOneAndUpdate(
          { _id: organizationId },
          {
            $set: {
              locations
            }
          }
        )

        return locations
      } catch (e) {
        sentryCaptureException(e)
        return []
      }
    },
    setCustomInvitationMessage: async (
      _,
      { customInvitationMessage = '', customInvitationEnabled },
      { user: { _id, organizationId } }
    ) => {
      const settingsCheck = await OrganizationSettings.findOne({
        organizationId
      })

      if (!settingsCheck) {
        const variables = customInvitationEnabled
          ? {
              customInvitationEnabled,
              customInvitationMessage,
              organizationId
            }
          : { organizationId, customInvitationMessage }
        const newSettings = await OrganizationSettings.create(variables)

        return newSettings
      } else {
        const variables = customInvitationEnabled
          ? {
              customInvitationEnabled,
              customInvitationMessage,
              organizationId
            }
          : {
              organizationId,
              customInvitationEnabled,
              customInvitationMessage
            }
        const newSettings = await OrganizationSettings.findOneAndUpdate(
          { organizationId },
          variables,
          { new: true }
        )

        return newSettings
      }
    },
    toggleOrganizationIsPaying: async (_, { value, organizationId }) => {
      try {
        const org = await Organization.findOneAndUpdate(
          { _id: organizationId },
          {
            $set: {
              isPayingOrganization: value
            }
          },
          { new: true }
        )

        return org
      } catch (e) {
        return e
      }
    },
    setOrganizationPremium: async (_, { value, organizationId }) => {
      return Organization.findOneAndUpdate(
        { _id: organizationId },
        {
          $set: {
            premium: value
          }
        },
        { new: true }
      )
    },
    setFeedbackVisibility: async (
      _,
      { visible },
      { user: { organizationId } }
    ) => {
      await Organization.findOneAndUpdate(
        { _id: organizationId },
        {
          $set: {
            feedbackVisible: visible
          }
        }
      )
      return visible
    },
    activateOrganization: async (_, { organizationId }) => {
      const organization = await Organization.findOneAndUpdate(
        { _id: organizationId },
        {
          $set: {
            disabled: false
          }
        },
        { new: true }
      )
      return organization
    },
    generateInviteLink: async (_, args, { user: { organizationId } }) => {
      return Organization.findOneAndUpdate(
        { _id: organizationId },
        {
          $set: {
            inviteLink: {
              token: cryptoRandomString({
                length: 32,
                type: 'url-safe'
              }),
              createdAt: new Date(),
              active: true
            }
          }
        },
        { new: true }
      )
    },
    toggleInviteLinkActive: async (
      _,
      { active },
      { user: { organizationId } }
    ) => {
      return Organization.findOneAndUpdate(
        { _id: organizationId },
        {
          $set: {
            'inviteLink.active': active
          }
        },
        { new: true }
      )
    },
    toggleApprovalsForOrganization: async (
      _,
      { approvals },
      { user: { organizationId } }
    ) => {
      return Organization.findOneAndUpdate(
        { _id: organizationId },
        {
          $set: {
            approvals
          }
        },
        { new: true }
      )
    },
    toggleApprovalsForTeamLead: async (
      _,
      { teamLeadApprovals },
      { user: { organizationId } }
    ) => {
      return Organization.findOneAndUpdate(
        { _id: organizationId },
        {
          $set: {
            teamLeadApprovals
          }
        },
        { new: true }
      )
    },
    toggleOrganizationIsCorporate: async (_, { corporate, organizationId }) =>
      Organization.findOneAndUpdate(
        { _id: organizationId },
        {
          $set: {
            corporate
          }
        },
        { new: true }
      ),
    toggleOrganizationFulfillment: async (_, { fulfillment, organizationId }) =>
      Organization.findOneAndUpdate(
        { _id: organizationId },
        {
          $set: {
            fulfillment
          }
        },
        { new: true }
      ),
    toggleOrganizationTechnicians: async (_, { technicians, organizationId }) =>
      Organization.findOneAndUpdate(
        { _id: organizationId },
        {
          $set: {
            technicians
          }
        },
        { new: true }
      ),
    toggleOrganizationEvents: async (_, { events, organizationId }) =>
      Organization.findOneAndUpdate(
        { _id: organizationId },
        {
          $set: {
            events
          }
        },
        { new: true }
      )
    // setUseCustomFrameworks: async (
    //   _,
    //   { useCustomFrameworks },
    //   { user: { organizationId } }
    // ) => {
    //   const organization = await Organization.findById(organizationId)
    //   if (organization) {
    //     const { useCustomFrameworks: prevValue } = organization
    //     if (useCustomFrameworks === prevValue) return null
    //     else {
    //       try {
    //         await Organization.findOneAndUpdate(
    //           { _id: organization._id },
    //           {
    //             $set: {
    //               useCustomFrameworks
    //             }
    //           }
    //         )
    //         return useCustomFrameworks
    //       } catch (e) {
    //         sentryCaptureException(e)
    //         return null
    //       }
    //     }
    //   } else return null
    // }
  }
}
