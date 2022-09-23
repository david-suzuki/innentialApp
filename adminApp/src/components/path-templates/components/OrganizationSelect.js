import React from 'react'
import { Select } from 'element-react'
import { fetchAllOrganizationsReduced } from '../../../api'
import { useQuery } from 'react-apollo'

const OrganizationSelect = ({
  value, // organization ID
  handleChange
}) => {
  const { data, error, loading } = useQuery(fetchAllOrganizationsReduced)

  if (loading) return 'Loading...'

  if (error) return `Error! ${error.message}`

  if (data) {
    const organizationData = data && data.fetchAllOrganizations
    return (
      <Select
        placeholder='No organization (public)'
        value={value}
        filterable
        clearable
        onChange={value => handleChange(value)}
        onClear={() => handleChange(null)}
      >
        {organizationData.map(el => {
          return (
            <Select.Option
              key={el._id}
              label={`${el.organizationName} (${el.employees.length})`}
              value={el._id}
            />
          )
        })}
      </Select>
    )
  }
  return null
}

export default OrganizationSelect
