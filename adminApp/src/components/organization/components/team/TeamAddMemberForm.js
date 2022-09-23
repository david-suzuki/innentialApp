import React, { Component } from 'react'
import { Dialog, Button, Form, Input, Message, Loading } from 'element-react'
import { Mutation } from 'react-apollo'
import { addMember } from '../../../../api'

class TeamAddMemberForm extends Component {
  state = {
    isFormVisible: false,
    form: {
      email: ''
    }
  }
  form = React.createRef()

  onChange = (key, value) => {
    this.setState(({ form }) => ({
      form: {
        ...form,
        [key]: value
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
        email: ''
      }
    })
    this.form.current.resetFields()
  }

  render() {
    const { email } = this.state.form
    return (
      <div>
        <Button type='success' onClick={this.toggleFormVisibility}>
          Add Member
        </Button>
        <Dialog
          title='Add New Member'
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
                <Input
                  value={email}
                  onChange={value => this.onChange('email', value)}
                />
              </Form.Item>
              <Mutation
                mutation={addMember}
                refetchQueries={['fetchOrganization', 'fetchAllUsers']}
              >
                {(addMember, { loading }) => {
                  if (loading) return <Loading fullscreen />
                  return (
                    <Button
                      type='primary'
                      onClick={e => {
                        e.preventDefault()
                        this.form.current.validate(async valid => {
                          if (valid) {
                            const { teamId } = this.props
                            const MemberInput = {
                              ...this.state.form,
                              teamId
                            }
                            try {
                              const newMember = await addMember({
                                variables: { MemberInput }
                              })
                              Message({
                                type: 'success',
                                message: `${newMember.data.addMember} added to team`
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
                      Add Member
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

export default TeamAddMemberForm
