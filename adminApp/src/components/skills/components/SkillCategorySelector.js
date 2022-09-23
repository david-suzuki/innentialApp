import React from 'react'
import { v4 as uuidv4 } from 'uuid'
import { Query } from 'react-apollo'
import {
  fetchRegularSkillCategories,
  fetchSkillCategoriesForOrganization
} from '../../../api'
import { Select } from 'element-react'

const SkillCategorySelector = ({
  value,
  onChange,
  organizationId,
  filterFrameworks
}) => {
  const CategoryQuery = organizationId
    ? fetchSkillCategoriesForOrganization
    : fetchRegularSkillCategories
  const queryName = organizationId
    ? 'fetchSkillCategoriesForOrganization'
    : 'fetchRegularSkillCategories'
  const variables = organizationId ? { organizationId } : {}
  return (
    <Query query={CategoryQuery} variables={variables}>
      {({ loading, error, data }) => {
        if (loading) return 'Loading...'
        if (error) return `Error! ${error.message}`

        const categoryData = data && data[queryName]
        const filteredData = categoryData.filter(category => {
          if (filterFrameworks) {
            if (organizationId) {
              return category.orgFrameworkId === null
            } else return category.frameworkId === null
          } else return true
        })

        return (
          <Select
            placeholder='Select category'
            value={value}
            onChange={value => {
              return onChange(
                value ? categoryData.filter(d => d._id === value)[0]._id : {}
              )
            }}
          >
            {filteredData.map(el => {
              if (el.organizationSpecific) {
                const key = uuidv4()
                // const key = el.slug + el.organizationSpecific
                return (
                  <Select.Option key={key} label={el.name} value={el._id} />
                )
              } else {
                return (
                  <Select.Option
                    key={uuidv4()}
                    label={el.name}
                    value={el._id}
                  />
                )
              }
            })}
          </Select>
        )
      }}
    </Query>
  )
}

export default SkillCategorySelector
