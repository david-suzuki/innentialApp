import React from 'react'
import { Query } from 'react-apollo'
import { fetchAllInterests } from '../../api'
import { Button, Select } from 'element-react'
import { LoadingSpinner } from '../general'

const InterestsSelector = ({
  selectedInterests = [],
  onInterestChange,
  onInterestRemove,
  placeholder = 'Select related interest'
}) => (
  <Query query={fetchAllInterests}>
    {({ loading, error, data }) => {
      if (loading) return <LoadingSpinner />
      if (error) return `Error! ${error.message}`

      const interestsData = data && data.fetchAllInterests

      interestsData.sort((a, b) =>
        a.name.toLowerCase().localeCompare(b.name.toLowerCase())
      )

      return (
        <>
          <Select
            placeholder={placeholder}
            onChange={value =>
              onInterestChange(
                value,
                interestsData.filter(d => d._id === value)[0]
              )
            }
          >
            {interestsData.map(el => {
              return (
                <Select.Option key={el.slug} label={el.name} value={el._id} />
              )
            })}
          </Select>
          <div className='cascader-selections'>
            {selectedInterests.map(interest => (
              <div key={interest._id}>
                <Button
                  type='primary'
                  className='el-button--cascader'
                  onClick={e => onInterestRemove(e, interest._id)}
                >
                  {interest.name} <i className='icon icon-e-remove' />
                </Button>
              </div>
            ))}
          </div>
        </>
      )
    }}
  </Query>
)

export default InterestsSelector
