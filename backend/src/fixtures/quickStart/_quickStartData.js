export default {
  testUser: {
    firstName: 'Wojciech',
    lastName: 'Admin Wielki',
    email: 'wojciech@innential.com',
    __comment: 'password is 123456',
    password: '$2a$12$1e616OUCfSM7Wd3VOvbZve.4DtCrRDPrAZcKvIo3.lDUHm3kiXhna',
    status: 'active'
  },
  testEmployees: [
    {
      firstName: 'Nama',
      lastName: 'Jeff',
      email: 'wojciech+1@innential.com',
      password: '$2a$12$1e616OUCfSM7Wd3VOvbZve.4DtCrRDPrAZcKvIo3.lDUHm3kiXhna',
      status: 'active'
    },
    {
      firstName: 'Jessie',
      lastName: 'James',
      email: 'wojciech+2@innential.com',
      password: '$2a$12$1e616OUCfSM7Wd3VOvbZve.4DtCrRDPrAZcKvIo3.lDUHm3kiXhna',
      status: 'active'
    },
    {
      firstName: 'Meechy',
      lastName: 'Darko',
      email: 'wojciech+3@innential.com',
      password: '$2a$12$1e616OUCfSM7Wd3VOvbZve.4DtCrRDPrAZcKvIo3.lDUHm3kiXhna',
      status: 'active'
    },
    {
      firstName: 'Toe',
      lastName: 'Camel',
      email: 'wojciech+4@innential.com',
      password: '$2a$12$1e616OUCfSM7Wd3VOvbZve.4DtCrRDPrAZcKvIo3.lDUHm3kiXhna',
      status: 'active'
    }
  ],
  testOrganization: {
    organizationName: 'Morones'
  },
  __comment: 'in teams, use test user emails in leader/member array',
  testTeams: [
    {
      teamName: 'Team BA',
      leader: 'wojciech+1@innential.com',
      members: ['wojciech+2@innential.com'],
      active: true
    },
    {
      teamName: 'Team AB',
      leader: 'wojciech+3@innential.com',
      members: ['wojciech+4@innential.com'],
      active: true
    }
  ]
}
