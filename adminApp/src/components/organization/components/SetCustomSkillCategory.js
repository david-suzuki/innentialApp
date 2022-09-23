import React, { Component } from 'react'
import { Form, Button, Message } from 'element-react'
import { Mutation } from 'react-apollo'
import { setCustomCategoryForSkill } from '../../../api'
import { withRouter } from 'react-router-dom'
import { SkillCategorySelector } from '../../skills/components'

class CategoriesRename extends Component {
  constructor(props) {
    super(props)

    const { skillId, organizationId } = props.match.params
    this.state = {
      form: {
        category: ''
      },
      skillId,
      organizationId
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
      const { organizationId } = this.state
      const { category } = this.state.form
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
              label='Category'
              prop='category'
              rules={{
                required: true,
                message: 'Please provide the category',
                trigger: 'blur'
              }}
            >
              <SkillCategorySelector
                value={category}
                onChange={value => this.onChange('category', value)}
                organizationId={organizationId}
              />
            </Form.Item>
          </Form>
          <Mutation
            mutation={setCustomCategoryForSkill}
            refetchQueries={['fetchOrganizationSkillsForAdmin']}
          >
            {mutate => {
              return (
                <Button
                  type='primary'
                  onClick={e => {
                    e.preventDefault()
                    this.form.current.validate(async valid => {
                      if (valid) {
                        const { skillId } = this.state
                        try {
                          await mutate({
                            variables: {
                              skillId,
                              organizationId,
                              categoryId: category
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
