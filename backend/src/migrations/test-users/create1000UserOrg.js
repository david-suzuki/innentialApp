import {
  User,
  Organization,
  UserProfile,
  UserContentInteractions
} from '~/models'
import { ROLES_PERMISSIONS, SCOPES } from '~/config'
import { Types } from 'mongoose'
import slug from 'slug'
;(async () => {
  const org = await Organization.findOne({ organizationName: 'The 1000' })
    .select({ _id: 1 })
    .lean()

  if (org) return

  const organizationId = new Types.ObjectId()

  try {
    const updatedUsers = new Array(1000).fill(null).map(() => ({
      firstName: 'FIRSTNAME',
      lastName: 'LASTNAME',
      email: `${Math.random()
        .toString(36)
        .substr(2, 9)}@email.com`,
      status: 'active',
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
            await UserProfile.create({
              user: employee._id,
              roleAtWork: 'Test employee',
              organizationId
            })

            await UserContentInteractions.create({
              user: employee._id
            })
          })
        )

        await Organization.create({
          _id: organizationId,
          slug: slug('The 1000', {
            replacement: '_',
            lower: true
          }),
          organizationName: 'The 1000',
          admins: []
        })
      }
    })

    console.log('Orgnization created')
  } catch (e) {
    console.error(e)
  }
})()
