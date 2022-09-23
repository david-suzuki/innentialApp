import React from 'react'
import { Query } from 'react-apollo'
import { fetchAllContentSources } from '../../../api'
import { Select } from 'element-react'

const ContentSourceSelector = ({ contentSource, onChangeContentSource }) => (
  <Query query={fetchAllContentSources}>
    {({ loading, error, data }) => {
      if (loading) return 'Loading...'
      if (error) return `Error! ${error.message}`

      const contentSourceData = data && data.fetchAllContentSources
      contentSourceData.sort((a, b) =>
        a.name && b.name ? a.name.localeCompare(b.name) : -1
      )
      return (
        <Select
          placeholder='Select source of content'
          value={contentSource._id}
          onChange={value => {
            return onChangeContentSource(
              value ? contentSourceData.filter(d => d._id === value)[0] : {}
            )
          }}
          clearable
          filterable
        >
          {contentSourceData.map(el => {
            return <Select.Option key={el._id} label={el.name} value={el._id} />
          })}
        </Select>
      )
    }}
  </Query>
)

export default ContentSourceSelector
