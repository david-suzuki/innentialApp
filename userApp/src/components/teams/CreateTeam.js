import React, { Component } from 'react'
import {
  Input,
  Form,
  Button,
  Notification /*, AutoComplete */,
  Checkbox
} from 'element-react'
import Autosuggest from 'react-autosuggest'
import { FormDescription, FormGroup } from '../ui-components'
import { Mutation, Query } from 'react-apollo'
import {
  createNewTeam,
  fetchDataForCreateTeam,
  fetchCurrentUserOrganizationTeamsDetails,
  fetchSmallerCurrentUserOrganization
} from '../../api'
import { withRouter } from 'react-router-dom'
import createTeamStyle from '../../styles/createTeamStyle'
import '../../styles/theme/notification.css'
import '../../styles/theme/autocomplete.css'
import {
  captureFilteredError,
  LoadingSpinner,
  SentryDispatch
} from '../general'
import { emailCharacterValidator } from '../../utils'

class CreateTeam extends Component {
  state = {
    form: {
      name: '',
      leader: '',
      members: [],
      invite: true
    },
    employeeData: this.props.employeeData,
    suggestions: []
  }

  form = React.createRef()

  onChange = (key, value) => {
    this.setState(({ form }) => ({ form: { ...form, [key]: value } }))
  }

  onChangeLeader = (e, value) => {
    if (value === undefined) {
      captureFilteredError(`Undefined value in autosuggest component`)
    } else {
      const { newValue } = value
      this.setState(({ form }) => ({
        form: {
          ...form,
          leader: newValue
        }
      }))
    }
  }

  onChangeMember = (e, value) => {
    if (value === undefined) {
      captureFilteredError(`Undefined value in autosuggest component`)
    } else {
      const { newValue, i } = value
      this.setState(({ form }) => {
        const newMembers = form.members.map((m, idx) => {
          if (i === idx) return newValue
          return m
        })
        return { form: { ...form, members: newMembers } }
      })
    }
  }

  removeNewMember = (idx, e) => {
    e.preventDefault()
    const newMembers = this.state.form.members
    newMembers.splice(idx, 1)
    this.setState(({ form }) => ({ form: { ...form, members: newMembers } }))
  }

  addNewMember = e => {
    e.preventDefault()
    this.setState(({ form }) => ({
      form: {
        ...form,
        members: [...form.members].concat('')
      }
    }))
  }

  onSuggestionsFetchRequested = ({ value }) => {
    const filteredResults = this.state.employeeData.filter(
      this.filterResults(value)
    )

    this.setState({
      suggestions: filteredResults
    })
  }

  onSuggestionsClearRequested = () => {
    this.setState({
      suggestions: []
    })
  }

  onSuggestionSelected = (e, { suggestionValue }) => {
    this.setState(({ form }) => ({
      form: {
        ...form,
        leader: suggestionValue
      }
    }))
  }

  // handleAutocomplete = (queryString, callback, employeeData) => {
  //   if (queryString !== '') {
  //     const filteredResults = employeeData.filter(
  //       this.filterResults(queryString)
  //     )
  //     const employeeResults = filteredResults.map(
  //       ({ firstName, lastName, email }) => ({
  //         value: firstName
  //           ? `${firstName}${lastName ? ' ' + lastName : ''} | ${email}`
  //           : `${email}`,
  //         email
  //       })
  //     )
  //     callback(employeeResults)
  //   } else callback()
  // }

  // handleSelect = ({ email }, key, i) => {
  //   if (key === 'members' && i !== null) {
  //     this.setState(({ form }) => {
  //       const newMembers = form.members.map((m, idx) => {
  //         if (i === idx) return email
  //         return m
  //       })
  //       return { form: { ...form, members: newMembers } }
  //     })
  //   } else {
  //     this.setState(({ form }) => ({
  //       form: {
  //         ...form,
  //         leader: email
  //       }
  //     }))
  //   }
  // }

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

  goBack = () => {
    this.props.history.goBack()
  }

  render() {
    const {
      suggestions,
      form: { name, leader, members, invite }
    } = this.state
    return (
      <div className='create-team'>
        <div className='page-heading__header'>
          <i
            className='page-heading__back__button icon icon-small-right icon-rotate-180'
            onClick={this.goBack}
          />
          <div className='page-heading__header-info'>
            <h1>Create new team</h1>
          </div>
        </div>
        {/* <div className="create-team__heading">
          <i
            className="icon icon-small-right"
            // nativetype="submit" THROWS ERRORS FOR WHATEVER REASON
            type="signin"
            size="large"
            onClick={e => {
              e.preventDefault()
              this.goBack()
            }}
          />
          <FormDescription label="Invite your teams" />
        </div> */}
        <Form
          ref={this.form}
          model={this.state.form}
          onSubmit={e => e.preventDefault()}
        >
          <FormGroup>
            <Form.Item
              label='Team Name'
              prop='name'
              rules={{
                required: true,
                message: 'Please provide name of team',
                trigger: 'submit'
              }}
              className='component-block'
            >
              <Input
                value={name}
                onChange={value => this.onChange('name', value)}
              />
            </Form.Item>

            <Form.Item
              label='Team Lead'
              prop='leader'
              className='component-block'
              rules={[
                {
                  required: true,
                  message: 'Please provide an email',
                  trigger: 'submit'
                },
                {
                  type: 'email',
                  message: 'Please provide a valid email',
                  trigger: 'submit'
                },
                {
                  validator: emailCharacterValidator
                }
              ]}
            >
              <Autosuggest
                suggestions={suggestions}
                onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
                onSuggestionsClearRequested={this.onSuggestionsClearRequested}
                onSuggestionSelected={this.onSuggestionSelected}
                getSuggestionValue={suggestion => suggestion.email}
                renderSuggestion={({ firstName, lastName, email }) => {
                  return (
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
                  value: leader,
                  placeholder: 'Email',
                  onChange: this.onChangeLeader
                }}
              />
            </Form.Item>
            {members.map((member, i) => {
              return (
                <Form.Item
                  label={i === 0 ? 'Members' : ''}
                  prop={`members:${i}`}
                  key={i}
                  className='create-team__members'
                  rules={[
                    {
                      required: true,
                      message: 'Please provide an email',
                      trigger: 'submit'
                    },
                    {
                      type: 'email',
                      trigger: 'submit',
                      message: 'Please provide a valid email'
                    },
                    {
                      validator: (rule, value, callback) => {
                        if (
                          (value !== '' && value === leader) ||
                          members
                            .filter((member, ix) => ix !== i)
                            .some(member => member === value && value !== '')
                        ) {
                          callback(new Error(`Please provide unique emails`))
                        } else callback()
                      },
                      trigger: 'submit'
                    },
                    {
                      validator: emailCharacterValidator
                    }
                  ]}
                >
                  {/* {i > 0 && ( */}
                  <i
                    className='el-icon-delete icon--autosuggest'
                    onClick={e => this.removeNewMember(i, e)}
                  />
                  {/* )} */}
                  <Autosuggest
                    suggestions={suggestions}
                    onSuggestionsFetchRequested={
                      this.onSuggestionsFetchRequested
                    }
                    onSuggestionsClearRequested={
                      this.onSuggestionsClearRequested
                    }
                    getSuggestionValue={suggestion => suggestion.email}
                    renderSuggestion={({ firstName, lastName, email }) => {
                      return (
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
                      value: member,
                      placeholder: 'Email',
                      onChange: (event, value) =>
                        this.onChangeMember(event, { ...value, i })
                    }}
                  />
                </Form.Item>
              )
            })}
            <Button
              onClick={this.addNewMember}
              className='align-left'
              style={{ display: 'flex', alignItems: 'center' }}
              type='primary'
            >
              <span
                className='border-round'
                style={{
                  width: '14px',
                  display: 'flex',
                  justifyContent: 'center',
                  marginRight: '5px'
                }}
              >
                +
              </span>
              {'  '}
              {members.length > 0 ? `Add another team member` : `Add members`}
            </Button>
          </FormGroup>
          {/* <div className='component-block align-left platform-invites'>
            <Checkbox
              checked={invite}
              onChange={value => this.onChange('invite', value)}
            >
              Send platform invites for team members that are new employees
            </Checkbox>
          </div> */}

          <Mutation
            mutation={createNewTeam}
            awaitRefetchQueries={true}
            refetchQueries={[
              {
                query: fetchCurrentUserOrganizationTeamsDetails
              },
              {
                query: fetchSmallerCurrentUserOrganization
              },
              'fetchOpenAssessmentsForUser',
              'fetchEvaluationInfo',
              'fetchStatsOverviewData',
              'fetchOnboardedTeamsInOrganization'
            ]}
          >
            {(createNewTeam, { loading }) => {
              if (loading) return <LoadingSpinner />

              return (
                <Button
                  // nativeType="submit"
                  // type="signin"
                  size='large'
                  className='el-button--green'
                  onClick={e => {
                    e.preventDefault()
                    this.form.current.validate(async valid => {
                      if (valid) {
                        const finalData = {
                          leader: leader.toLowerCase(),
                          teamName: name,
                          members: members.map(m => m.toLowerCase()),
                          invite
                        }

                        createNewTeam({
                          variables: {
                            OrganizationCreateTeamData: finalData
                          }
                        })
                          .then(res => {
                            if (
                              res.data &&
                              res.data.createNewTeam === 'success'
                            ) {
                              Notification({
                                type: 'success',
                                message: 'Team successfully created',
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
                              captureFilteredError(e)
                              Notification({
                                type: 'error',
                                message: 'Something went wrong',
                                duration: 2500,
                                offset: 90,
                                iconClass: 'el-icon-error'
                              })
                            }
                          })
                      }
                    })
                  }}
                >
                  Create
                </Button>
              )
            }}
          </Mutation>
        </Form>
        <style jsx global>
          {createTeamStyle}
        </style>
      </div>
    )
  }
}

const FormQueryWrapper = props => (
  <Query query={fetchDataForCreateTeam}>
    {({ data, loading, error }) => {
      if (loading) return <LoadingSpinner />

      if (error) return <SentryDispatch error={error} />

      const employeeData = data?.fetchCurrentUserOrganization?.employees || []

      return <CreateTeam {...props} employeeData={employeeData} />
    }}
  </Query>
)

export default withRouter(FormQueryWrapper)
