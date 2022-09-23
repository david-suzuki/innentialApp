import React from 'react'
import { Query } from 'react-apollo'
import { fetchAllIndustries } from '../../../api'
import { Button, Form, Select } from 'element-react'

const IndustriesSelector = ({
  selectedIndustries = [],
  onIndustryChange,
  addNewItem,
  removeItem
}) => (
  <Query query={fetchAllIndustries}>
    {({ loading, error, data }) => {
      if (loading) return 'Loading...'
      if (error) return `Error! ${error.message}`
      const industriesData = data && data.fetchAllIndustries
      return selectedIndustries.map(industry => {
        return (
          <Form.Item
            label='Related Industries'
            prop={`relatedIndustries:${industry.key}`}
            key={industry.key}
          >
            <Select
              name={'industry'}
              placeholder='Select related industries'
              value={industry.value}
              filterable
              clearable
              onChange={value => {
                onIndustryChange(
                  value,
                  industry.key,
                  industriesData.filter(d => d._id === value)[0]
                )
              }}
            >
              {industriesData.map((el, i) => {
                return <Select.Option key={i} label={el.name} value={el._id} />
              })}
            </Select>
            {industry.key === selectedIndustries.length - 1 && (
              <React.Fragment>
                <Button onClick={e => addNewItem('selectedIndustries', e)}>
                  Add new Industry
                </Button>
                {industry.key !== 0 && (
                  <Button
                    onClick={e =>
                      removeItem(
                        'selectedIndustries',
                        'relatedIndustries',
                        industry.key,
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

export default IndustriesSelector
