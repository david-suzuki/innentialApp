import { User } from '~/models'
import { ROLES_PERMISSIONS, SCOPES } from '~/config'

export default async () => {
  const currentUsers = await User.find()
  if (currentUsers.length === 0) {
    await User.create({
      firstName: 'Kris',
      lastName: 'Gunciarz',
      email: 'kris@waat.eu',
      password: '$2a$12$1e616OUCfSM7Wd3VOvbZve.4DtCrRDPrAZcKvIo3.lDUHm3kiXhna',
      roles: [
        ROLES_PERMISSIONS.INNENTIAL_ADMIN.NAME,
        ROLES_PERMISSIONS.USER.NAME,
        ROLES_PERMISSIONS.ADMIN.NAME
      ],
      permissions: [
        ...ROLES_PERMISSIONS.USER.PERMISSIONS[SCOPES.OPERATION.READ].map(
          permission => `${SCOPES.OPERATION.READ}:${permission}`
        ),
        ...ROLES_PERMISSIONS.INNENTIAL_ADMIN.PERMISSIONS[
          SCOPES.OPERATION.READ
        ].map(permission => `${SCOPES.OPERATION.READ}:${permission}`)
      ]
    })
    await User.create({
      firstName: 'Cagri',
      lastName: 'Yardimci',
      email: 'cagri@waat.eu',
      password: '$2a$12$1e616OUCfSM7Wd3VOvbZve.4DtCrRDPrAZcKvIo3.lDUHm3kiXhna',
      roles: [ROLES_PERMISSIONS.USER.NAME],
      permissions: [
        // TODO: How is this supposed to look?
        // permissions:[read:write:]
        // permissions:{read[]write[]}
        ...ROLES_PERMISSIONS.USER.PERMISSIONS[SCOPES.OPERATION.READ].map(
          permission => `${SCOPES.OPERATION.READ}:${permission}`
        ),
        ...ROLES_PERMISSIONS.USER.PERMISSIONS[SCOPES.OPERATION.WRITE].map(
          permission => `${SCOPES.OPERATION.WRITE}:${permission}`
        )
      ]
    })
    console.log('Users added successfully')
  }
}
