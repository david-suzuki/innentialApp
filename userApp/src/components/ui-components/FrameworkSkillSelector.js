import React from 'react'
import { Query } from 'react-apollo'
import { /* Select, */ Cascader } from 'element-react'
import { LoadingSpinner, captureFilteredError } from '../general'
import { fetchOrganizationSpecificSkills } from '../../api'
import { Statement } from './'
import { normalizeSkills } from '../user-onboarding/utilities'

// COMPONENT FOR ORG ADMIN TO FETCH SKILLS THAT HAVE THEIR FRAMEWORKS

// DEPRECATED !!!

const findValue = (options = [], id) => {
  return options.reduce((acc, curr) => {
    const foundSkill = curr.children.find(skill => skill.value === id)
    if (foundSkill) return [curr.label, id]
  }, [])
}

const findLabelForValue = (options = [], value) => {
  return options.reduce((acc, curr) => {
    const foundSkill = curr.children.find(skill => skill.value === value[1])
    if (foundSkill) return foundSkill.label
  }, '')
}

export default ({ selectedSkill, onChange }) => {
  return (
    <Query query={fetchOrganizationSpecificSkills}>
      {({ data, loading, error }) => {
        if (loading) return <LoadingSpinner />
        if (error) {
          captureFilteredError(error)
          return <Statement content='Oops! Something went wrong' />
        }
        if (data) {
          const skillData = data.fetchOrganizationSpecificSkills
          const filteredData = skillData.filter(skill => {
            return skill.orgFrameworkId
          })
          const cascaderOptions = normalizeSkills(filteredData)
          cascaderOptions.sort((a, b) =>
            a.label.toLowerCase().localeCompare(b.label.toLowerCase())
          )
          cascaderOptions.forEach(category =>
            category.children.sort((a, b) =>
              a.label.toLowerCase().localeCompare(b.label.toLowerCase())
            )
          )
          return (
            <Cascader
              value={findValue(cascaderOptions, selectedSkill)}
              placeholder='Choose a skill'
              options={cascaderOptions}
              filterable
              onChange={value =>
                onChange(value, findLabelForValue(cascaderOptions, value))
              }
            />
          )
        }
      }}
    </Query>
  )
}
