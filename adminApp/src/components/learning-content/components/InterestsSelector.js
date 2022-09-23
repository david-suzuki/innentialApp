import React from 'react'
import { Query } from 'react-apollo'
import { fetchAllInterests } from '../../../api'
import { Button, Form, Select } from 'element-react'

const InterestsSelector = ({
  selectedInterests,
  onInterestChange,
  addNewItem,
  removeItem
}) => (
  <Query query={fetchAllInterests}>
    {({ loading, error, data }) => {
      if (loading) return 'Loading...'
      if (error) return `Error! ${error.message}`

      const interestsData = data && data.fetchAllInterests
      return selectedInterests.map(interest => {
        return (
          <Form.Item
            label='Related Interests'
            prop={`relatedInterests:${interest.key}`}
            key={interest.key}
          >
            <Select
              name={'interests'}
              placeholder='Select related interests'
              value={interest.value}
              filterable
              clearable
              onChange={value =>
                onInterestChange(
                  interest.key,
                  value,
                  interestsData.filter(d => d._id === value)[0]
                )
              }
            >
              {interestsData.map((el, i) => {
                return <Select.Option key={i} label={el.name} value={el._id} />
              })}
            </Select>
            {interest.key === selectedInterests.length - 1 && (
              <React.Fragment>
                <Button onClick={e => addNewItem('selectedInterests', e)}>
                  Add new Interest
                </Button>
                {interest.key !== 0 && (
                  <Button
                    onClick={e =>
                      removeItem(
                        'selectedInterests',
                        'relatedInterests',
                        interest.key,
                        e
                      )
                    }
                  >
                    Delete
                  </Button>
                )}
              </React.Fragment>
            )}
          </Form.Item>
        )
      })
    }}
  </Query>
)

export default InterestsSelector
