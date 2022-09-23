import React, { Component } from 'react'
import { Button, Dialog, Form, Input, Message } from 'element-react'
import { Mutation, Query } from 'react-apollo'
import { addSkillCategory, fetchCategoryDuplicateInfo } from '../../api'
// import SkillsForm from './SkillsForm'

export default class CategoriesAdd extends Component {
  state = {
    form: {
      name: ''
    },
    organizationSpecific: this.props.organizationId,
    isFormVisible: false
  }

  form = React.createRef()

  toggleFormVisibility = () => {
    this.setState(({ isFormVisible }) => ({ isFormVisible: !isFormVisible }))
  }

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

  handleOnSubmitSuccess = () => {
    this.setState({
      form: {
        name: ''
      },
      duplicates: 0
    })
    this.form.current && this.form.current.resetFields()
    this.toggleFormVisibility()
  }

  render() {
    const {
      form: { name },
      duplicates
    } = this.state
    return (
      <div>
        <Button
          style={{
            marginRight: '15px'
          }}
          type='primary'
          onClick={this.toggleFormVisibility}
        >
          Add New Category
        </Button>
        <Dialog
          title={
            this.props.organizationId
              ? 'Add category to organization'
              : 'Add new category'
          }
          visible={this.state.isFormVisible}
          onCancel={this.toggleFormVisibility}
        >
          <Dialog.Body>
            <Form
              ref={this.form}
              labelPosition='top'
              className='en-US'
              model={this.state.form}
              labelWidth='120'
            >
              <Query
                query={fetchCategoryDuplicateInfo}
                variables={{ name }}
                // pollInterval={500}
              >
                {({ data, loading }) => {
                  const nOfDuplicates = data && data.fetchCategoryDuplicateInfo
                  return (
                    <Form.Item
                      label='Name'
                      prop='name'
                      rules={[
                        {
                          required: true,
                          message: 'Please input category name',
                          trigger: 'blur'
                        },
                        {
                          trigger: 'blur',
                          asyncValidator: (rule, value, callback) => {
                            if (!loading) {
                              this.setState({ duplicates: nOfDuplicates })
                              if (nOfDuplicates >= 0) {
                                callback()
                              } else {
                                callback(
                                  new Error(`Matching category name found`)
                                )
                              }
                            }
                          }
                        }
                      ]}
                    >
                      <Input
                        value={name}
                        onChange={value => this.onChange('name', value)}
                      />
                      {duplicates > 0 && !this.props.organizationId && (
                        <div>
                          {duplicates} duplicate categor
                          {duplicates > 1 ? 'ies' : 'y'} will be merged.
                        </div>
                      )}
                    </Form.Item>
                  )
                }}
              </Query>
            </Form>
            <Mutation
              mutation={addSkillCategory}
              refetchQueries={[
                'fetchAllSkillCategories',
                'fetchSkillCategoriesForOrganization',
                'fetchAllSkills',
                'fetchOrganizationSkillsForAdmin'
              ]}
            >
              {addSkillCategory => (
                <Button
                  onClick={e => {
                    e.preventDefault()
                    this.form.current.validate(async valid => {
                      if (valid) {
                        const inputData = {
                          name: this.state.form.name,
                          organizationSpecific: this.state.organizationSpecific
                        }
                        try {
                          await addSkillCategory({
                            variables: {
                              inputData
                            }
                          })
                          Message({
                            type: 'success',
                            message: 'Successfully added'
                          })
                        } catch (e) {
                          Message({
                            type: 'error',
                            message: `${e}`
                          })
                        }
                      }
                    })
                  }}
                >
                  Submit
                </Button>
              )}
            </Mutation>
          </Dialog.Body>
        </Dialog>
      </div>
    )
  }
}
