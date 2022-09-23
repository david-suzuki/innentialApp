import React from 'react'
import { Link } from 'react-router-dom'
import { Query } from 'react-apollo'
import { currentUser } from '../../api'
import { captureFilteredError, LoadingSpinner } from '../general'
import { Button } from 'element-react'
import { Page } from '../ui-components'

const finalPage = () => {
  return (
    <Query query={currentUser}>
      {({ data, loading, error }) => {
        if (error) {
          captureFilteredError(error)
          return null
        }
        if (loading) return <LoadingSpinner />

        const user = data && data.currentUser
        if (user) {
          return (
            <Page>
              <div style={{ minHeight: '50vh' }}>
                <p style={{ marginTop: '100px' }}>
                  {' '}
                  {`Congrats, ${user.firstName}!`}
                </p>
                <p> You have successfully completed onboarding</p>
              </div>
              <div className='bottom-nav'>
                <Link
                  to={{ pathname: '/', state: { showGeneratedGoals: true } }}
                  exact
                >
                  <Button type='primary'>Go to your dashboard</Button>
                </Link>
              </div>
            </Page>
          )
        }
        return null
      }}
    </Query>
  )
}

export default finalPage
