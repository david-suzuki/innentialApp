import React from 'react'
import { Query } from 'react-apollo'
import { fetchAllLinesOfWork } from '../../../api'
import { Select, Form } from 'element-react'
// TODO unify all the selectors so that we do not have to duplicate components
const LinesOfWorkSelector = ({ selectedLineOfWork, onChangeLineOfWork }) => (
  <Query query={fetchAllLinesOfWork}>
    {({ loading, error, data }) => {
      if (loading) return 'Loading...'
      if (error) return `Error! ${error.message}`

      const linesOfWorkData = data && data.fetchAllLinesOfWork
      return (
        <Form.Item label='Line of Work' prop='selectedLineOfWork'>
          <Select
            placeholder='Select Line of work'
            value={selectedLineOfWork}
            filterable
            clearable
            onChange={value => {
              return onChangeLineOfWork(
                linesOfWorkData.filter(d => d._id === value)[0]
              )
            }}
          >
            {linesOfWorkData.map(el => {
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

export default LinesOfWorkSelector
