import React, { Component } from 'react'
import {
  Dialog,
  Button,
  Form,
  Input,
  Message,
  Loading,
  Select,
  Layout
} from 'element-react'
import { Mutation } from 'react-apollo'
import { changeTeamLeader } from '../../../../api'

class TeamChangeLeaderForm extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isFormVisible: false,
      options: props.members.map(member => ({
        key: member._id,
        value: {
          // name: member.firstName,
          email: member.email
        },
        label: member.email
      })),
      form: {
        // name: '',
        email: ''
      }
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

  onSelectMember = value => {
    this.setState(() => ({
      form: {
        ...value
      }
    }))
  }

  toggleFormVisibility = () => {
    this.setState(({ isFormVisible }) => ({ isFormVisible: !isFormVisible }))
    this.setState(() => ({
      options: this.props.members.map(member => ({
        key: member._id,
        value: {
          // name: member.firstName,
          email: member.email
        },
        label: member.email
      }))
    }))
  }

  handleOnSubmitSuccess = () => {
    this.toggleFormVisibility()
    this.setState({
      form: {
        // name: '',
        email: ''
      }
    })
    this.form.current.resetFields()
  }

  render() {
    const { /* name, */ email } = this.state.form
    return (
      <div>
        <Button type='primary' size='small' onClick={this.toggleFormVisibility}>
          Change
        </Button>
        <Dialog
          title='Change Team Leader'
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
              <Layout.Row>
                {/* <Layout.Col span="6">
                  <Form.Item
                    label="Name"
                    prop="name"
                    rules={{
                      required: true,
                      message: 'Please provide name of leader',
                      trigger: 'blur'
                    }}
                  >
                    <Input
                      value={name}
                      onChange={value => this.onChange('name', value)}
                    />
                  </Form.Item>
                </Layout.Col>
                <Layout.Col span="18"> */}
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
                {/* </Layout.Col> */}
              </Layout.Row>
              <Layout.Row>
                <Form.Item label='Or select one from existing members'>
                  <Select
                    value={this.state.form}
                    onChange={value => this.onSelectMember(value)}
                  >
                    {this.state.options.map(op => {
                      return (
                        <Select.Option
                          key={op.key}
                          value={op.value}
                          label={op.label}
                        />
                      )
                    })}
                  </Select>
                </Form.Item>
              </Layout.Row>
              <Mutation
                mutation={changeTeamLeader}
                refetchQueries={['fetchOrganization', 'fetchAllUsers']}
              >
                {(changeTeamLeader, { loading }) => {
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
                              const newLeader = await changeTeamLeader({
                                variables: { MemberInput }
                              })
                              Message({
                                type: 'success',
                                message: `${newLeader.data.changeTeamLeader} is now the leader of this team`
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
                      Change Leader
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

export default TeamChangeLeaderForm
