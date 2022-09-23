import React, { useState } from 'react'
import { Query, Mutation } from 'react-apollo'
import { fetchOrganizationLocations, setUsersLocation } from '../../api'
import { LoadingSpinner, captureFilteredError } from '../general'
import { Select, Notification, Form } from 'element-react'
import { FormGroup } from './'
// import { compose } from 'recompose'

const SetLocation = ({ locations, mutation, selected, onboarding }) => {
  const [selectedLocation, setSelectedLocation] = useState('')
  if (!locations || locations.length === 0) return null
  const selectOptions = locations.map((location, index) => (
    <Select.Option
      key={index}
      value={location}
      label={location}
      selected={location === selected}
    />
  ))
  return (
    <div>
      <Select
        value={selectedLocation}
        onChange={val => {
          setSelectedLocation(val)
          mutation({
            variables: {
              location: val
            }
          }).then(res => {
            if (!onboarding) {
              if (res.data.setUsersLocation !== null) {
                Notification({
                  type: 'success',
                  message: 'Your location has been updated',
                  duration: 1500,
                  offset: 90
                })
              } else {
                Notification({
                  type: 'warning',
                  message: 'Something went wrong',
                  duration: 1500,
                  offset: 90
                })
              }
            }
          })
        }}
        placeholder='Select where you work'
      >
        {selectOptions}
      </Select>
      {/* TODO: Add location! */}
    </div>
  )
}
export default ({ selected, onboarding }) => {
  return (
    <Mutation
      mutation={setUsersLocation}
      refetchQueries={['fetchUsersProfile', 'fetchTeam']}
    >
      {mutation => {
        return (
          <Query query={fetchOrganizationLocations}>
            {({ data, loading, error }) => {
              if (loading) return <LoadingSpinner />
              if (error) {
                captureFilteredError(error)
                return null
              }
              if (data && data.fetchOrganizationLocations.length > 0) {
                if (onboarding) {
                  return (
                    <FormGroup mainLabel='Where do you work'>
                      <Form.Item>
                        <SetLocation
                          locations={data.fetchOrganizationLocations}
                          mutation={mutation}
                          selected={selected}
                          onboarding
                        />
                      </Form.Item>
                    </FormGroup>
                  )
                } else {
                  return (
                    <Form.Item label='Location'>
                      <SetLocation
                        locations={data.fetchOrganizationLocations}
                        mutation={mutation}
                        selected={selected}
                        onboarding={false}
                      />
                    </Form.Item>
                  )
                }
              }
              return null
            }}
          </Query>
        )
      }}
    </Mutation>
  )
}
