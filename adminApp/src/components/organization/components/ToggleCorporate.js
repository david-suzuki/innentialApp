import React from 'react'
import { Checkbox, Message, MessageBox } from 'element-react'
import { Mutation } from 'react-apollo'
import { toggleOrganizationIsCorporate } from '../../../api'

const callback = (mutation, variables) => {
  MessageBox.confirm(
    'This will change the app for current and future organization users',
    'Are you sure you want to change this?'
  )
    .then(() => {
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
    })
    .catch(() => {})
}

const ToggleCorporate = ({ corporate, organizationId }) => {
  return (
    <Mutation mutation={toggleOrganizationIsCorporate}>
      {(mutation, { loading, error }) => {
        if (loading) return 'LOADING...'

        if (error) {
          console.error(error)
          return 'SOMETHING WENT WRONG! Check the console!'
        }

        return (
          <Checkbox
            checked={corporate || false}
            onChange={value => {
              callback(mutation, { corporate: value, organizationId })
            }}
          >
            Is corporate client
          </Checkbox>
        )
      }}
    </Mutation>
  )
}

export default ToggleCorporate
