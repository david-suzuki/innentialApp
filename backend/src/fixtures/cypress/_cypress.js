import {
  User,
  Organization,
  UserProfile,
  UserContentInteractions,
  Team,
  Skills
} from '~/models'
import { user, organization, profile, teams } from './_cypressData'
import { Types } from 'mongoose'
import slug from 'slug'
import { ENVIRONMENT } from '~/environment'

export default async () => {
  const { SERVER } = process.env
  const production = SERVER === ENVIRONMENT.PRODUCTION
  const staging = SERVER === ENVIRONMENT.STAGING

  if (production || staging) return

  const cypressUser = await User.findOne({ email: 'cypress@test.email' })
  if (cypressUser) return

  const organizationId = new Types.ObjectId()

  try {
    const newUser = await User.create({
      ...user,
      organizationId
    })
    if (newUser) {
      const skills = await Skills.find({
        organizationSpecific: null,
        enabled: true
      }).lean()

      const selectedWorkSkills = []
      const neededWorkSkills = []
      for (let i = 0; i < 1; ++i) {
        const skillSelect = skills[Math.floor(Math.random() * skills.length)]
        neededWorkSkills.push({
          _id: skillSelect._id,
          slug: skillSelect.slug
        })
      }
      for (let i = 0; i < 3; ++i) {
        const skillSelect = skills[Math.floor(Math.random() * skills.length)]
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
        user: newUser._id,
        ...profile,
        organizationId,
        selectedWorkSkills,
        neededWorkSkills
      })

      await UserContentInteractions.create({
        user: newUser._id
      })

      await Organization.create({
        _id: organizationId,
        slug: slug(organization.organizationName, {
          replacement: '_',
          lower: true
        }),
        ...organization,
        admins: [newUser._id]
      })

      const updatedTeams = teams.map(team => ({
        ...team,
        slug: slug(team.teamName, {
          replacement: '_',
          lower: true
        }),
        leader: newUser._id,
        organizationId
      }))

      await Team.insertMany(updatedTeams)

      console.log(`Cypress organization successfully added`)
    } else {
      throw new Error(`User couldn't be created`)
    }
  } catch (e) {
    console.log(`Error creating cypress test organization: ${e.message}`)
  }
}
