import React from 'react'
import { Query } from 'react-apollo'
import {
  fetchOrganizationSpecificSkills,
  fetchDisabledNeededSkills
} from '../../api'
import { Cascader, Button } from 'element-react'
import { normalizeSkills } from '../user-onboarding/utilities'
import { LoadingSpinner } from '../general'
import prepareSkillsList from './utils/prepareSkillsList'

const MultipleSkillsSelector = ({
  onSkillsChange,
  selectedSkills,
  onSkillRemove,
  formKey,
  placeholder = 'Select related skills',
  displayChildren,
  neededSkillsSelector
}) => {
  return (
    <Query query={fetchDisabledNeededSkills}>
      {({ loading: orgLoading, error: orgError, data: orgData }) => {
        if (orgLoading) return <LoadingSpinner />
        if (orgError) return `Error! ${orgError.message}`
        return (
          <Query query={fetchOrganizationSpecificSkills}>
            {({ loading, error, data }) => {
              if (loading) return <LoadingSpinner />
              if (error) return `Error! ${error.message}`
              const cascaderOptions =
                data &&
                normalizeSkills(
                  prepareSkillsList(
                    data.fetchOrganizationSpecificSkills,
                    orgData.fetchCurrentUserOrganization.disabledNeededSkills,
                    neededSkillsSelector
                  ).filter(
                    skill =>
                      !selectedSkills.some(
                        selected =>
                          selected._id === skill._id ||
                          selected.skillId === skill._id
                      )
                  )
                )
              cascaderOptions.sort((a, b) =>
                a.label.toLowerCase().localeCompare(b.label.toLowerCase())
              )
              cascaderOptions.forEach(category =>
                category.children.sort((a, b) =>
                  a.label.toLowerCase().localeCompare(b.label.toLowerCase())
                )
              )
              const allSkills = data && data.fetchOrganizationSpecificSkills
              return (
                <>
                  <Cascader
                    placeholder={placeholder}
                    options={cascaderOptions}
                    filterable
                    onChange={value =>
                      onSkillsChange(
                        value,
                        allSkills.filter(d => d._id === value[1])[0],
                        formKey
                      )
                    }
                  />
                  {displayChildren ? (
                    <div className='cascader-selections'>
                      {selectedSkills.map(skill => (
                        <div key={skill._id}>
                          <Button
                            type='primary'
                            className='el-button--cascader'
                            onClick={e => onSkillRemove(e, skill._id, formKey)}
                          >
                            {skill.name} <i className='icon icon-e-remove' />
                          </Button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div />
                  )}
                </>
              )
            }}
          </Query>
        )
      }}
    </Query>
  )
}

export default MultipleSkillsSelector
