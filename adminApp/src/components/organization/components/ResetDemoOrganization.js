import React from 'react'
import { Mutation } from 'react-apollo'
import { resetDemoOrganization } from '../../../api'
import { Message, Button, Loading } from 'element-react'

export default ({ organizationId }) => {
  return (
    <Mutation
      mutation={resetDemoOrganization}
      variables={{ organizationId }}
      refetchQueries={['fetchOrganization']}
    >
      {(reset, { data, loading, error }) => {
        if (loading) return <Loading fullscreen />
        if (error) {
          console.log(error)
          Message({
            message: `${error.graphQLErrors[0].message}`,
            type: 'error',
            duration: 1500
          })
          return 'error'
        }
        return (
          <Button
            type='primary'
            onClick={e => {
              e.preventDefault()
              reset().then(res => {
                res.data.resetDemoOrganization === 'success'
                  ? Message({
                      type: 'success',
                      message: 'Removed demo users and teams successfully',
                      duration: 1500
                    })
                  : Message({
                      type: 'warning',
                      message: 'Something went wrong',
                      duration: 1500
                    })
              })
            }}
          >
            Reset Demo
          </Button>
        )
      }}
    </Mutation>
  )
}
