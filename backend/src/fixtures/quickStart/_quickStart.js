import {
  User,
  Organization,
  UserProfile,
  UserContentInteractions,
  Team,
  Skills
} from '~/models'
import { ROLES_PERMISSIONS, SCOPES } from '~/config'
import { Types } from 'mongoose'
import slug from 'slug'
import { ENVIRONMENT } from '~/environment'
import quickStart from './_quickStartData.js'

export default async () => {
  const { QUICKSTART, SERVER } = process.env
  const production = SERVER === ENVIRONMENT.PRODUCTION
  const staging = SERVER === ENVIRONMENT.STAGING
  if (production || staging) return

  if (QUICKSTART === 'true') {
    const { testUser, testEmployees, testOrganization, testTeams } = quickStart

    if (!testUser.email) {
      console.log(
        'DATA FOR QUICKSTART NOT SPECIFIED; PLEASE CHECK ./_quickStartData.js'
      )
      return
    }

    const existingUser = await User.findOne({ email: testUser.email })
    if (existingUser) return

    const organizationId = new Types.ObjectId()

    try {
      const newUser = await User.create({
        ...testUser,
        roles: [ROLES_PERMISSIONS.USER.NAME, ROLES_PERMISSIONS.ADMIN.NAME],
        permissions: [
          ...ROLES_PERMISSIONS.USER.PERMISSIONS[SCOPES.OPERATION.READ].map(
            permission => `${SCOPES.OPERATION.READ}:${permission}`
          )
        ],
        organizationId
      })
      if (newUser) {
        const skills = await Skills.find({
          organizationSpecific: null,
          enabled: true
        }).lean()

        const adminWorkSkills = []
        const adminNeededSkills = []

        for (let i = 0; i < 1; ++i) {
          const skillSelect = skills[Math.floor(Math.random() * skills.length)]
          adminNeededSkills.push({
            _id: skillSelect._id,
            slug: skillSelect.slug
          })
        }
        for (let i = 0; i < 3; ++i) {
          const skillSelect = skills[Math.floor(Math.random() * skills.length)]
          const level = Math.floor(Math.random() * 3) + 1
          const prev = adminWorkSkills.find(s => s && s._id === skillSelect._id)
          if (prev) continue
          adminWorkSkills.push({
            _id: skillSelect._id,
            slug: skillSelect.slug,
            level
          })
        }

        await UserProfile.create({
          user: newUser._id,
          roleAtWork: 'Test Admin',
          organizationId,
          selectedWorkSkills: adminWorkSkills,
          neededWorkSkills: adminNeededSkills
        })

        await UserContentInteractions.create({
          user: newUser._id
        })

        const updatedUsers = testEmployees.map(employee => ({
          ...employee,
          roles: [ROLES_PERMISSIONS.USER.NAME],
          permissions: [
            ...ROLES_PERMISSIONS.USER.PERMISSIONS[SCOPES.OPERATION.READ].map(
              permission => `${SCOPES.OPERATION.READ}:${permission}`
            )
          ],
          organizationId
        }))

        User.insertMany(updatedUsers, async (error, docs) => {
          if (error) {
            throw new Error(error)
          } else {
            await Promise.all(
              docs.map(async employee => {
                const selectedWorkSkills = []
                const neededWorkSkills = []
                for (let i = 0; i < 1; ++i) {
                  const skillSelect =
                    skills[Math.floor(Math.random() * skills.length)]
                  neededWorkSkills.push({
                    _id: skillSelect._id,
                    slug: skillSelect.slug
                  })
                }
                for (let i = 0; i < 3; ++i) {
                  const skillSelect =
                    skills[Math.floor(Math.random() * skills.length)]
                  const level = Math.floor(Math.random() * 3) + 1
                  const prev = selectedWorkSkills.find(
                    s => s && s._id === skillSelect._id
                  )
                  if (prev) continue
                  selectedWorkSkills.push({
                    _id: skillSelect._id,
                    slug: skillSelect.slug,
                    level
                  })
                }

                await UserProfile.create({
                  user: employee._id,
                  roleAtWork: 'Test employee',
                  organizationId,
                  selectedWorkSkills,
                  neededWorkSkills
                })

                await UserContentInteractions.create({
                  user: employee._id
                })
              })
            )

            await Organization.create({
              _id: organizationId,
              slug: slug(testOrganization.organizationName, {
                replacement: '_',
                lower: true
              }),
              ...testOrganization,
              admins: [newUser._id]
            })

            const updatedTeams = await Promise.all(
              testTeams.map(async team => {
                const leader = await User.findOne({ email: team.leader })
                const memberIds = await Promise.all(
                  team.members.map(async email => {
                    const user = await User.findOne({ email })
                    return user._id
                  })
                )

                return {
                  ...team,
                  slug: slug(team.teamName, {
                    replacement: '_',
                    lower: true
                  }),
                  leader: leader._id,
                  members: memberIds,
                  organizationId
                }
              })
            )

            await Team.insertMany(updatedTeams, error => {
              if (error) {
                throw new Error(error)
              } else {
                console.log(`Quick-start successful`)
              }
            })
          }
        })
      } else {
        throw new Error(`Quickstart user couldn't be created`)
      }
    } catch (e) {
      console.log(`Quick-start error:${e.message}`)
    }
  }
}
