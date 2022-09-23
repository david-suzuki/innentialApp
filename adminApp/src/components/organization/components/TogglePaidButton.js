import React, { useState } from 'react'
import { Checkbox, Message } from 'element-react'
import { Mutation } from 'react-apollo'
import { toggleOrganizationIsPaying } from '../../../api'

const doMutation = (mutation, variables) => {
  mutation({
    variables
  }).then(res => {
    Message({
      message: 'Updated value',
      type: 'success',
      duration: 1500
    })
  })
}
export default ({ isPayingOrganization, organizationId }) => {
  const [cstate, setState] = useState(isPayingOrganization)

  return (
    <Mutation mutation={toggleOrganizationIsPaying}>
      {(mutation, { loading, error }) => {
        if (loading) return 'LOADING...'
        if (error) {
          console.log(error)
          return 'SOMETHING WENT WRONG! Check the console!'
        }

        return (
          <Checkbox
            checked={cstate}
            onChange={value => {
              setState(value)
              doMutation(mutation, { value, organizationId })
            }}
          >
            Is paying organization
          </Checkbox>
        )
      }}
    </Mutation>
  )
}
