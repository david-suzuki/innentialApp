import React, { Component } from 'react'
import { Input, Form, Button, Loading, Select } from 'element-react'
import {
  FormGroupAdmin,
  FormDescription,
  IndustrySelector,
  Page
} from '../ui-components'
import { organizationOnboardingMutation } from '../../api'
import { Mutation } from 'react-apollo'
import '../../styles/theme/message.css'
import { organizationSizeOptions } from '../../environment'
import { captureFilteredError } from '../general'
import history from '../../history'

export default class OrganizationCreateForm extends Component {
  state = {
    form: {
      organizationName: this.props.organizationName || '',
      organizationSize: '',
      industry: '1234',
      locations: [],
      locationsValue: ''
    },
    rules: {
      organizationName: [
        { required: true, message: 'Required', trigger: 'blur' }
      ],
      organizationSize: [
        { required: true, message: 'Required', trigger: 'blur' }
      ],
      industry: [{ required: true, message: 'Required', trigger: 'blur' }]
    }
  }

  form = React.createRef()

  handleChange = (key, value) => {
    this.setState(({ form }) => ({
      form: { ...form, [key]: value }
    }))
  }

  handleSubmit = async (e, mutation, form) => {
    e.preventDefault()

    this.form.current.validate(valid => {
      if (valid) {
        const data = {
          organizationName: form.organizationName,
          organizationSize: form.organizationSize,
          industry: form.industry,
          locations: form.locations
        }
        mutation({ variables: { OrganizationOnboardingInput: data } })
          .then(res => {
            history.push('/onboarding/my-skills', this.props.routeState)
          })
          .catch(e => {
            captureFilteredError(e)
          })
      } else {
        return false
      }
    })
  }

  onLocationAdd = e => {
    e.preventDefault()
    const { locationsValue, locations } = this.state.form
    if (locationsValue !== '') {
      this.setState(({ form }) => ({
        form: {
          ...form,
          locations: [...locations, locationsValue],
          locationsValue: ''
        }
      }))
    }
  }

  onLocationRemove = (e, index) => {
    e.preventDefault()
    const { locations } = this.state.form
    this.setState(({ form }) => ({
      form: {
        ...form,
        locations: locations.filter((l, i) => i !== index)
      }
    }))
  }

  render() {
    const { form, rules } = this.state
    return (
      <Page>
        <Form
          ref={this.form}
          model={form}
          rules={rules}
          onSubmit={e => e.preventDefault()}
        >
          <FormGroupAdmin mainLabel='Please check the details of your organization'>
            <Form.Item prop='organizationName' label='Organization Name'>
              <Input
                placeholder='  '
                value={form.organizationName}
                onChange={val => this.handleChange('organizationName', val)}
              />
            </Form.Item>
            <Form.Item prop='organizationSize' label='Organization Size'>
              <Select
                placeholder=' '
                value={form.organizationSize}
                onChange={val => this.handleChange('organizationSize', val)}
              >
                {organizationSizeOptions.map(item => {
                  return (
                    <Select.Option
                      key={item.value}
                      value={item.value}
                      label={item.label}
                    />
                  )
                })}
              </Select>
            </Form.Item>
            <Form.Item prop='locations' label='Add locations (Not mandatory)'>
              <Input
                placeholder='i.e. Remote, Milan, Puerto Rico'
                value={form.locationsValue}
                onChange={val =>
                  this.setState(({ form }) => ({
                    form: { ...form, locationsValue: val }
                  }))
                }
              />
              <div className='align-left'>
                <span onClick={this.onLocationAdd} className='add-location'>
                  + Add location
                </span>
              </div>
              <div className='cascader-selections'>
                {form.locations.map((location, index) => (
                  <div key={index}>
                    <Button
                      type='primary'
                      className='el-button--cascader'
                      onClick={e => this.onLocationRemove(e, index)}
                    >
                      {location} <i className='icon icon-e-remove' />
                    </Button>
                  </div>
                ))}
              </div>
            </Form.Item>
          </FormGroupAdmin>
          <FormDescription
            label='Industry in which your organisation operates (Not mandatory)'
            description='We will use this information to provide
                      you benchmarking data of similar
                      organisations to yours'
          >
            <Form.Item prop='industry'>
              <IndustrySelector
                selectedIndustry={form.industry}
                onChangeIndustry={val =>
                  this.handleChange('industry', val.name)
                }
              />
            </Form.Item>
          </FormDescription>
          <div className='submit-container'>
            <Mutation mutation={organizationOnboardingMutation}>
              {(organizationOnboardingMutation, { loading, error }) => {
                if (loading) return <Loading fullscreen />
                if (error) return 'Oops something went wrong'
                return (
                  <Button
                    nativeType='submit'
                    type='signin'
                    size='large'
                    className='el-button--green'
                    onClick={e =>
                      this.handleSubmit(e, organizationOnboardingMutation, form)
                    }
                  >
                    Start Onboarding
                  </Button>
                )
              }}
            </Mutation>
          </div>
        </Form>
        <style jsx>{`
          .submit-container {
            margin-top: 2em;
            width: 100%;
            display: flex;
            justify-content: center;
          }
        `}</style>
      </Page>
    )
  }
}
