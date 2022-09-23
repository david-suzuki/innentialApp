import React from 'react'
import { Query } from 'react-apollo'
import { fetchAllLinesOfWork } from '../../../api'
import { Select } from 'element-react'

const LinesOfWorkSelector = ({ relatedLineOfWork, onChangeLineOfWork }) => (
  <Query query={fetchAllLinesOfWork}>
    {({ loading, error, data }) => {
      if (loading) return 'Loading...'
      if (error) return `Error! ${error.message}`

      const linesOfWorkData = data && data.fetchAllLinesOfWork
      return (
        <Select
          name={'lineofwork'}
          placeholder='Select Line of work'
          value={relatedLineOfWork._id}
          filterable
          clearable
          onChange={value => {
            return onChangeLineOfWork(
              value ? linesOfWorkData.filter(d => d._id === value)[0] : {}
            )
          }}
        >
          {linesOfWorkData.map((el, i) => {
            return <Select.Option key={i} label={el.name} value={el._id} />
          })}
        </Select>
      )
    }}
  </Query>
)

export default LinesOfWorkSelector
