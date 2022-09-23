import React, { Component } from 'react'
import {
  Dialog,
  Button,
  Select,
  Form,
  Input,
  Message,
  Loading
} from 'element-react'
import { Mutation } from 'react-apollo'
import { withRouter } from 'react-router-dom'
import {
  addNewEmployee
  // fetchOrganization as OrganizationQuery,
  // fetchAllOrganizations as AllOrganizationsQuery
} from '../../api'
import { ROLES } from '../../environment'

const roles = [
  {
    label: 'Admin',
    value: ROLES.ADMIN
  },
  {
    label: 'Employee',
    value: ROLES.EMPLOYEE
  }
]

class OrganizationInviteUserForm extends Component {
  state = {
    isFormVisible: false,
    form: {
      email: '',
      role: ''
    }
  }

  form = React.createRef()

  onChangeEmployeeEmail = value => {
    this.setState(({ form }) => ({
      form: {
        email: value,
        role: form.role
      }
    }))
  }

  onChangeEmployeeRole = value => {
    this.setState(({ form }) => ({
      form: {
        email: form.email,
        role: value
      }
    }))
  }
  toggleFormVisibility = () => {
    this.setState(({ isFormVisible }) => ({ isFormVisible: !isFormVisible }))
  }

  handleOnSubmitSuccess = () => {
    this.toggleFormVisibility()
    this.setState({
      form: {
        email: '',
        role: ''
      }
    })
    this.form.current.resetFields()
  }

  render() {
    const { email, role } = this.state.form
    return (
      <div>
        <Button type='primary' onClick={this.toggleFormVisibility}>
          Add New Employee
        </Button>
        <Dialog
          title='Invite New Employee'
          visible={this.state.isFormVisible}
          onCancel={this.toggleFormVisibility}
        >
          <Dialog.Body>
            <Form
              ref={this.form}
              className='en-US'
              model={this.state.form}
              labelWidth='120'
            >
              <Form.Item
                label='Email'
                prop='email'
                rules={{
                  required: true,
                  type: 'email',
                  message: 'Please provide correct email',
                  trigger: 'blur'
                }}
              >
                <Input value={email} onChange={this.onChangeEmployeeEmail} />
              </Form.Item>
              <Form.Item
                label='Role'
                prop='role'
                rules={{
                  required: true,
                  message: 'Please select a role',
                  trigger: 'blur'
                }}
              >
                <Select
                  value={role}
                  placeholder='Select role'
                  onChange={this.onChangeEmployeeRole}
                >
                  {roles.map(el => {
                    return (
                      <Select.Option
                        key={el.value}
                        label={el.label}
                        value={el.value}
                      />
                    )
                  })}
                </Select>
              </Form.Item>

              <Mutation
                mutation={addNewEmployee}
                refetchQueries={['fetchAllUsers']}
              >
                {(addNewEmployee, { loading }) => {
                  if (loading) return <Loading fullscreen />
                  return (
                    <Button
                      type='primary'
                      onClick={e => {
                        e.preventDefault()
                        this.form.current.validate(async valid => {
                          if (valid) {
                            const { organizationId } = this.props.match.params
                            const {
                              email,
                              role: employeeRole
                            } = this.state.form
                            const parsedData = {
                              employeeEmail: email.toLowerCase(),
                              employeeRole,
                              organizationId
                            }
                            try {
                              await addNewEmployee({
                                variables: {
                                  OrganizationAddEmployeeData: parsedData
                                }
                              })
                              Message({
                                type: 'success',
                                message: 'Employee successfully added'
                              })
                              this.handleOnSubmitSuccess()
                            } catch (e) {
                              Message({
                                type: 'error',
                                message: `${
                                  e.graphQLErrors
                                    ? e.graphQLErrors[0].message
                                    : e
                                }`
                              })
                            }
                          } else {
                            console.log('error submit!!')
                            return false
                          }
                        })
                      }}
                    >
                      Add Employee
                    </Button>
                  )
                }}
              </Mutation>
            </Form>
          </Dialog.Body>
        </Dialog>
      </div>
    )
  }
}

export default withRouter(OrganizationInviteUserForm)
