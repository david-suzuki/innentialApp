import React, { Component } from 'react'
import { Query } from 'react-apollo'
import { fetchRegularSkills } from '../../../api'
import { Button, Form, Cascader, Slider, Message } from 'element-react'
import { normalizeSkills } from '../../learning-content/utilities'

export default class MultipleSkillsSelector extends Component {
  constructor(props) {
    super(props)
    this.initialState = {
      cascaderSelectedSkills: [
        {
          key: 0,
          value: [],
          skillLevel: 1,
          _id: ''
        }
      ]
    }
    this.state = this.initialState
  }

  componentDidUpdate = prevProps => {
    if (this.props.reset !== prevProps.reset && this.props.reset) {
      this.setState(() => this.initialState)
    }
  }

  addNewSkill = e => {
    e.preventDefault()
    this.setState(({ cascaderSelectedSkills }) => ({
      cascaderSelectedSkills: [
        ...cascaderSelectedSkills,
        {
          key: cascaderSelectedSkills.length,
          value: [],
          skillLevel: 1,
          _id: ''
        }
      ]
    }))
  }

  removeNewSkill = (item, e) => {
    const newSelectedSkills = this.state.cascaderSelectedSkills.filter(
      skill => skill.key !== item
    )
    this.setState(() => ({
      cascaderSelectedSkills: [...newSelectedSkills]
    }))

    e.preventDefault()
  }

  handleChange = () => {
    const value = this.state.cascaderSelectedSkills.map(
      ({ key, value, ...rest }) => rest
    )
    this.props.onChange(value)
  }

  onSkillsChange = (key, value, skill) => {
    let newSelectedSkill = this.state.cascaderSelectedSkills.reduce(
      (acc, curr) => {
        if (curr.key === key) {
          return [
            ...acc,
            {
              ...curr,
              value,
              _id: skill._id
            }
          ]
        }
        return [
          ...acc,
          {
            ...curr
          }
        ]
      },
      []
    )

    const currentSkillsIds = this.state.cascaderSelectedSkills.map(s => s._id)
    if (!currentSkillsIds.includes(value[value.length - 1])) {
      this.setState(
        () => ({
          cascaderSelectedSkills: [...newSelectedSkill]
        }),
        () => this.handleChange()
      )
    } else {
      Message({ type: 'error', message: `You have already added this skill` })
    }
  }

  onSkillLevelChange = (key, value) => {
    let newSkillLevel = this.state.cascaderSelectedSkills.reduce(
      (acc, curr) => {
        if (curr.key === key) {
          return [
            ...acc,
            {
              ...curr,
              skillLevel: value
            }
          ]
        }
        return [
          ...acc,
          {
            ...curr
          }
        ]
      },
      []
    )

    this.setState(
      () => ({
        cascaderSelectedSkills: [...newSkillLevel]
      }),
      () => this.handleChange()
    )
  }

  render() {
    return (
      <Query query={fetchRegularSkills}>
        {({ loading, error, data }) => {
          if (loading) return 'Loading...'
          if (error) return `Error! ${error.message}`

          const cascaderOptions =
            data && normalizeSkills(data.fetchRegularSkills)
          return this.state.cascaderSelectedSkills.map(skill => {
            return (
              <div className='skills-selector' key={skill.key}>
                <Form.Item label='Selected Skills'>
                  <Form.Item label='Skill' prop={`selectedSkills:${skill._id}`}>
                    <Cascader
                      placeholder='Select skill'
                      options={cascaderOptions}
                      value={skill.value}
                      filterable
                      onChange={value =>
                        this.onSkillsChange(
                          skill.key,
                          value,
                          data &&
                            data.fetchRegularSkills.filter(
                              d => d._id === value[1]
                            )[0]
                        )
                      }
                    />
                  </Form.Item>
                  <Form.Item
                    label='Skill Level'
                    prop='selectedSkills:skillLevel'
                  >
                    <Slider
                      value={skill.skillLevel}
                      showStops
                      min={0}
                      max={5}
                      showInput
                      onChange={value =>
                        this.onSkillLevelChange(skill.key, value)
                      }
                    />
                  </Form.Item>

                  {skill.key ===
                    this.state.cascaderSelectedSkills.length - 1 && (
                    <React.Fragment>
                      <Button onClick={this.addNewSkill}>Add new Skill</Button>
                      {skill.key !== 0 && (
                        <Button
                          onClick={e => this.removeNewSkill(skill.key, e)}
                        >
                          Delete
                        </Button>
                      )}
                    </React.Fragment>
                  )}
                </Form.Item>
              </div>
            )
          })
        }}
      </Query>
    )
  }
}
