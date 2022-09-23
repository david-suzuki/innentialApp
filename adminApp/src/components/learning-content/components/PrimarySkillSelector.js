import React from 'react'
import { Query } from 'react-apollo'
import {
  fetchRegularSkills,
  fetchOrganizationSkillsForAdmin
} from '../../../api'
import { Form, Cascader, Select, Button, Input } from 'element-react'
import { normalizeSkills } from '../utilities'

const PrimarySkillSelector = ({
  selectedPrimarySkills = [],
  onChangePrimarySkill,
  addNewItem,
  removeItem,
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
        return selectedPrimarySkills.map(skill => {
          return (
            <Form.Item
              key={skill.key}
              prop={`relatedPrimarySkills:${skill.key}`}
              rules={{
                type: 'object',
                required: true,
                fields: {
                  value: {
                    type: 'array',
                    required: true,
                    trigger: 'change',
                    message: 'Primary Skill is required'
                  }
                }
              }}
            >
              <Form.Item label='Primary Skill' prop='value'>
                <Cascader
                  name={'primaryskill'}
                  placeholder='Select primary skill'
                  options={cascaderOptions}
                  value={skill.value}
                  filterable
                  onBlur={() =>
                    onChangePrimarySkill('value', skill.value, skill.key)
                  }
                  onChange={value =>
                    onChangePrimarySkill('value', value, skill.key)
                  }
                />
              </Form.Item>
              <Form.Item label='Skill Level' prop='skillLevel'>
                <Select
                  name={'primaryskilllevel'}
                  value={skill.skillLevel}
                  onChange={value =>
                    onChangePrimarySkill('skillLevel', value, skill.key)
                  }
                >
                  <Select.Option label='5' value={5} />
                  <Select.Option label='4' value={4} />
                  <Select.Option label='3' value={3} />
                  <Select.Option label='2' value={2} />
                  <Select.Option label='1' value={1} />
                  <Select.Option label='0' value={0} />
                </Select>
              </Form.Item>
              <Form.Item
                label='Content Importance towards Skill'
                prop='importance'
              >
                <p>3 - least important / 1 - most important</p>
                <Input
                  style={{ maxWidth: 225 }}
                  name={'primaryskillimportance'}
                  value={skill.importance}
                  onChange={value =>
                    onChangePrimarySkill('importance', value, skill.key)
                  }
                />
                {/* <Select
                  name={'primaryskillimportance'}
                  value={skill.importance}
                  onChange={value =>
                    onChangePrimarySkill('importance', value, skill.key)
                  }
                >
                  <Select.Option label="3" value={3} />
                  <Select.Option label="2" value={2} />
                  <Select.Option label="1" value={1} />
                </Select> */}
              </Form.Item>
              {skill.key === selectedPrimarySkills.length - 1 && (
                <React.Fragment>
                  <Button onClick={e => addNewItem('selectedPrimarySkills', e)}>
                    Add new Skill
                  </Button>
                  {skill.key !== 0 && (
                    <Button
                      onClick={e =>
                        removeItem(
                          'selectedPrimarySkills',
                          'relatedPrimarySkills',
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

export default PrimarySkillSelector
