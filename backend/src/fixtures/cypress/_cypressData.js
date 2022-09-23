import { ROLES_PERMISSIONS, SCOPES } from '~/config'

export const profile = {
  roleAtWork: 'Tester'
}

export const organization = {
  organizationName: 'Cypress Testing'
}

export const user = {
  firstName: 'Cypress',
  lastName: 'Test',
  email: 'cypress@test.email',
  password: '$2a$12$1e616OUCfSM7Wd3VOvbZve.4DtCrRDPrAZcKvIo3.lDUHm3kiXhna',
  roles: [ROLES_PERMISSIONS.USER.NAME, ROLES_PERMISSIONS.ADMIN.NAME],
  permissions: [
    ...ROLES_PERMISSIONS.USER.PERMISSIONS[SCOPES.OPERATION.READ].map(
      permission => `${SCOPES.OPERATION.READ}:${permission}`
    )
  ],
  status: 'active'
}

export const teams = [
  {
    teamName: 'Team 1',
    active: true
  },
  {
    teamName: 'Team 2',
    active: true
  }
]
