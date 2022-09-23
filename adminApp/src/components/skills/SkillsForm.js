import React, { Component } from 'react'
import { Form, Input, Button } from 'element-react'
import { EditButton, SubmitButton, SkillCategorySelector } from './components'
import { Query } from 'react-apollo'
import { fetchDuplicateSkillInfo } from '../../api'

export default class SkillsForm extends Component {
  constructor(props) {
    super(props)

    const { initialValues } = props
    const { name, category } = initialValues || { name: '', category: '' }

    this.state = {
      form: {
        name,
        category
      }
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

  handleOnSubmitSuccess = () => {
    if (!this.props.initialValues) {
      this.form.current.resetFields()
      this.setState({
        form: {
          name: '',
          category: ''
        },
        duplicates: 0
      })
      this.props.toggleDialog()
    }
  }

  render() {
    const {
      form: { name, category },
      duplicates
    } = this.state
    const { skillId, organizationId, goBack } = this.props
    return (
      <div>
        <Form
          ref={this.form}
          labelPosition='top'
          className='en-US'
          model={this.state.form}
          labelWidth='120'
        >
          <Query
            query={fetchDuplicateSkillInfo}
            variables={{ name }}
            // pollInterval={500}
          >
            {({ data, loading }) => {
              const nOfDuplicates = data && data.fetchDuplicateSkillInfo
              return (
                <Form.Item
                  label='Name'
                  prop='name'
                  rules={[
                    {
                      required: true,
                      message: 'Please provide the skill name',
                      trigger: 'blur'
                    },
                    {
                      trigger: 'blur',
                      asyncValidator: (rule, value, callback) => {
                        if (!loading) {
                          this.setState({ duplicates: nOfDuplicates })
                          if (nOfDuplicates >= 0) {
                            callback()
                          } else if (skillId) {
                            callback()
                          } else {
                            callback(new Error(`Matching skill name found`))
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
                  {duplicates > 0 && !organizationId && (
                    <div>
                      {duplicates} duplicate skill{duplicates > 1 ? 's' : ''}{' '}
                      will be merged.
                    </div>
                  )}
                </Form.Item>
              )
            }}
          </Query>
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
        {this.props.initialValues ? (
          <span>
            <EditButton
              skillId={skillId}
              formRef={this.form}
              form={this.state.form}
              goBack={goBack}
            />
            <Button onClick={() => goBack()}>Go back</Button>
          </span>
        ) : (
          <SubmitButton
            formRef={this.form}
            handleOnSubmitSuccess={this.handleOnSubmitSuccess}
            form={this.state.form}
            organizationId={organizationId}
          />
        )}
      </div>
    )
  }
}
