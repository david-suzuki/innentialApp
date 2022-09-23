import React from 'react'
import { Checkbox, Message, MessageBox } from 'element-react'
import { Mutation } from 'react-apollo'
import { toggleOrganizationFulfillment } from '../../../api'

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

const ToggleFulfillment = ({ fulfillment, organizationId }) => {
  return (
    <Mutation mutation={toggleOrganizationFulfillment}>
      {(mutation, { loading, error }) => {
        if (loading) return 'LOADING...'

        if (error) {
          console.error(error)
          return 'SOMETHING WENT WRONG! Check the console!'
        }

        return (
          <Checkbox
            checked={fulfillment || false}
            onChange={value => {
              callback(mutation, { fulfillment: value, organizationId })
            }}
          >
            Learning item delivery
          </Checkbox>
        )
      }}
    </Mutation>
  )
}

export default ToggleFulfillment
