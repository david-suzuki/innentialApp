import { createTokens } from '~/authentication'
import { User, PasswordReset, UserProfile, Organization } from '~/models'
import { AUTH, ROLES_PERMISSIONS, SCOPES } from '~/config'
import {
  encryptor,
  sendEmail,
  appUrls,
  userAppPasswordResetTemplate,
  userAppInvitationTemplate,
  sentryCaptureException,
  employeeInvitationTemplate
} from '~/utils'

import { Types } from 'mongoose'
import getUserOnboardingInfo from '../user-data/utils/_getUserOnboardingInfo'
import { mailchimp } from '../../../config'
// import { makePublicResolver } from '../../../graphql'

export const mutationTypes = `
  type Mutation {
    publicLogin(input: UserCredentials): String
    logout: String
    publicResetPassword(email: String!): String
    publicResetPasswordSetPassword(password: String!, resetId: String!): String
    publicAcceptInvitation(pendingInvitation: String!): CompleteUserProfile
    publicCancelInvitation(userId: ID!): String
    publicSignupUser(password: String!, userId: ID!): String
    publicOnboardFromLink(email: String!, organizationId: ID!): String
  }
`

// MAILCHIMP LIST ID
const listId = process.env.MAILCHIMP_LIST_ID

export const mutationResolvers = {
  Mutation: {
    logout: () => {
      return 'ok' // This is gonna be taken care in server > formatResponse
    },
    // [`${PUBLIC_PREFIX}Login`] <--- this will not work
    // [makePublicResolver('login')]: async (_, { input }) => {
    publicLogin: async (_, { input }) => {
      const { email, password } = input
      const user = await User.findOne({ email })
      const validUser = await user.checkPassword(password)
      if (validUser) {
        const additionalClaims = {}
        const userData = {
          _id: validUser._id,
          firstName: validUser.firstName,
          email: validUser.email,
          roles: validUser.roles,
          permissions: validUser.permissions,
          organizationId: user.organizationId
        }
        const [token, refreshToken] = await createTokens(
          {
            user: userData,
            refreshTokenSecret: validUser.password + AUTH.SECRET_REFRESH_TOKEN
          },
          additionalClaims
        )
        const response = JSON.stringify({ token, refreshToken })
        return response
      }
      return null
    },
    publicAcceptInvitation: async (_, { pendingInvitation }) => {
      try {
        const user = await User.findOne({
          'invitation.pendingInvitation': pendingInvitation
        })

        try {
          // ADD USER TO MAILING LIST
          const response = await mailchimp.lists.addListMember(listId, {
            email_address: user.email,
            status: 'subscribed'
          })
          // BEGIN ONBOARDING JOURNEY
          await mailchimp.customerJourneys.trigger(
            process.env.MAILCHIMP_ONBOARDING_JOURNEY_ID,
            process.env.MAILCHIMP_ONBOARDING_JOURNEY_STEP_ID,
            {
              email_address: user.email
            }
          )
          // ADD ONBOARDING TAG
          await mailchimp.lists.updateListMemberTags(listId, response.id, {
            tags: [
              {
                name: 'Onboarding',
                status: 'active'
              }
            ]
          })
        } catch (err) {
          if (user) {
            sentryCaptureException(
              `Failed to add user ${user._id} to mailchimp list: ${err.message}`
            )
          } else {
            sentryCaptureException(`User not found : ${err}`)
          }
        }

        if (user) {
          return {
            user,
            onboardingInfo: await getUserOnboardingInfo(user._id)
          }
        } else {
          console.log('Invitation not found')
          return new Error('Invitation not found')
        }
      } catch (e) {
        sentryCaptureException(e)
        return null
      }
    },
    publicResetPassword: async (_, { email }, context) => {
      try {
        const user = await User.findOne({ email: email })
        if (user) {
          if (user.status === 'invited') {
            const newInvitationId = new Types.ObjectId()
            const updatedUser = await User.findByIdAndUpdate(user._id, {
              $set: {
                'invitation.pendingInvitation': newInvitationId,
                'invitation.acceptedOn': null
              }
            })
            if (updatedUser) {
              await sendEmail(
                email,
                'Account Reset',
                userAppInvitationTemplate({
                  invitation: newInvitationId,
                  appUrl: appUrls['user']
                })
              )
              return 'success'
            }
          } else if (
            user.status === 'active' ||
            user.status === 'not-onboarded'
          ) {
            const passwordReset = await PasswordReset.create({
              userEmail: email
            })
            await sendEmail(
              email,
              'Password reset',
              userAppPasswordResetTemplate({
                appUrl: appUrls['user'],
                resetId: passwordReset._id
              })
            )
            return 'success'
          }
        }
        return null
      } catch (e) {
        sentryCaptureException(e)
        return null
      }
    },
    publicResetPasswordSetPassword: async (
      _,
      { password, resetId },
      context
    ) => {
      try {
        const passwordReset = await PasswordReset.findById(resetId)
        if (passwordReset.acceptedAt) {
          // !null means the reset link has already been clicked
          throw new Error('You clicked an expired link!')
        } else {
          const dateNow = new Date(Date.now())
          const dateDiffInMinutes = Math.round(
            (dateNow.getTime() - passwordReset.createdAt.getTime()) / 60000
          )
          if (dateDiffInMinutes > 5) {
            throw new Error('You clicked an expired link!')
          } else {
            const user = await User.findOne({ email: passwordReset.userEmail })
            if (!user) {
              return null
            } else {
              const passResult = await PasswordReset.findOneAndUpdate(
                { _id: resetId },
                {
                  $set: {
                    acceptedAt: dateNow
                  }
                },
                { new: true }
              )
              const validPassword = await encryptor.encrypt({
                digest: password
              })
              const userResult = await User.findOneAndUpdate(
                { email: passwordReset.userEmail },
                {
                  $set: {
                    password: validPassword
                  }
                },
                { new: true }
              )
              if (userResult && passResult) {
                return 'success'
              } else {
                return null
              }
            }
          }
        }
      } catch (e) {
        sentryCaptureException(e)
        throw new Error('Bad link')
      }
    },
    publicSignupUser: async (_, { userId: _id, password }) => {
      const validPassword = await encryptor.encrypt({ digest: password })
      try {
        // const tempUser = await User.findOne({ _id })
        // if (tempUser.password === undefined) {
        const user = await User.findOneAndUpdate(
          { _id },
          {
            $set: {
              password: validPassword,
              // firstName: firstName,
              // lastName: lastName,
              status: 'not-onboarded',
              'invitation.pendingInvitation': '',
              'invitation.acceptedOn': Date.now()
            }
          },
          {
            new: true
          }
        )
        if (user) {
          const userData = {
            _id: user._id,
            // firstName: user.firstName,
            email: user.email,
            roles: user.roles,
            permissions: user.permissions,
            organizationId: user.organizationId
          }
          const additionalClaims = {}
          const [token, refreshToken] = await createTokens(
            {
              user: userData,
              refreshTokenSecret: user.password + AUTH.SECRET_REFRESH_TOKEN
            },
            additionalClaims
          )
          const response = JSON.stringify({ token, refreshToken })
          return response
        } else return null
        // } // TODO: FLIP THESE AROUND!
        // else if (context.user._id === _id) {
        //   const user = await User.findOneAndUpdate(
        //     { _id },
        //     {
        //       $set: {
        //         password: validPassword,
        //         firstName: firstName,
        //         lastName: lastName,
        //         'invitation.pendingInvitation': '',
        //         'invitation.acceptedOn': Date.now()
        //       }
        //     },
        //     {
        //       new: true
        //     }
        //   )
        //   if (user) {
        //     const additionalClaims = {}
        //     const userData = {
        //       _id: user._id,
        //       firstName: user.firstName,
        //       email: user.email,
        //       roles: user.roles,
        //       permissions: user.permissions,
        //       organizationId: user.organizationId
        //     }
        //     const [token, refreshToken] = await createTokens(
        //       {
        //         user: userData,
        //         refreshTokenSecret: user.password + AUTH.SECRET_REFRESH_TOKEN
        //       },
        //       additionalClaims
        //     )
        //     const response = JSON.stringify({ token, refreshToken })
        //     return response
        //   }
        // }
        // return null
      } catch (e) {
        sentryCaptureException(e)
        console.log('There was an error while signing the user up!', e)
        throw new Error("Couldn't finalize user creation")
      }
    },
    publicCancelInvitation: async (_, { userId }) => {
      try {
        const user = await User.findById(userId)
        if (user) {
          const result = await User.findByIdAndRemove(userId)
          if (result.roles.indexOf('ADMIN') !== -1) {
            const org = await Organization.findByIdAndUpdate(
              result.organizationId,
              {
                $pull: {
                  admins: userId
                }
              },
              { new: true }
            )
            if (org.admins.length === 0) {
              await Organization.findByIdAndRemove(result.organizationId)
            }
          }
          return 'Success'
        } else {
          sentryCaptureException(new Error(`User:${userId} not found`))
          return null
        }
      } catch (e) {
        sentryCaptureException(e)
        return null
      }
    },
    publicOnboardFromLink: async (_, { email, organizationId }) => {
      try {
        const existingUser = await User.findOne({ email })
          .select({ _id: 1 })
          .lean()

        if (existingUser) throw new Error(`ALREADY_REGISTERED`)

        const pendingInvitation = new Types.ObjectId()

        const user = await User.create({
          email,
          organizationId,
          roles: [ROLES_PERMISSIONS.USER.NAME],
          permissions: [
            ...ROLES_PERMISSIONS.USER.PERMISSIONS[SCOPES.OPERATION.READ].map(
              permission => `${SCOPES.OPERATION.READ}:${permission}`
            )
          ],
          status: 'invited',
          invitation: {
            pendingInvitation,
            invitedOn: new Date()
          }
        })

        await sendEmail(
          email,
          'You are invited to Innential',
          employeeInvitationTemplate({
            organizationName: (
              await Organization.findById(organizationId)
                .select({ organizationName: 1 })
                .lean()
            ).organizationName,
            invitationLink: `${appUrls['user']}/accept-invitation/${pendingInvitation}`
          })
        )

        return 'OK'
      } catch (e) {
        sentryCaptureException(e)
        throw e
      }
    }
  }
}
