import React from 'react'
import { Query } from 'react-apollo'
import { fetchAllIndustries } from '../../../api'
import { Select, Form } from 'element-react'
// TODO unify all the selectors so that we do not have to duplicate components
const IndustrySelector = ({ selectedIndustry, onChangeIndustry }) => (
  <Query query={fetchAllIndustries}>
    {({ loading, error, data }) => {
      if (loading) return 'Loading...'
      if (error) return `Error! ${error.message}`

      const selectedIndustries = data && data.fetchAllIndustries
      return (
        <Form.Item label='Selected Industry' prop='selectedIndustry'>
          <Select
            placeholder='Select Industry'
            value={selectedIndustry}
            filterable
            clearable
            onChange={value => {
              return onChangeIndustry(
                selectedIndustries.filter(d => d._id === value)[0]
              )
            }}
          >
            {selectedIndustries.map(el => {
              return (
                <Select.Option key={el.slug} label={el.name} value={el._id} />
              )
            })}
          </Select>
        </Form.Item>
      )
    }}
  </Query>
)

export default IndustrySelector
