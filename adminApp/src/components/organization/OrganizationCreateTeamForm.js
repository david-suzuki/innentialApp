import React, { Component } from 'react'
import {
  Button,
  Form,
  Input,
  Message,
  Loading,
  Dialog,
  Layout
} from 'element-react'
import { Mutation } from 'react-apollo'
import { withRouter } from 'react-router-dom'
import { addNewTeam } from '../../api'

const emailCharacterValidator = (rule, value, callback) => {
  const pattern = /^[a-zA-Z0-9!#$%&'*+-/=?^_`{|}~@.]*$/

  if (!value.match(pattern)) {
    callback(new Error('This email address contains invalid characters'))
  } else {
    callback()
  }
}

class OrganizationCreateTeamForm extends Component {
  state = {
    isFormVisible: false,
    form: {
      name: '',
      leader: '',
      members: []
    }
    // existingEmployees: this.props.employees.map(employee => ({
    //   _id: employee._id,
    //   email: employee.email,
    //   name: employee.firstName
    // }))
  }

  form = React.createRef()

  toggleFormVisibility = () => {
    this.setState(({ isFormVisible }) => ({ isFormVisible: !isFormVisible }))
  }

  onChangeLeader = value => {
    this.setState(({ form }) => ({
      form: {
        ...form,
        leader: value
      }
    }))
  }

  // onChangeEmail = (key, value) => {
  //   const isEmployee = this.state.existingEmployees.findIndex(
  //     employee => employee.email === value
  //   )
  //   if (isEmployee !== -1 && this.state.existingEmployees[isEmployee].name) {
  //     this.setState(({ form }) => ({
  //       form: {
  //         ...form,
  //         [key]: {
  //           ...form[key],
  //           name: this.state.existingEmployees[isEmployee].name
  //         }
  //       }
  //     }))
  //   }
  //   this.setState(({ form }) => ({
  //     form: {
  //       ...form,
  //       [key]: {
  //         ...form[key],
  //         email: value
  //       }
  //     }
  //   }))
  // }

  onChangeTeamName = value => {
    this.setState(({ form }) => ({
      form: {
        ...form,
        name: value
      }
    }))
  }

  onChangeMember = (value, index) => {
    this.setState(({ form }) => {
      const newMembers = form.members.map(m => {
        if (index === m.key)
          return {
            key: m.key,
            value
          }
        return m
      })
      return { form: { ...form, members: newMembers } }
    })
  }

  // onChangeMemberEmail = (key, value, index) => {
  //   const isEmployee = this.state.existingEmployees.findIndex(
  //     employee => employee.email === value
  //   )
  //   const currentMembers = this.state.form.members
  //   const newMembers = [...currentMembers]
  //   if (isEmployee !== -1 && this.state.existingEmployees[isEmployee].name) {
  //     newMembers[index].value.name = this.state.existingEmployees[
  //       isEmployee
  //     ].name
  //   }
  //   newMembers[index].value.email = value
  //   this.setState(({ form }) => ({
  //     form: Object.assign({}, form, {
  //       members: [...newMembers]
  //     })
  //   }))
  // }

  addNewMember = e => {
    e.preventDefault()
    this.setState(({ form }) => ({
      form: {
        ...form,
        members: [
          ...form.members,
          {
            key: form.members.length,
            value: ''
          }
        ]
      }
    }))
  }

  handleOnSubmitSuccess = () => {
    this.toggleFormVisibility()
    this.setState({
      form: {
        name: '',
        leader: '',
        members: []
      }
    })
    this.form.current.resetFields()
  }

  removeNewMember = (key, e) => {
    const currentMembers = this.state.form.members
    const newMembers = [...currentMembers]
    newMembers.splice(key, 1)
    this.setState(({ form }) => ({
      form: {
        ...form,
        members: [...newMembers]
      }
    }))

    e.preventDefault()
  }

  render() {
    const { name, leader, members } = this.state.form
    return (
      <div>
        <Button type='primary' onClick={this.toggleFormVisibility}>
          Add New Team
        </Button>
        <Dialog
          title='Create new team'
          visible={this.state.isFormVisible}
          onCancel={this.toggleFormVisibility}
        >
          <Dialog.Body>
            <Form
              ref={this.form}
              className='en-US'
              labelPosition='top'
              model={this.state.form}
              labelWidth='120'
            >
              <Form.Item
                label='Team Name'
                prop='name'
                rules={{
                  required: true,
                  message: 'Please provide name of team',
                  trigger: 'blur'
                }}
              >
                <Input
                  value={name}
                  onChange={value => this.onChangeTeamName(value)}
                />
              </Form.Item>
              <Form.Item
                label='Team Lead'
                prop='leader'
                rules={[
                  {
                    type: 'email',
                    required: true,
                    message: 'Please provide correct email',
                    trigger: 'blur'
                  },
                  {
                    validator: emailCharacterValidator
                  }
                ]}
              >
                <Input
                  value={leader}
                  placeholder='Email'
                  onChange={value => this.onChangeLeader(value)}
                />
              </Form.Item>
              {members.map((member, i) => {
                return (
                  <Form.Item
                    label={i === 0 ? 'Members' : ''}
                    prop={`members:${member.key}`}
                    key={member.key}
                    rules={{
                      type: 'object',
                      fields: {
                        value: [
                          {
                            type: 'email',
                            required: true,
                            message: 'Please provide a correct email',
                            trigger: 'blur'
                          },
                          {
                            validator: emailCharacterValidator
                          },
                          {
                            validator: (rule, value, callback) => {
                              if (
                                (value !== '' && value === leader) ||
                                members
                                  .filter((member, ix) => ix !== i)
                                  .some(
                                    member => member === value && value !== ''
                                  )
                              ) {
                                callback(
                                  new Error(`Please provide unique emails`)
                                )
                              } else callback()
                            }
                          }
                        ]
                      }
                    }}
                  >
                    <div>
                      <Layout.Col span='22'>
                        <Input
                          value={member.value}
                          placeholder='Email'
                          onChange={value =>
                            this.onChangeMember(value, member.key)
                          }
                        />
                      </Layout.Col>
                      <Layout.Col span='2'>
                        <Button
                          onClick={e => this.removeNewMember(member.key, e)}
                        >
                          Delete
                        </Button>
                      </Layout.Col>
                    </div>
                  </Form.Item>
                )
              })}
              <div>
                <Button
                  style={{ marginBottom: '15px' }}
                  onClick={this.addNewMember}
                >
                  Add member
                </Button>
              </div>
              <div>
                <Mutation
                  mutation={addNewTeam}
                  refetchQueries={[
                    'fetchOrganization',
                    'fetchAllUsers',
                    'fetchAdminTeamContentStats'
                  ]}
                >
                  {(addNewTeam, { loading }) => {
                    if (loading) return <Loading fullscreen />
                    return (
                      <Button
                        type='primary'
                        onClick={e => {
                          e.preventDefault()
                          this.form.current.validate(async valid => {
                            if (valid) {
                              const { organizationId } = this.props.match.params
                              const { name: teamName, leader } = this.state.form
                              const parsedData = {
                                organizationId,
                                teamName,
                                leader: leader.toLowerCase(),
                                members: members.map(member => {
                                  return member.value.toLowerCase()
                                })
                              }
                              try {
                                await addNewTeam({
                                  variables: {
                                    OrganizationAddTeamData: parsedData
                                  }
                                })
                                Message({
                                  type: 'success',
                                  message: 'Team successfully added'
                                })
                                this.handleOnSubmitSuccess()
                              } catch (e) {
                                Message({
                                  type: 'error',
                                  message: `${e.graphQLErrors[0].message}`
                                })
                              }
                            } else {
                              console.log('error submit!!')
                              return false
                            }
                          })
                        }}
                      >
                        Create Team
                      </Button>
                    )
                  }}
                </Mutation>
              </div>
            </Form>
          </Dialog.Body>
        </Dialog>
      </div>
    )
  }
}

export default withRouter(OrganizationCreateTeamForm)
