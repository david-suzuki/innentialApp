import React from 'react'
import { Select } from 'element-react'
import { Query } from 'react-apollo'
import { fetchAllOrganizations } from '../../../api'

export default ({ value, onChangeSelect, disableSelect }) => {
  return (
    <Query query={fetchAllOrganizations} fetchPolicy='network-only'>
      {({ data, loading, error }) => {
        if (error) {
          console.log(error)
          return 'Error, check console'
        }
        if (loading) return '...Loading'

        const allOrganizations = (data && data.fetchAllOrganizations) || []
        if (allOrganizations) {
          const selectOptions = allOrganizations.map(
            ({ _id, organizationName }) => ({
              label: organizationName,
              value: _id
            })
          )
          return (
            <Select
              disabled={!!disableSelect}
              clearable
              value={value}
              onChange={val => onChangeSelect(val)}
            >
              {selectOptions.map(el => {
                return (
                  <Select.Option
                    key={el.value}
                    label={el.label}
                    value={el.value}
                  />
                )
              })}
            </Select>
          )
        }

        return null
      }}
    </Query>
  )
}
