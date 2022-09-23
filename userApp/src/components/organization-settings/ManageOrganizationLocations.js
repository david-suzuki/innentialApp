import React, { useState } from 'react'
import { Input, Button, Form, Notification } from 'element-react'
import {
  setOrganizationLocations
  // fetchCurrentUserOrganization
} from '../../api'
import { Mutation } from 'react-apollo'

export default ({ locations }) => {
  const [selectedLocations, setSelectedLocations] = useState(
    locations.length > 0 ? locations : ['']
  )
  const formRef = React.createRef()
  return (
    <Form
      ref={formRef}
      model={{ selectedLocations }}
      onSubmit={e => e.preventDefault()}
    >
      {selectedLocations.map((loc, i) => {
        return (
          <Form.Item
            key={i}
            rules={[
              {
                required: true,
                trigger: 'change',
                message: 'Please input a location'
              }
            ]}
            prop={`selectedLocations:${i}`}
          >
            <i
              className='icon icon-e-remove icon--autosuggest'
              onClick={e =>
                setSelectedLocations(
                  selectedLocations.filter((l, ix) => ix !== i)
                )
              }
            />
            <Input
              value={loc}
              onChange={val =>
                setSelectedLocations(
                  selectedLocations.map((l, idx) => {
                    if (idx === i) {
                      return val
                    } else return l
                  })
                )
              }
              placeholder='Enter a location'
            />
          </Form.Item>
        )
      })}

      <div className='align-left'>
        <span
          onClick={e => setSelectedLocations([...selectedLocations, ''])}
          className='organization-settings__location'
        >
          + Add another location
        </span>
      </div>

      <div>
        <Mutation
          mutation={setOrganizationLocations}
          // update={(proxy, { data: { setOrganizationLocations } }) => {
          //   try {
          //     const data = proxy.readQuery({
          //       query: fetchCurrentUserOrganization
          //     })
          //     proxy.writeQuery(
          //       { query: fetchCurrentUserOrganization },
          //       { ...data, locations: setOrganizationLocations }
          //     )
          //   } catch (e) {}
          // }}
          refetchQueries={[
            'fetchOrganizationLocations'
          ]}
        >
          {mutation => {
            return (
              <Button
                type='primary'
                className={`organization-settings__submit-button ${
                  selectedLocations && !selectedLocations[0] ? 'disabled' : ''
                }`}
                onClick={e => {
                  formRef.current.validate(async valid => {
                    if (valid) {
                      mutation({
                        variables: {
                          locations: selectedLocations
                        }
                      }).then(res => {
                        if (Array.isArray(res.data.setOrganizationLocations)) {
                          Notification({
                            type: 'success',
                            message:
                              'Changed available locations for the organization',
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
                      })
                    } else {
                      console.log('not valid')
                    }
                  })
                }}
              >
                Submit
              </Button>
            )
          }}
        </Mutation>
      </div>
    </Form>
  )
}
