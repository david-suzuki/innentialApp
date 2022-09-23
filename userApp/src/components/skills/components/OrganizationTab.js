import React from 'react'
import { Query } from 'react-apollo'
import { fetchOrganizationEvaluationToo } from '../../../api'
import { captureFilteredError, LoadingSpinner } from '../../general'
import { SkillItemsAdmin } from '../../ui-components'
export default ({ searchString }) => {
  return (
    <Query query={fetchOrganizationEvaluationToo}>
      {({ data, loading, error }) => {
        if (error) {
          captureFilteredError(error)
        }
        if (loading) return <LoadingSpinner />

        if (data) {
          const finalItems = JSON.parse(
            JSON.stringify(data.fetchOrganizationEvaluationToo)
          )
          const regex = new RegExp(
            `${searchString.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')}`, //eslint-disable-line
            'i'
          )
          const filteredItems = finalItems.filter(({ name }) => {
            return regex.test(name)
          })
          return (
            <SkillItemsAdmin
              items={filteredItems}
              onOrganizationTab
              isAdmin
              withLink
            />
          )
        } else {
          return (
            <SkillItemsAdmin items={[]} onOrganizationTab isAdmin withLink />
          )
        }
      }}
    </Query>
  )
}
