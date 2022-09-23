import React from 'react'
import { Checkbox, Message } from 'element-react'
import { Mutation } from 'react-apollo'
import { toggleOrganizationEvents } from '../../../api'

const callback = (mutation, variables) => {
  mutation({
    variables
  })
    .then(res => {
      Message({
        message: 'Successfully updated!',
        type: 'success',
        duration: 1500
      })
    })
    .catch(err => {
      console.error(err)
      Message({
        message: 'Something went wrong',
        type: 'success',
        duration: 1500
      })
    })
}

const ToggleEvent = ({ events, organizationId }) => {
  return (
    <Mutation mutation={toggleOrganizationEvents}>
      {(mutation, { loading, error }) => {
        if (loading) return 'LOADING...'

        if (error) {
          console.error(error)
          return 'SOMETHING WENT WRONG! Check the console!'
        }

        return (
          <Checkbox
            checked={events || false}
            onChange={value => {
              callback(mutation, { events: value, organizationId })
            }}
          >
            Events
          </Checkbox>
        )
      }}
    </Mutation>
  )
}

export default ToggleEvent
