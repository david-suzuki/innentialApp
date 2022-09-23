import React from 'react'
import { Query } from 'react-apollo'
import { fetchAllIndustries, publicFetchAllIndustries } from '../../api'
import { Select } from 'element-react'
import { LoadingSpinner } from '../general'

const IndustrySelector = ({
  selectedIndustry,
  onChangeIndustry,
  publicFetch
}) => (
  <Query query={publicFetch ? publicFetchAllIndustries : fetchAllIndustries}>
    {({ loading, error, data }) => {
      if (loading) return <LoadingSpinner />
      if (error) return `Error! ${error.message}`

      let industriesData
      if (publicFetch) {
        industriesData = data && data.publicFetchAllIndustries
      } else {
        industriesData = data && data.fetchAllIndustries
      }

      industriesData.sort((a, b) =>
        a.name.toLowerCase().localeCompare(b.name.toLowerCase())
      )
      return (
        <Select
          placeholder='  '
          value={selectedIndustry._id}
          onChange={value => {
            return onChangeIndustry(
              value ? industriesData.filter(d => d._id === value)[0] : {}
            )
          }}
        >
          {industriesData.map(el => {
            return (
              <Select.Option key={el.slug} label={el.name} value={el._id} />
            )
          })}
        </Select>
      )
    }}
  </Query>
)

export default IndustrySelector
