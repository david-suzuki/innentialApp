import React from 'react'
import { useMutation } from 'react-apollo'
import { activateOrganization } from '../../../api'
import { Message, Button } from 'element-react'

export default ({ organizationId }) => {
  const [mutate, { loading }] = useMutation(activateOrganization, {
    variables: {
      organizationId
    }
  })
  return (
    <Button
      type='success'
      loading={loading}
      onClick={e => {
        e.preventDefault()
        mutate()
          .then(() => {
            Message({
              type: 'success',
              message: 'Organization has been activated!',
              duration: 1500
            })
          })
          .catch(error => {
            Message({
              message: `${error.graphQLErrors[0].message}`,
              type: 'error',
              duration: 1500
            })
          })
      }}
    >
      Activate organization
    </Button>
  )
}
