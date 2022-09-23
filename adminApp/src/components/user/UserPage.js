import React from 'react'
import { fetchUser, toggleWeeklyEmail } from '../../api'
import { Card, Tag, Checkbox, Loading, Message } from 'element-react'
import { Query, Mutation } from 'react-apollo'
import { ROLES } from '../../environment'

const UserPage = ({ match }) => {
  const userId = match && match.params && match.params.id
  return (
    <Query query={fetchUser} variables={{ userId }}>
      {({ loading, error, data }) => {
        if (loading) return 'Loading...'
        if (error) return `Error! ${error.message}`
        const user = data && data.fetchUser
        return (
          <Card
            className='box-card'
            header={
              <div className='clearfix'>
                <span style={{ lineHeight: '36px' }}>{user.email}</span>
                <span>
                  {' '}
                  <Tag
                    type={
                      user.status === 'active'
                        ? 'success'
                        : user.status === 'disabled'
                        ? 'danger'
                        : 'primary'
                    }
                  >
                    {user.status}
                  </Tag>
                </span>
                {user.organizationName && (
                  <span>
                    {' - '}
                    {user.organizationName}
                  </span>
                )}
              </div>
            }
          >
            {user.roles.map(role => (
              <Tag
                style={{ marginLeft: 10 }}
                type={
                  role.includes(ROLES.INNENTIAL_ADMIN)
                    ? 'danger'
                    : role.includes(ROLES.ADMIN)
                    ? 'success'
                    : 'primary'
                }
                key={role}
              >
                {role.includes(ROLES.INNENTIAL_ADMIN)
                  ? 'Innential Admin'
                  : role.includes(ROLES.ADMIN)
                  ? 'Admin'
                  : 'User'}
              </Tag>
            ))}
            <div style={{ marginTop: '24px' }}>
              {user.isReceivingContentEmails === null ? null : (
                <Mutation
                  mutation={toggleWeeklyEmail}
                  variables={{ userId: user._id }}
                  refetchQueries={['fetchUser']}
                >
                  {(mutation, { loading, error }) => {
                    if (error) return <p>{error}</p>
                    if (loading) return <Loading fullscreen />
                    return (
                      <Checkbox
                        checked={user.isReceivingContentEmails}
                        onChange={val => {
                          mutation().then(res => {
                            if (res.data.toggleWeeklyEmail === 'success') {
                              Message({
                                type: 'success',
                                message: 'Updated weekly content emails',
                                duration: 1500
                              })
                            }
                          })
                        }}
                      >
                        Is Receiving Content Emails
                      </Checkbox>
                    )
                  }}
                </Mutation>
              )}
            </div>
            {user.profile && (
              <div style={{ marginTop: '20px' }}>
                <p>Role at work: {user.profile.roleAtWork}</p>
                <p style={{ marginTop: '20px' }}>Interests:</p>
                {user.profile.selectedInterests.map(({ name }, i) => (
                  <p key={i}>{name}</p>
                ))}
                <p style={{ marginTop: '20px' }}>Skills:</p>
                {user.profile.selectedWorkSkills.map(({ name, level }, i) => (
                  <p key={i}>{`${name}: level:${level}`}</p>
                ))}
                <p style={{ marginTop: '20px' }}>Growth:</p>
                {user.profile.neededWorkSkills.map(({ name }, i) => (
                  <p key={i}>{name}</p>
                ))}
              </div>
            )}
          </Card>
        )
      }}
    </Query>
  )
}

export default UserPage
