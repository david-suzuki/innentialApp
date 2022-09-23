import React, { Component } from 'react'
import { Layout, Form, Input } from 'element-react'

import { EditButton } from './components'

import { formValidationRules } from './constants'
import { fetchOrganization as OrganizationQuery } from '../../api'
import { Query } from 'react-apollo'

class OrganizationForm extends Component {
  form = React.createRef()
  state = {
    form: {
      organizationName: ''
    },
    organizationId: ''
  }

  componentDidMount() {
    const { initialValues = {} } = this.props
    if (Object.keys(initialValues.form).length !== 0) {
      this.setState(() => ({
        form: { ...initialValues.form },
        employees: [...initialValues.employees],
        organizationId: initialValues.organizationId
      }))
    }
  }

  onChange = (key, value) => {
    this.setState({
      form: Object.assign({}, this.state.form, {
        [key]: value
      })
    })
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
            <EditButton
              form={this.form.current}
              data={this.state.form}
              organizationId={this.state.organizationId}
            >
              Save Changes
            </EditButton>
          </Form>
        </Layout.Col>
      </Layout.Row>
    )
  }
}

const OrganizationEdit = ({ match }) => {
  const organizationId = match && match.params && match.params.organizationId

  return (
    <Query
      query={OrganizationQuery}
      fetchPolicy='cache-and-network'
      variables={{ organizationId }}
    >
      {({ loading, error, data }) => {
        if (loading) return 'Loading...'
        if (error) return `Error! ${error.message}`
        const organizationData = data && data.fetchOrganization
        const initialValues = {
          form: {
            organizationName: organizationData.organizationName
          },
          employees: organizationData.employees,
          organizationId: organizationData._id
        }
        return <OrganizationForm initialValues={initialValues} />
      }}
    </Query>
  )
}

export default OrganizationEdit
