import React from 'react'
import { Query } from 'react-apollo'
import { fetchAllLinesOfWork } from '../../api'
import { Select } from 'element-react'
import { LoadingSpinner } from '../general'

const LinesOfWorkSelector = ({ relatedLineOfWork, onChangeLineOfWork }) => (
  <Query query={fetchAllLinesOfWork}>
    {({ loading, error, data }) => {
      if (loading) return <LoadingSpinner />
      if (error) return `Error! ${error.message}`

      const linesOfWorkData = data && data.fetchAllLinesOfWork
      return (
        <Select
          placeholder='Select Line of work'
          value={relatedLineOfWork._id}
          onChange={value => {
            return onChangeLineOfWork(
              value ? linesOfWorkData.filter(d => d._id === value)[0] : {}
            )
          }}
        >
          {linesOfWorkData.map(el => {
            return (
              <Select.Option key={el.slug} label={el.name} value={el._id} />
            )
          })}
        </Select>
      )
    }}
  </Query>
)

export default LinesOfWorkSelector
