import React from 'react'
import { Query } from 'react-apollo'
import { fetchRegularSkills } from '../../../api'
import { Button, /* Form, */ Cascader } from 'element-react'
import { normalizeSkills } from '../utilities'

const MultipleSkillsSelector = ({
  selectedSecondarySkills = [],
  onSkillsChange,
  addNewItem,
  removeItem,
  clearSecondarySkills,
  formKey
}) => {
  const skillQuery = fetchRegularSkills
  const skillQueryName = 'fetchRegularSkills'
  return (
    <Query query={skillQuery}>
      {({ loading, error, data }) => {
        if (loading) return 'Loading...'
        if (error) return `Error! ${error.message}`
        const cascaderOptions = data && normalizeSkills(data[skillQueryName])
        const allSkills = data && data[skillQueryName]

        return selectedSecondarySkills.map(skill => {
          return (
            <React.Fragment>
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
                  } else clearSecondarySkills()
                }}
              />
              {skill.key === selectedSecondarySkills.length - 1 && (
                <React.Fragment>
                  <Button onClick={e => addNewItem(formKey, e)}>
                    Add new Skill
                  </Button>
                  {skill.key !== 0 && (
                    <Button
                      onClick={e =>
                        removeItem(
                          formKey,
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
            </React.Fragment>
          )
        })
      }}
    </Query>
  )
}

export default MultipleSkillsSelector
