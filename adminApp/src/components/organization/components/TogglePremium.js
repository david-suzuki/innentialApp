import React from 'react'
import { Checkbox, Message, MessageBox } from 'element-react'
import { Mutation } from 'react-apollo'
import { setOrganizationPremium } from '../../../api'

const callback = (mutation, variables) => {
  MessageBox.confirm(
    `The users of the organization will ${
      variables.value ? 'have' : 'lose'
    } access to premium features`,
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

const TogglePremium = ({ premium, organizationId }) => {
  return (
    <Mutation mutation={setOrganizationPremium}>
      {(mutation, { loading, error }) => {
        if (loading) return 'LOADING...'

        if (error) {
          console.error(error)
          return 'SOMETHING WENT WRONG! Check the console!'
        }

        return (
          <Checkbox
            checked={premium || false}
            onChange={value => {
              callback(mutation, { value, organizationId })
            }}
          >
            Is premium
          </Checkbox>
        )
      }}
    </Mutation>
  )
}

export default TogglePremium
