import React, { Component } from 'react'
import { Form, Input, Button, Message } from 'element-react'
import {
  addFramework,
  editFramework,
  deleteFramework,
  addFrameworkForOrganization
} from '../../api'
import { SkillCategorySelector } from '../skills/components'
import SingleSkillSelector from './components/SingleSkillSelector'
import { Mutation } from 'react-apollo'

export default class FrameworkForm extends Component {
  constructor(props) {
    super(props)

    const { initialValues } = props
    const levelTexts = initialValues
      ? initialValues.levelTexts
      : {
          level1Text: '',
          level2Text: '',
          level3Text: '',
          level4Text: '',
          level5Text: ''
        }

    const submitMutation = initialValues ? editFramework : addFramework

    this.state = {
      form: {
        cascaderValue: [],
        connectedTo: '',
        levelTexts
      },
      // organizationId,
      submitMutation
    }
  }

  form = React.createRef()

  onChange = async (key, value) => {
    // if (refetch) {
    //   await refetch({ name: value })
    // }
    this.setState(({ form }) => ({
      form: {
        ...form,
        [key]: value
      }
    }))
  }

  setSkill = async value => {
    this.setState(({ form }) => ({
      form: {
        ...form,
        cascaderValue: value,
        connectedTo: value.length > 0 ? value[1] : ''
      }
    }))
  }

  onChangeLevelText = async (key, value) => {
    this.setState(({ form: { cascaderValue, connectedTo, levelTexts } }) => ({
      form: {
        cascaderValue,
        connectedTo,
        levelTexts: {
          ...levelTexts,
          [key]: value
        }
      }
    }))
  }

  handleOnSubmitSuccess = () => {
    if (!this.props.initialValues) {
      this.form.current.resetFields()
      this.setState({
        form: {
          connectedTo: '',
          levelTexts: {
            level1Text: '',
            level2Text: '',
            level3Text: '',
            level4Text: '',
            level5Text: ''
          }
        }
      })
      this.props.toggleDialog()
    }
  }

  render() {
    const {
      // organizationId,
      submitMutation,
      form: { connectedTo, cascaderValue, levelTexts }
    } = this.state
    const { frameworkId, goBack, forSkills, organizationId } = this.props
    return (
      <div>
        <Form
          ref={this.form}
          labelPosition='top'
          className='en-US'
          model={this.state.form}
          labelWidth='120'
          onSubmit={e => e.preventDefault()}
        >
          {!this.props.initialValues && (
            <Form.Item
              label={forSkills ? 'Skill' : 'Category'}
              prop='connectedTo'
              rules={{
                required: true,
                message: `Please provide the related ${
                  forSkills ? 'skill' : 'category'
                }.`,
                trigger: 'submit'
              }}
            >
              {forSkills ? (
                <SingleSkillSelector
                  value={cascaderValue}
                  onChange={this.setSkill}
                  organizationId={organizationId}
                />
              ) : (
                <SkillCategorySelector
                  organizationId={organizationId}
                  value={connectedTo}
                  filterFrameworks
                  onChange={value => this.onChange('connectedTo', value)}
                />
              )}
            </Form.Item>
          )}
          <Form.Item
            prop={`levelTexts`}
            rules={{
              type: 'object',
              fields: {
                level1Text: {
                  type: 'string',
                  required: true,
                  message: 'Please provide all text descriptions'
                },
                level2Text: {
                  type: 'string',
                  required: true,
                  message: 'Please provide all text descriptions'
                },
                level3Text: {
                  type: 'string',
                  required: true,
                  message: 'Please provide all text descriptions'
                },
                level4Text: {
                  type: 'string',
                  required: true,
                  message: 'Please provide all text descriptions'
                },
                level5Text: {
                  type: 'string',
                  required: true,
                  message: 'Please provide all text descriptions'
                }
              },
              trigger: 'submit'
            }}
          >
            {Object.keys(levelTexts)
              .filter(key => key !== '_id' && key !== '__typename')
              .map((level, i) => (
                <Form.Item
                  key={`levelTexts:${i}`}
                  label={`Level ${i + 1} text`}
                  prop={`levelTexts.${level}`}
                >
                  <Input
                    value={levelTexts[level]}
                    type='textarea'
                    autosize={{ minRows: 2, maxRows: 4 }}
                    placeholder='Please input'
                    onChange={value => this.onChangeLevelText(level, value)}
                  />
                </Form.Item>
              ))}
          </Form.Item>
        </Form>
        {organizationId ? (
          <Mutation
            mutation={addFrameworkForOrganization}
            refetchQueries={[
              'fetchSkillCategoriesForOrganization',
              'fetchOrganizationSkillsForAdmin'
            ]}
          >
            {(mutation, { loading }) => (
              <Button
                type='primary'
                onClick={e => {
                  e.preventDefault()
                  this.form.current.validate(async valid => {
                    if (valid) {
                      delete levelTexts.__typename
                      delete levelTexts._id
                      const inputData = {
                        connectedTo,
                        ...levelTexts
                      }
                      try {
                        await mutation({
                          variables: {
                            inputData,
                            organizationId
                          }
                        })
                        Message({
                          type: 'success',
                          message: `Successfully submitted!`
                        })
                        this.handleOnSubmitSuccess()
                      } catch (e) {
                        Message({
                          type: 'error',
                          message: `${e.message}`
                        })
                      }
                    }
                  })
                }}
                loading={loading}
              >
                Submit
              </Button>
            )}
          </Mutation>
        ) : (
          <Mutation
            mutation={submitMutation}
            refetchQueries={[
              'fetchAllSkillCategories',
              'fetchSkillCategoriesForOrganization',
              'fetchAllSkills',
              'fetchOrganizationSkillsForAdmin'
            ]}
          >
            {(mutation, { loading }) => (
              <Button
                type='primary'
                onClick={e => {
                  e.preventDefault()
                  this.form.current.validate(async valid => {
                    if (valid) {
                      let inputData
                      delete levelTexts.__typename
                      delete levelTexts._id
                      if (frameworkId) {
                        inputData = {
                          frameworkId,
                          ...levelTexts
                        }
                      } else {
                        inputData = {
                          connectedTo,
                          ...levelTexts
                        }
                      }
                      try {
                        await mutation({
                          variables: {
                            inputData
                          }
                        })
                        Message({
                          type: 'success',
                          message: `Successfully submitted!`
                        })
                        this.handleOnSubmitSuccess()
                      } catch (e) {
                        Message({
                          type: 'error',
                          message: `${e.message}`
                        })
                      }
                    }
                  })
                }}
                loading={loading}
              >
                Submit
              </Button>
            )}
          </Mutation>
        )}
        {this.props.initialValues && (
          <span>
            <Button onClick={() => goBack()}>Go back</Button>
          </span>
        )}
        {this.props.canDelete && (
          <span>
            <Mutation
              mutation={deleteFramework}
              refetchQueries={['fetchAllSkillCategories', 'fetchAllSkills']}
            >
              {mutation => (
                <Button
                  type='danger'
                  onClick={async e => {
                    e.preventDefault()
                    try {
                      const { data } = await mutation({
                        variables: {
                          frameworkId
                        }
                      })
                      if (data && data.deleteFramework === 'Success') {
                        Message({
                          type: 'success',
                          message: `Successfully removed!`
                        })
                        goBack()
                      } else if (data && data.deleteFramework === 'Error') {
                        Message({
                          type: 'error',
                          message: `${e.message}`
                        })
                      }
                    } catch (e) {
                      Message({
                        type: 'error',
                        message: `${e.message}`
                      })
                    }
                  }}
                >
                  Delete
                </Button>
              )}
            </Mutation>
          </span>
        )}
      </div>
    )
  }
}
