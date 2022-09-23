import React, { Component } from 'react'
import { Form, Button, Notification, Checkbox } from 'element-react'
import { withRouter, Redirect } from 'react-router-dom'
import {
  addNewMember,
  fetchFilteredEmployeesNotPartOfTeam,
  fetchTeamDetails,
  fetchTeamMembers
} from '../../api'
import '../../styles/theme/select.css'
import '../../styles/theme/icon.css'
import addUserStyle from '../../styles/addUserStyle'
import { FormGroup, FormDescription } from '../ui-components'
import { Query, Mutation, useQuery } from 'react-apollo'
import '../../styles/theme/notification.css'
import { captureFilteredError, LoadingSpinner } from '../general'
import Autosuggest from 'react-autosuggest'
import { emailCharacterValidator } from '../../utils'

class AddNewMember extends Component {
  form = React.createRef()

  team = this.props.team

  state = {
    form: {
      email: this.props.email,
      invite: true
    },
    rules: {
      email: [
        {
          type: 'email',
          required: true,
          trigger: 'submit',
          message: 'Please enter a valid email'
        }
      ]
    },
    // formIsValid: false,
    employeeSelectOptions: this.props?.employees?.map(e => ({
      value: `${e.email}`,
      label: e.firstName
        ? `${e.firstName}${e.lastName ? ' ' + e.lastName : ''} | ${e.email}`
        : `${e.email}`
    })),
    suggestions: [],
    employeeData: this.props?.employees
  }

  componentWillReceiveProps(nProps) {
    this.team = nProps.team
    this.setState({
      employeeSelectOptions: this.props?.employees?.map(e => ({
        value: `${e.email}`,
        label: `${e.email}`
      })),
      employeeData: this.props?.employees
    })
  }

  goBack = () => {
    this.props.history.goBack()
  }

  // componentDidUpdate() {
  //   this.form.current.validate(valid => {
  //     if (valid !== this.state.formIsValid) {
  //       this.setState({ formIsValid: valid })
  //     }
  //   })
  // }

  onChangeForm = (value, key) => {
    const { form } = this.state
    this.setState({
      form: {
        ...form,
        [key]: value
      }
    })
  }

  onChangeEmail = (e, value) => {
    if (value === undefined) {
      captureFilteredError(`Undefined value in autosuggest component`)
    } else {
      const { newValue } = value
      this.setState(({ form }) => ({
        form: {
          ...form,
          email: this.props.email
        }
      }))
    }
  }

  onChangeSelect = value => {
    const selectedEmployee = this.props.employees.find(e => e.email === value)
    const { form } = this.state
    this.setState({
      form: {
        ...form,
        email: this.props.email
      }
    })
  }

  onSubmitMutation = (mutation, MemberInput) => {
    mutation({
      variables: { MemberInput }
    })
      .then(res => {
        if (res.data.addNewMember) {
          Notification({
            type: 'success',
            message: 'Member successfully added',
            duration: 2500,
            offset: 90
          })
          this.props.history.goBack()
        }
      })
      .catch(e => {
        if (e.graphQLErrors && e.graphQLErrors[0]) {
          Notification({
            type: 'error',
            message: `${e.graphQLErrors[0].message}`,
            duration: 2500,
            offset: 90,
            iconClass: 'el-icon-error'
          })
        } else {
          Notification({
            type: 'warning',
            message: 'Something went wrong',
            duration: 2500,
            offset: 90
          })
        }
      })
  }

  onSuggestionsFetchRequested = ({ value }) => {
    this.setState({
      suggestions: this.props.employees
    })
  }

  onSuggestionsClearRequested = () => {
    this.setState({
      suggestions: []
    })
  }

  filterResults = queryString => {
    return ({ email, firstName, lastName }) => {
      return (
        email.indexOf(queryString.toLowerCase()) !== -1 ||
        (firstName &&
          firstName.toLowerCase().indexOf(queryString.toLowerCase()) !== -1) ||
        (lastName &&
          lastName.toLowerCase().indexOf(queryString.toLowerCase()) !== -1)
      )
    }
  }

  render() {
    const {
      form: { email, invite /*, firstName */ },
      // formIsValid,
      // employeeSelectOptions,
      suggestions
    } = this.state

    const functionn = () => {
      return this.props.teamId
    }
    return (
      <div className='add-user'>
        <div className='page-heading__header'>
          <i
            className='page-heading__back__button icon icon-small-right icon-rotate-180'
            onClick={this.goBack}
          />
          <div className='page-heading__header-info'>
            <h1>Add new team member</h1>
          </div>
        </div>
        {/* {employeeSelectOptions.length > 0 && (
          <FormGroup mainLabel="Choose from an existing employee">
            <Select
              value={email}
              placeholder="Select an employee"
              onChange={value => this.onChangeSelect(value)}
            >
              {employeeSelectOptions.map(el => {
                return (
                  <Select.Option
                    key={el.value}
                    label={el.label}
                    value={el.value}
                  />
                )
              })}
            </Select>
          </FormGroup>
        )} */}
        <FormGroup>
          <Form
            model={this.state.form}
            ref={this.form}
            rules={this.state.rules}
            onSubmit={e => e.preventDefault()}
            invite
          >
            <Form.Item
              label='Email'
              prop='email'
              rules={[
                {
                  type: 'email',
                  message: 'This is not a valid email address',
                  trigger: 'blur',
                  required: true
                },
                {
                  validator: emailCharacterValidator
                }
              ]}
            >
              {/* <Input
                value={email}
                onChange={val => this.onChangeForm(val, 'email')}
              /> */}
              <Autosuggest
                suggestions={
                  this.props.loading
                    ? [{ email: this.props.email }]
                    : this.props.employees
                }
                onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
                onSuggestionsClearRequested={this.onSuggestionsClearRequested}
                getSuggestionValue={suggestion => {
                  this.setState(({ form }) => ({
                    form: {
                      ...form,
                      email: suggestion.email
                    }
                  }))
                  this.props.handleEmailChange(suggestion.email)

                  return this.props.email
                }}
                renderSuggestion={({ firstName, lastName, email }) => {
                  return this.props.loading ? (
                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                      <LoadingSpinner />
                    </div>
                  ) : (
                    <div>
                      {firstName
                        ? `${firstName}${
                            lastName ? ' ' + lastName : ''
                          } | ${email}`
                        : `${email}`}
                    </div>
                  )
                }}
                inputProps={{
                  value: this.props.email,
                  placeholder: 'Start typing to view suggestions',
                  onChange: e => {
                    this.setState({
                      ...this.state,
                      form: { ...this.state.form, email: e.target.value }
                    })
                    this.props.handleEmailChange(e.target.value)
                  }
                }}
              />
            </Form.Item>
            {/* <Form.Item label="First Name" prop="firstName">
              <Input
                value={firstName}
                onChange={val => this.onChangeForm(val, 'firstName')}
              />
            </Form.Item> */}
          </Form>
        </FormGroup>
        {/* <div className='component-block align-left'>
          <Checkbox
            checked={invite}
            onChange={value => this.onChangeForm(value, 'invite')}
          >
            Invite as a platform user
          </Checkbox>
        </div> */}
        <Mutation
          refetchQueries={[
            {
              query: fetchTeamDetails,
              variables: {
                teamId: this.props.teamId
              }
            },
            'fetchEvaluationInfo',
            'fetchLatestTeamEvaluation',
            'fetchStatsOverviewData',
            'fetchStatsTeamsData',
            'fetchStatsGrowthData',
            'fetchUsersProfile'
          ]}
          update={(proxy, data) => {
            try {
              const readQuery = proxy.readQuery({
                query: fetchTeamDetails,
                variables: {
                  teamId: this.props.teamId
                }
              })

              const checker =
                Number.isInteger(readQuery.fetchTeam.totalMembers / 20) &&
                readQuery.fetchTeam.totalMembers !== 0

              if (!checker) {
                let membersQuery = proxy.readQuery({
                  query: fetchTeamMembers,
                  variables: {
                    teamId: this.props.teamId,
                    membersLimit: 20,
                    membersSkip:
                      Math.floor(readQuery.fetchTeam.totalMembers / 20) * 20
                  }
                })

                membersQuery = {
                  fetchTeamMembers: {
                    ...membersQuery.fetchTeamMembers,
                    members: [
                      ...membersQuery.fetchTeamMembers.members,
                      data.data.addNewMember
                    ]
                  }
                }

                proxy.writeQuery({
                  query: fetchTeamMembers,
                  variables: {
                    teamId: this.props.teamId,
                    membersLimit:
                      Math.floor(readQuery.fetchTeam.totalMembers / 20) * 20
                  },
                  data: membersQuery
                })
              }
            } catch (e) {}
          }}
          mutation={addNewMember}
        >
          {(addNewMember, { loading }) => {
            if (loading) return <LoadingSpinner />
            return (
              <Button
                className='el-button--green el-button--space-top'
                // disabled={!formIsValid}
                size='large'
                onClick={e => {
                  e.preventDefault()

                  this.form.current.validate(valid => {
                    if (valid) {
                      const inputData = {
                        email: this.props.email.toLowerCase(),
                        teamId: this.props.teamId,
                        invite
                      }

                      this.onSubmitMutation(addNewMember, inputData)
                    }
                  })
                }}
              >
                Add
              </Button>
            )
          }}
        </Mutation>
        <style jsx global>
          {addUserStyle}
        </style>
      </div>
    )
  }
}

const OrganizationQuery = ({ location: { state }, history, currentUser }) => {
  if (state) {
    return (
      <Query
        query={fetchFilteredEmployeesNotPartOfTeam}
        variables={{ teamId: state.team._id }}
      >
        {({ data, loading, error }) => {
          if (loading) return <LoadingSpinner />
          if (error) {
            captureFilteredError(error)
            return null
          }
          if (data && data.fetchCurrentUserOrganization && data.fetchTeam)
            return (
              <AddNewMember
                organization={data.fetchCurrentUserOrganization}
                history={history}
                teamId={data.fetchTeam}
                currentUser={currentUser}
              />
            )
          return <Redirect to='/error-page/500' />
        }}
      </Query>
    )
  } else {
    return <Redirect to='/teams' />
  }
}
export default withRouter(props => {
  if (props.location.state) {
    const [email, setEmail] = React.useState('')
    const handleEmailChange = email => {
      setEmail(email)
    }

    const {
      data: employees,
      loading: employeesLoading,
      error: employeesError
    } = useQuery(fetchFilteredEmployeesNotPartOfTeam, {
      variables: { teamId: props.location.state.team._id, email: email },
      fetchPolicy: 'network-only'
    })

    return (
      <AddNewMember
        history={props.history}
        currentUser={props.currentUser}
        teamId={props.location.state.team._id}
        handleEmailChange={handleEmailChange}
        email={email}
        employees={employees?.fetchFilteredEmployeesNotPartOfTeam}
        loading={employeesLoading}
      />
    )
  } else {
    return <Redirect to='/teams' />
  }
})
