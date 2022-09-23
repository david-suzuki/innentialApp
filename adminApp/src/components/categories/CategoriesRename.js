import React, { Component } from 'react'
import { Form, Input, Button, Message } from 'element-react'
import { Mutation } from 'react-apollo'
import { renameCategory } from '../../api'
import { withRouter } from 'react-router-dom'

class CategoriesRename extends Component {
  constructor(props) {
    super(props)

    const { state } = props.location
    if (!state) {
      props.history.push(`/skill-categories`)
    } else {
      this.state = {
        form: {
          name: state.name
        },
        categoryId: props.match.params.categoryId
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

  render() {
    if (this.state) {
      const { name } = this.state.form
      return (
        <div>
          <Form
            ref={this.form}
            labelPosition='top'
            className='en-US'
            model={this.state.form}
            labelWidth='120'
          >
            <Form.Item
              label='New name'
              prop='name'
              rules={[
                {
                  required: true,
                  message: 'Please input category name',
                  trigger: 'blur'
                }
                // {
                //   validator: (rule, value, callback) => {
                //     if (value.length < 16) {
                //       callback()
                //     } else callback(new Error(`New name is too long`))
                //   },
                //   trigger: 'change'
                // }
              ]}
            >
              <Input
                value={name}
                onChange={value => this.onChange('name', value)}
              />
            </Form.Item>
          </Form>
          <Mutation
            mutation={renameCategory}
            refetchQueries={[
              'fetchOrganizationSpecificSkills',
              'fetchOrganizationSpecificSkillsForAdmin',
              'fetchSkillCategoriesForOrganization',
              'fetchAllSkillCategories',
              'fetchRegularSkills',
              'fetchAllSkills'
            ]}
          >
            {mutate => {
              return (
                <Button
                  type='primary'
                  onClick={e => {
                    e.preventDefault()
                    this.form.current.validate(async valid => {
                      if (valid) {
                        const { categoryId } = this.state
                        try {
                          await mutate({
                            variables: {
                              name,
                              categoryId
                            }
                          })
                          Message({
                            type: 'success',
                            message: 'Successfully updated'
                          })
                          this.props.history.goBack()
                        } catch (e) {
                          Message({
                            type: 'error',
                            message: `${e.message}`
                          })
                        }
                      }
                    })
                  }}
                >
                  Submit
                </Button>
              )
            }}
          </Mutation>
          <Button onClick={() => this.props.history.goBack()}>Go back</Button>
        </div>
      )
    } else return null
  }
}

export default withRouter(CategoriesRename)
