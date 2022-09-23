import React, { Component } from 'react'
import { Layout, Form, Input, Button } from 'element-react'

import { SubmitButton } from './components'

import { formValidationRules } from './constants'

class OrganizationAdd extends Component {
  form = React.createRef()
  state = {
    form: {
      organizationName: '',
      admins: [
        {
          key: 0,
          value: 'kris@waat.eu' // TODO: GET OLD FUNCTIONALITY BACK BY REMOVING THE COMMENTS IN THE RENDER FUNCTION!
        }
      ]
    }
  }

  onChange = (key, value) => {
    this.setState({
      form: Object.assign({}, this.state.form, {
        [key]: value
      })
    })
  }

  onChangeAdmins = (key, value, index) => {
    const currentAdmins = this.state.form.admins
    const newAdmins = [...currentAdmins]
    newAdmins[index].value = value
    this.setState(({ form }) => ({
      form: Object.assign({}, form, {
        admins: [...newAdmins]
      })
    }))
  }

  addNewAdmin = e => {
    e.preventDefault()
    this.setState(({ form }) => ({
      form: {
        ...form,
        admins: [
          ...form.admins,
          {
            key: form.admins.length,
            value: ''
          }
        ]
      }
    }))
  }

  handleReset = () => {
    this.setState(() => ({
      form: {
        organizationName: '',
        admins: [
          {
            key: 0,
            value: 'kris@waat.eu'
          }
        ]
      }
    }))
  }

  removeNewAdmin = (item, e) => {
    const currentAdmins = this.state.form.admins

    const index = currentAdmins.indexOf(item)
    const newAdmins = [...currentAdmins]
    newAdmins.splice(index, 1)
    this.setState(({ form }) => ({
      form: {
        ...form,
        admins: [...newAdmins]
      }
    }))

    e.preventDefault()
  }

  render() {
    return (
      <Layout.Row>
        <Layout.Col span='24'>
          <Form
            ref={this.form}
            className='en-US'
            model={this.state.form}
            rules={formValidationRules}
            labelWidth='120'
          >
            <Form.Item label='Organization Name' prop='organizationName'>
              <Input
                value={this.state.form.organizationName}
                onChange={value => this.onChange('organizationName', value)}
              />
            </Form.Item>
            {/* TODO: Add admin functionality back once we add invitation functionality back */}
            {this.state.form.admins.map(admin => {
              return (
                <Form.Item
                  label='Admin'
                  prop={`admins:${admin.key}`}
                  key={admin.key}
                  rules={{
                    type: 'object',
                    required: true,
                    fields: {
                      value: {
                        type: 'email',
                        required: true,
                        message: 'Please provide correct email',
                        trigger: 'blur'
                      }
                    }
                  }}
                >
                  <div style={{ display: 'inline-flex', width: '100%' }}>
                    <Input
                      value={admin.value}
                      onChange={value =>
                        this.onChangeAdmins('admins', value, admin.key)
                      }
                    />
                    {admin.key === this.state.form.admins.length - 1 && (
                      <React.Fragment>
                        <Button onClick={this.addNewAdmin}>
                          Add another Admin
                        </Button>
                        {admin.key !== 0 && (
                          <Button
                            onClick={e => this.removeNewAdmin(admin.key, e)}
                          >
                            Delete
                          </Button>
                        )}
                      </React.Fragment>
                    )}
                  </div>
                </Form.Item>
              )
            })}
            <SubmitButton
              form={this.form.current}
              data={this.state.form}
              handleReset={this.handleReset}
              queryVariables={this.props.queryVariables}
            >
              Create
            </SubmitButton>
          </Form>
        </Layout.Col>
      </Layout.Row>
    )
  }
}

export default OrganizationAdd
