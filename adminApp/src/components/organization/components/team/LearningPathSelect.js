import React from 'react'
import { useQuery } from 'react-apollo'
import { fetchInnentialAndOrgLearningPaths } from '../../../../api'
import { Loading, Select } from 'element-react'

const LearningPathSelect = ({ onSelectPath, organizationId }) => {
  const { data, loading, error } = useQuery(fetchInnentialAndOrgLearningPaths, {
    variables: {
      organizationId
    },
    fetchPolicy: 'cache-and-network'
  })

  if (loading) return <Loading />

  if (error) return `Error fetching paths: ${error.message}`

  const learningPaths = (data && data.fetchInnentialAndOrgLearningPaths) || []

  return (
    <Select
      value={''}
      placeholder='Add recommendation'
      filterable
      onChange={pathId => pathId && onSelectPath(pathId)}
      onClear={() => {}}
      clearable
    >
      {learningPaths.map(el => {
        return (
          <Select.Option
            key={el._id}
            label={`${el.name}${el.organization ? '(organization)' : ''}`}
            value={el._id}
          />
        )
      })}
    </Select>
  )
}

export default LearningPathSelect
