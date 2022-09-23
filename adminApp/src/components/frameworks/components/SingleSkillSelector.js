import React from 'react'
import { Query } from 'react-apollo'
import {
  fetchRegularSkills,
  fetchOrganizationSkillsForAdmin
} from '../../../api'
import { Cascader } from 'element-react'
import { normalizeSkills } from '../../learning-content/utilities'

const SingleSkillSelector = ({ value, onChange, organizationId }) => {
  const query = organizationId
    ? fetchOrganizationSkillsForAdmin
    : fetchRegularSkills
  const queryName = organizationId
    ? 'fetchOrganizationSkillsForAdmin'
    : 'fetchRegularSkills'
  const variables = organizationId ? { organizationId } : {}
  return (
    <Query query={query} variables={variables}>
      {({ loading, error, data }) => {
        if (loading) return 'Loading...'
        if (error) return `Error! ${error.message}`

        const cascaderOptions = data && normalizeSkills(data[queryName])

        return (
          <Cascader
            value={value}
            placeholder='Select the related skill'
            options={cascaderOptions}
            filterable
            clearable
            onChange={onChange}
          />
        )
      }}
    </Query>
  )
}

export default SingleSkillSelector
