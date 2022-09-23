import React from 'react'
import { Query } from 'react-apollo'
import {
  fetchRegularSkills,
  fetchOrganizationSkillsForAdmin
} from '../../../api'
import { Button, Form, Cascader } from 'element-react'
import { normalizeSkills } from '../utilities'

const MultipleSkillsSelector = ({
  selectedSecondarySkills = [],
  onSkillsChange,
  addNewItem,
  removeItem,
  clearSecondarySkills,
  organizationSpecific
}) => {
  const skillQuery = organizationSpecific
    ? fetchOrganizationSkillsForAdmin
    : fetchRegularSkills
  const skillQueryName = organizationSpecific
    ? 'fetchOrganizationSkillsForAdmin'
    : 'fetchRegularSkills'

  return (
    <Query
      query={skillQuery}
      variables={
        organizationSpecific && { organizationId: organizationSpecific }
      }
    >
      {({ loading, error, data }) => {
        if (loading) return 'Loading...'
        if (error) return `Error! ${error.message}`
        const cascaderOptions = data && normalizeSkills(data[skillQueryName])
        const allSkills = data && data[skillQueryName]

        return selectedSecondarySkills.map(skill => {
          return (
            <Form.Item
              label='Related Skills'
              prop={`relatedSecondarySkills:${skill.key}`}
              key={skill.key}
            >
              <Cascader
                name={'secondaryskill'}
                placeholder='Select related skills'
                options={cascaderOptions}
                value={skill.value}
                filterable
                clearable={
                  skill.key === 0 && selectedSecondarySkills.length === 1
                }
                onChange={value => {
                  if (value.length > 0) {
                    onSkillsChange(
                      skill.key,
                      value,
                      allSkills.filter(d => d._id === value[1])[0]
                    )
                  } else clearSecondarySkills(skill.key)
                }}
              />
              {skill.key === selectedSecondarySkills.length - 1 && (
                <React.Fragment>
                  <Button
                    onClick={e => addNewItem('selectedSecondarySkills', e)}
                  >
                    Add new Skill
                  </Button>
                  {skill.key !== 0 && (
                    <Button
                      onClick={e =>
                        removeItem(
                          'selectedSecondarySkills',
                          'relatedSecondarySkills',
                          skill.key,
                          e
                        )
                      }
                    >
                      Delete
                    </Button>
                  )}
                </React.Fragment>
              )}
            </Form.Item>
          )
        })
      }}
    </Query>
  )
}

export default MultipleSkillsSelector
