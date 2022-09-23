import React, { Component, useState } from 'react'
import { Query } from 'react-apollo'
import { Select, Checkbox } from 'element-react'
import { LoadingSpinner, captureFilteredError } from '../general'
import { fetchSkillCategoriesForOrganizationAdmin } from '../../api'
import { Statement } from './'

class ResetFilter extends Component {
  componentDidMount() {
    this.props.resetFilter()
  }

  render() {
    return null
  }
}

export default ({
  selectedCategory,
  onChange,
  selectStyle,
  notListedOption,
  removeCustomFrameworks
}) => {
  const [filterFrameworks, setFilterFrameworks] = useState(false)
  return (
    <Query query={fetchSkillCategoriesForOrganizationAdmin}>
      {({ data, loading, error }) => {
        if (loading) return <LoadingSpinner />
        if (error) {
          captureFilteredError(error)
          return <Statement content='Oops! Something went wrong' />
        }
        if (data) {
          const categoryData = data.fetchSkillCategoriesForOrganizationAdmin

          const hasFrameworks = categoryData.some(
            category => category.orgFrameworkId
          )

          const filteredData = categoryData.filter(category => {
            if (filterFrameworks) {
              return category.orgFrameworkId
            } else return true
          })
          const selectOptions = filteredData.map(category => {
            const { _id, name } = category
            return (
              <Select.Option key={`category:${_id}`} label={name} value={_id} />
            )
          })
          return (
            <>
              {!hasFrameworks && filteredData.length === 0 && (
                <ResetFilter resetFilter={() => setFilterFrameworks(false)} />
              )}
              {hasFrameworks && !removeCustomFrameworks && (
                <div className='framework-settings__category-checkbox'>
                  <Checkbox
                    checked={filterFrameworks}
                    onChange={() => {
                      setFilterFrameworks(!filterFrameworks)
                      onChange('')
                    }}
                  >
                    Show categories with custom guidelines only
                  </Checkbox>
                </div>
              )}
              <Select
                className={selectStyle}
                value={selectedCategory}
                onChange={value => onChange(value)}
                placeholder='Choose a category'
              >
                {notListedOption && (
                  <Select.Option
                    key='category:not-listed'
                    label='Not listed'
                    value='not-listed'
                  />
                )}
                {selectOptions}
              </Select>
            </>
          )
        }
      }}
    </Query>
  )
}
