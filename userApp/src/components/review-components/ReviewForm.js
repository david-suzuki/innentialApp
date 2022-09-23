import React from 'react'
import {
  Input,
  Select,
  DatePicker,
  Form,
  Button,
  Radio,
  Checkbox,
  TimeSelect
} from 'element-react'
import { FormGroup } from '../ui-components'
import { withRouter, Redirect } from 'react-router-dom'
import reviewFormStyle from '../../styles/reviewFormStyle'
import Autosuggest from 'react-autosuggest'
import SubmitButton from './SubmitFormButton'
import { Query, useQuery } from 'react-apollo'
import {
  fetchReviewScheduleEditInfo,
  fetchCurrentUserOrganization,
  fetchCurrentUserOrganizationTeams
} from '../../api'
import { captureFilteredError, LoadingSpinner } from '../general'
// I would like to make this a functional component,
// but element react just works awfully with functional components

const checkSameDay = (dateToCheck, actualDate) => {
  return (
    dateToCheck.getDate() === actualDate.getDate() &&
    dateToCheck.getMonth() === actualDate.getMonth() &&
    dateToCheck.getFullYear() === actualDate.getFullYear()
  )
}

const NumSelector = ({ value, setValue }) => {
  return (
    <Radio.Group value={value} onChange={setValue}>
      <Radio value={0}>S</Radio>
      <Radio value={1}>M</Radio>
      <Radio value={2}>T</Radio>
      <Radio value={3}>W</Radio>
      <Radio value={4}>T</Radio>
      <Radio value={5}>F</Radio>
      <Radio value={6}>S</Radio>
    </Radio.Group>
  )
}

const formDefaults = (edittingItem, /* leadersTeam, */ asLeader) => {
  if (edittingItem) {
    const {
      name,
      goalType,
      scopeType,
      specificScopes,
      specificUsers = [],
      reviewers,
      specificReviewers,
      reviewFrequency,
      progressCheckFrequency,
      firstReviewStart,
      _id,
      oneTimeReview
    } = edittingItem
    return {
      edittingId: _id,
      name,
      goalType,
      scopeType,
      specificScopes: specificScopes.map(({ _id }) => _id),
      specificUsers,
      reviewers,
      specificReviewers,
      reviewFrequency: {
        repeatCount: reviewFrequency.repeatCount,
        repeatInterval: reviewFrequency.repeatInterval
      },
      progressCheck: progressCheckFrequency.repeatCount,
      day: progressCheckFrequency.day,
      firstReviewStart: new Date(firstReviewStart),
      suggestions: [],
      suggested: '',
      suggestedTwo: '',
      disableProgressCheck: progressCheckFrequency.repeatCount === 0,
      oneTimeReview
    }
  }
  // else if (leadersTeam)
  //   return {
  //     name: '',
  //     goalType: 'PERSONAL',
  //     scopeType: 'SPECIFIC',
  //     specificScopes: [leadersTeam],
  //     reviewers: 'TEAMLEAD',
  //     specificReviewers: [],
  //     reviewFrequency: {
  //       repeatCount: 3,
  //       repeatInterval: 'MONTH'
  //     },
  //     firstReviewStart: new Date(),
  //     progressCheck: 1,
  //     suggestions: [],
  //     suggested: '',
  //     suggestedTwo: '',
  //     day: 1,
  //     disableProgressCheck: false,
  //     oneTimeReview: false,
  //     specificUsers: []
  //   }
  else if (asLeader)
    return {
      name: '',
      goalType: 'PERSONAL',
      scopeType: '',
      specificScopes: [],
      reviewers: 'TEAMLEAD',
      specificReviewers: [],
      reviewFrequency: {
        repeatCount: 3,
        repeatInterval: 'MONTH'
      },
      firstReviewStart: new Date(),
      progressCheck: 1,
      suggestions: [],
      suggestedTwo: '',
      suggested: '',
      day: 1,
      disableProgressCheck: false,
      oneTimeReview: false,
      specificUsers: []
    }
  else
    return {
      name: '',
      goalType: 'PERSONAL',
      scopeType: '',
      specificScopes: [],
      reviewers: '',
      specificReviewers: [],
      reviewFrequency: {
        repeatCount: 3,
        repeatInterval: 'MONTH'
      },
      firstReviewStart: new Date(),
      progressCheck: 1,
      suggestions: [],
      suggested: '',
      suggestedTwo: '',
      day: 1,
      disableProgressCheck: false,
      oneTimeReview: false,
      specificUsers: []
    }
}

const mapTeamsAsOptions = (teams, currentUserId) => {
  const options = []
  teams
    .filter(({ leader }) => leader._id === currentUserId)
    .forEach(({ members, leader }) => {
      members.forEach(member => {
        if (!options.find(({ _id }) => member._id === _id)) options.push(member)
      })
    })
  return options
}

export class ReviewForm extends React.Component {
  constructor(props) {
    super(props)
    const edittingItem = props.edittingItem
    this.state = formDefaults(
      edittingItem,
      /* props.leadersTeam, */ props.asLeader
    )

    this.employeeData = props.asLeader
      ? mapTeamsAsOptions(props.organizationData.teams, props.currentUser._id)
      : props.organizationData.employees.filter(emp => emp.status === 'active')

    const validTeams = props.asLeader
      ? props.organizationData.teams.filter(
          ({ leader }) => leader._id === props.currentUser._id
        )
      : props.organizationData.teams
    this.teamSelectOptions = validTeams.map(({ _id, teamName }) => (
      <Select.Option key={_id} value={_id} label={teamName} />
    ))
  }

  componentWillReceiveProps(props) {
    // sdasfa
  }

  onIntervalChange = val => {
    const { reviewFrequency } = this.state
    this.setState({
      reviewFrequency: {
        ...reviewFrequency,
        repeatInterval: val
      }
    })
  }

  onRepeatCountChange = val => {
    const { reviewFrequency } = this.state
    this.setState({
      reviewFrequency: {
        ...reviewFrequency,
        repeatCount: val
      }
    })
  }

  disableProgressCheck = val => {
    const { progressCheck } = this.state
    const newCheck = val ? 0 : progressCheck === 0 ? 1 : progressCheck
    this.setState({ disableProgressCheck: val, progressCheck: newCheck })
  }

  // AUTO SUGGEST
  onSuggestionsFetchRequested = ({ value }) => {
    const filteredResults = this.employeeData.filter(this.filterResults(value))
    this.setState({
      suggestions: filteredResults
    })
  }

  onSuggestionsClearRequested = () => {
    this.setState({
      suggestions: []
    })
  }

  filterResults = (queryString = '') => {
    return ({ email = '', firstName = '', lastName = '' }) => {
      return (
        email.indexOf(queryString.toLowerCase()) !== -1 ||
        firstName.toLowerCase().indexOf(queryString.toLowerCase()) !== -1 ||
        lastName.toLowerCase().indexOf(queryString.toLowerCase()) !== -1
      )
    }
  }

  onChangeSuggestion = (event, { newValue }) => {
    this.setState({
      suggested: newValue
    })
  }

  onChangeSuggestionTwo = (event, { newValue }) => {
    this.setState({
      suggestedTwo: newValue
    })
  }

  onSuggestionSelected = (event, { suggestion }) => {
    const safeUsers = this.state.specificReviewers.filter(
      user => user._id !== suggestion._id
    )
    this.setState(
      {
        specificReviewers: [...safeUsers, suggestion],
        suggestedTwo: '',
        suggested: ''
      },
      () => this.myRef.current.validateField('specificReviewers')
    )
  }

  onScopeSuggestionSelected = (event, { suggestion }) => {
    const safeUsers = this.state.specificUsers.filter(
      user => user._id !== suggestion._id
    )
    this.setState(
      {
        specificUsers: [...safeUsers, suggestion],
        suggested: '',
        suggestedTwo: ''
      },
      () => this.myRef.current.validateField('specificUsers')
    )
  }

  removeUser = (_id, key) => {
    this.setState({
      [key]: this.state[key].filter(u => u._id !== _id)
    })
  }
  // !AUTO SUGGEST

  myRef = React.createRef()

  render() {
    const {
      name,
      goalType,
      scopeType,
      specificScopes,
      reviewers,
      specificReviewers,
      reviewFrequency,
      firstReviewStart,
      progressCheck,
      suggestions,
      suggested,
      suggestedTwo,
      day,
      edittingId,
      disableProgressCheck,
      oneTimeReview,
      specificUsers
    } = this.state

    // const disableSelects = !!this.props.leadersTeam
    const { asLeader } = this.props

    const showTimeSelector =
      asLeader &&
      scopeType === 'PERSONAL' &&
      specificUsers.length === 1 &&
      !checkSameDay(firstReviewStart, new Date())

    return (
      <>
        <Form
          ref={this.myRef}
          model={this.state}
          onSubmit={e => e.preventDefault()}
          // TODO: VALIDATE
        >
          <div className='reviewForm__title'>
            <i
              className='review-form__back__button icon icon-small-right icon-rotate-180'
              type='signin'
              size='large'
              onClick={e => {
                e.preventDefault()
                this.props.history.goBack()
              }}
            />
            {edittingId ? 'Update review' : 'Schedule a new review'}
            <Button
              className='el-button--help'
              onClick={() => window.Intercom('startTour', 83612)}
            >
              ?
            </Button>
          </div>
          <FormGroup>
            <Form.Item
              label='Name'
              rules={{
                type: 'string',
                required: true,
                message: 'Required',
                trigger: 'blur'
              }}
              prop='name'
            >
              <Input
                value={name}
                onChange={name => this.setState({ name })}
                placeholder={`e.g. "Personal Development Planning"`}
              />
            </Form.Item>

            {/* GOAL TYPES REMOVED FOR NOW */}
            {/* <Form.Item
              label="What to review?"
              rules={{
                type: 'string',
                required: true,
                message: 'Required',
                trigger: 'blur'
              }}
              prop="goalType"
            >
              <Select
                value={goalType}
                placeholder="Select goals"
                onChange={val => this.setState({ goalType: val })}
              >
                <Select.Option label="Personal Goals" value="PERSONAL" />
                <Select.Option
                  label="Organization Goals (Coming soon!)"
                  disabled
                />
                <Select.Option label="Team Goals (Coming soon!)" disabled />
              </Select>
            </Form.Item> */}

            <Form.Item
              label='Who to review?'
              rules={{
                type: 'string',
                required: true,
                message: 'Required',
                trigger: 'blur'
              }}
              prop='scopeType'
            >
              <Select
                value={scopeType}
                placeholder='Select the scope of the review'
                onChange={val => {
                  if (val === 'ALL')
                    this.setState({ scopeType: val, specificScopes: [] })
                  else this.setState({ scopeType: val })
                }}
                // disabled={disableSelects}
              >
                {asLeader ? (
                  <>
                    <Select.Option label='My Teams' value='SPECIFIC' />
                    <Select.Option label='Specific People' value='PERSONAL' />
                  </>
                ) : (
                  <>
                    <Select.Option label='All Teams' value='ALL' />
                    <Select.Option label='Specific Teams' value='SPECIFIC' />
                    <Select.Option label='Specific People' value='PERSONAL' />
                  </>
                )}
              </Select>
            </Form.Item>
            {scopeType === 'SPECIFIC' && (
              <Form.Item
                label='Select which teams to include'
                className='review-form__highlight-element'
                rules={[
                  {
                    type: 'array',
                    trigger: 'blur'
                  },
                  {
                    validator: (rule, value, callback) => {
                      if (
                        scopeType === 'SPECIFIC' &&
                        Array.isArray(value) &&
                        value.length === 0
                      ) {
                        callback(new Error('Required'))
                      } else callback()
                    }
                  }
                ]}
                prop='specificScopes'
              >
                <Select
                  multiple
                  value={specificScopes}
                  placeholder='Select Teams'
                  onChange={specificScopes => this.setState({ specificScopes })}
                  // disabled={disableSelects}
                >
                  {this.teamSelectOptions}
                </Select>
              </Form.Item>
            )}

            {scopeType === 'PERSONAL' && (
              <Form.Item
                label='Select whom to review'
                className='review-form__highlight-element'
                rules={[
                  {
                    type: 'array',
                    trigger: 'blur'
                  },
                  {
                    validator: (rule, value, callback) => {
                      if (
                        scopeType === 'PERSONAL' &&
                        Array.isArray(value) &&
                        value.length === 0
                      ) {
                        callback(new Error('Required'))
                      } else callback()
                    }
                  }
                ]}
                prop='specificUsers'
              >
                {/* <Select
                  multiple
                  value={specificUsers}
                  placeholder="Select Teams"
                  onChange={specificUsers => this.setState({ specificUsers })}
                >
                  {this.userSelectOptions}
                </Select> */}
                <Autosuggest
                  suggestions={suggestions}
                  onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
                  onSuggestionsClearRequested={this.onSuggestionsClearRequested}
                  getSuggestionValue={suggestion => suggestion.email}
                  onSuggestionSelected={this.onScopeSuggestionSelected}
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
                    value: suggestedTwo,
                    placeholder: 'Start typing to find employees',
                    onChange: this.onChangeSuggestionTwo
                  }}
                />
                <div style={{ marginTop: 12, marginBottom: 12 }}>
                  {specificUsers.map(({ firstName, lastName, email, _id }) => (
                    <Button
                      key={_id}
                      type='primary'
                      className='el-button--cascader'
                      onClick={e => this.removeUser(_id, 'specificUsers')}
                    >
                      {firstName
                        ? `${firstName}${
                            lastName ? ' ' + lastName : ''
                          } | ${email}`
                        : `${email}`}{' '}
                      <i className='icon icon-e-remove' />
                    </Button>
                  ))}
                </div>
              </Form.Item>
            )}

            {!this.props.asLeader && (
              <Form.Item
                label='Reviewer?'
                rules={{
                  type: 'string',
                  required: true,
                  message: 'Required',
                  trigger: 'blur'
                }}
                prop='reviewers'
              >
                <Select
                  value={reviewers}
                  placeholder='Select Reviewer'
                  onChange={val => {
                    if (val !== 'SPECIFIC')
                      this.setState({ reviewers: val, specificReviewers: [] })
                    else this.setState({ reviewers: val })
                  }}
                  disabled={/* disableSelects || */ asLeader}
                >
                  <Select.Option label='Admin' value='ADMIN' />
                  {scopeType !== 'PERSONAL' && (
                    <Select.Option label='Team Leaders' value='TEAMLEAD' />
                  )}
                  <Select.Option label='Specific People' value='SPECIFIC' />
                </Select>
              </Form.Item>
            )}
            {reviewers === 'SPECIFIC' && !asLeader && (
              <Form.Item
                label='Select reviewers'
                className='review-form__highlight-element'
                rules={[
                  {
                    type: 'array',
                    trigger: 'blur'
                  },
                  {
                    validator: (rule, value, callback) => {
                      if (
                        reviewers === 'SPECIFIC' &&
                        Array.isArray(value) &&
                        value.length === 0
                      ) {
                        callback(new Error('Required'))
                      } else callback()
                    }
                  }
                ]}
                prop='specificReviewers'
              >
                <Autosuggest
                  suggestions={suggestions}
                  onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
                  onSuggestionsClearRequested={this.onSuggestionsClearRequested}
                  getSuggestionValue={suggestion => suggestion.email}
                  onSuggestionSelected={this.onSuggestionSelected}
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
                    value: suggested,
                    placeholder: 'Start typing to find employees',
                    onChange: this.onChangeSuggestion
                  }}
                />
                <div style={{ marginTop: 12, marginBottom: 12 }}>
                  {specificReviewers.map(
                    ({ firstName, lastName, email, _id }) => (
                      <Button
                        key={_id}
                        type='primary'
                        className='el-button--cascader'
                        onClick={e => this.removeUser(_id, 'specificReviewers')}
                      >
                        {firstName
                          ? `${firstName}${
                              lastName ? ' ' + lastName : ''
                            } | ${email}`
                          : `${email}`}{' '}
                        <i className='icon icon-e-remove' />
                      </Button>
                    )
                  )}
                </div>
              </Form.Item>
            )}

            <Form.Item label='How often should the review happen?'>
              <div
                className='review-form__inline-label'
                style={{ paddingBottom: '15px' }}
              >
                Every
                <Input
                  style={{ width: '40px', margin: '0 10px' }}
                  type='number'
                  value={reviewFrequency.repeatCount}
                  onChange={val => this.onRepeatCountChange(val)}
                  min={1}
                  max={52}
                />
                <Select
                  style={{ display: 'inline-block' }}
                  value={reviewFrequency.repeatInterval}
                  placeholder='Select repeat interval'
                  onChange={val => this.onIntervalChange(val)}
                >
                  <Select.Option label='Weeks' value='WEEK' />
                  <Select.Option label='Months' value='MONTH' />
                  <Select.Option label='Years' value='YEAR' />
                </Select>
              </div>
              {/* 
              <span className="review-form__disable-progress-checks">
                One time only
                <Checkbox
                  disabled={this.props.edittingItem && this.props.edittingItem.oneTimeReview}
                  checked={oneTimeReview}
                  style={{ marginLeft: '24px' }}
                  onChange={val => this.setState({ oneTimeReview: val })}
                />
              </span> */}
            </Form.Item>

            {!edittingId && (
              <Form.Item label='When should the first review start?'>
                <div style={{ paddingBottom: '15px' }}>
                  <DatePicker
                    value={firstReviewStart}
                    onChange={date => {
                      if (date !== null) {
                        const newDate = new Date(
                          date.getFullYear(),
                          date.getMonth(),
                          date.getDate(),
                          firstReviewStart.getHours(),
                          firstReviewStart.getMinutes(),
                          0,
                          0
                        )
                        this.setState({ firstReviewStart: newDate })
                      }
                    }}
                    format={
                      showTimeSelector ? 'yyyy-MM-dd HH:mm' : 'yyyy-MM-dd'
                    }
                    disabledDate={
                      date => date < Date.now() - 8.28e7 /* 23 hours */
                    }
                  />
                  {showTimeSelector && (
                    <TimeSelect
                      step='00:15'
                      placeholder='Change the starting time'
                      onChange={date => {
                        const newDate = new Date(
                          firstReviewStart.getFullYear(),
                          firstReviewStart.getMonth(),
                          firstReviewStart.getDate(),
                          date.getHours(),
                          date.getMinutes(),
                          0,
                          0
                        )
                        this.setState({ firstReviewStart: newDate })
                      }}
                    />
                  )}
                </div>
              </Form.Item>
            )}

            <Form.Item label='How often do you want to check the progress'>
              {!disableProgressCheck && (
                <div className='review-form__week-input'>
                  <div className='review-form__week-input-number'>
                    Every
                    <Input
                      style={{ width: '40px', margin: '0 10px' }}
                      type='number'
                      value={progressCheck}
                      onChange={progressCheck =>
                        this.setState({ progressCheck })
                      }
                      min={1}
                      max={4}
                    />
                    {progressCheck !== 1 ? 'weeks ' : 'week '}
                  </div>

                  <div className='review-form__week-input-days'>
                    on:
                    <NumSelector
                      value={day}
                      setValue={val => this.setState({ day: val })}
                    />
                  </div>
                </div>
              )}

              <span className='review-form__disable-progress-checks'>
                Disable Progress Checks
                <Checkbox
                  checked={disableProgressCheck}
                  style={{ marginLeft: '24px' }}
                  onChange={val => this.disableProgressCheck(val)}
                />
              </span>
            </Form.Item>
          </FormGroup>
        </Form>
        <SubmitButton
          inputData={{
            edittingId,
            name,
            goalType,
            scopeType,
            specificScopes,
            reviewers,
            specificReviewers: specificReviewers.map(({ _id }) => _id),
            specificUsers: specificUsers.map(({ _id }) => _id),
            firstReviewStart,
            reviewFrequency,
            progressCheckFrequency: {
              repeatCount: progressCheck,
              day
            },
            leadersReview: /* disableSelects || */ this.props.asLeader,
            oneTimeReview
          }}
          formRef={this.myRef}
          history={this.props.history}
          redirectToHome
          calendarEmails={[
            ...specificReviewers.map(({ email }) => email),
            ...specificUsers.map(({ email }) => email)
          ]}
          skipScheduling={!showTimeSelector}
        />
        <style jsx>{reviewFormStyle}</style>
      </>
    )
  }
}

const EditHandler = ({ location, ...rest }) => {
  const admin = rest.currentUser.roles.indexOf('ADMIN') !== -1
  const asLeader = !admin && rest.currentUser.leader
  if (!admin /* && !leadersTeam */ && !asLeader)
    return <Redirect to={{ pathname: '/' }} />
  const edittingItem = location.state && location.state.edittingItem
  if (!edittingItem) {
    return (
      <ReviewForm
        {...rest}
        /* leadersTeam={leadersTeam} */ asLeader={asLeader}
      />
    )
  } else {
    return (
      <Query
        query={fetchReviewScheduleEditInfo}
        variables={{ templateId: edittingItem._id }}
      >
        {({ data, loading, error }) => {
          if (loading) return <LoadingSpinner />
          if (error) {
            captureFilteredError(error)
            return 'Error'
          }

          // console.log(data)
          return (
            <ReviewForm
              edittingItem={data.fetchReviewScheduleEditInfo}
              {...rest}
              // leadersTeam={leadersTeam}
              asLeader={asLeader}
            />
          )
        }}
      </Query>
    )
  }
}
export default withRouter(props => {
  const queryDecider = props.queryDecider
  if (queryDecider) {
    const {
      data: currentUserOrganizationData,
      loading: currentUserOrganizationLoading,
      error: currentUserOrganizationError
    } = useQuery(fetchCurrentUserOrganization)

    if (!currentUserOrganizationLoading) {
      const organizationData =
        currentUserOrganizationData.fetchCurrentUserOrganization
      return <EditHandler {...props} organizationData={organizationData} />
    } else if (currentUserOrganizationLoading) {
      return <LoadingSpinner />
    }
  } else if (!queryDecider) {
    const {
      data: currentUserTeamsData,
      loading: currentUserTeamsLoading,
      error: currentUserTeamsError
    } = useQuery(fetchCurrentUserOrganizationTeams)

    if (!currentUserTeamsLoading) {
      const organizationData = {
        teams: currentUserTeamsData.fetchCurrentUserOrganization.teams,
        employees: []
      }
      return <EditHandler {...props} organizationData={organizationData} />
    } else if (currentUserTeamsLoading) {
      return <LoadingSpinner />
    }
  }
})
