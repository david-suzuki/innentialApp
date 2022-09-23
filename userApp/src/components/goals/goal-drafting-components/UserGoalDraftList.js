import React, { useState, Component } from 'react'
import { Notification, Button, Checkbox, Input, Select } from 'element-react'
import { withRouter, Redirect } from 'react-router-dom'
import { Statement, GoalItem } from '../../ui-components'
import { Query, Mutation } from 'react-apollo'
import { fetchDraftGoalsForUser, approveGoals } from '../../../api'
import { captureFilteredError, LoadingSpinner } from '../../general'
import goalReviewStyle from '../../../styles/goalReviewStyle'
import { getApprovalOptions } from '../utils/_getOptions'
import { DevelopmentPlanSetting } from '../../development-plans'

/*
  {
    name: String! // {firstName}'s goal review
    goalType: String! // "PERSONAL"
    scopeType: String! // "SPECIFIC"
    specificScopes: [String] // []
    specificUsers: [String] // [userId]
    reviewers: String! // SPECIFIC
    specificReviewers: [String] // []
    firstReviewStart: DateTime! // now + 1/2 weeks?
    reviewFrequency: FrequencyInput // 
    progressCheckFrequency: FrequencyInput
    leadersReview: Boolean
    oneTimeReview: Boolean
  }
*/

const DateSelect = ({ value, onChange }) => {
  // const dayOfWeek = new Date().getDay()
  // const multiplier = dayOfWeek === 0 ? 1 : 8 - dayOfWeek

  return (
    <Select
      value={value}
      onChange={onChange}
      style={{ display: 'inline-block', marginLeft: '12px' }}
      placeholder='Pick a time'
    >
      <Select.Option value={null} label='No deadline' />
      {/* <Select.Option
        value={new Date(Date.now() + multiplier * 8.64e7)}
        label="By next week"
      /> */}
      <Select.Option value={new Date(Date.now() + 6.048e8)} label='In 1 week' />
      <Select.Option
        value={new Date(Date.now() + 2 * 6.048e8)}
        label='In 2 weeks'
      />
      <Select.Option
        value={new Date(Date.now() + 3 * 6.048e8)}
        label='In 3 weeks'
      />
      <Select.Option
        value={new Date(Date.now() + 2.628e9)}
        label='In 1 month'
      />
      <Select.Option
        value={new Date(Date.now() + 2 * 2.628e9)}
        label='In 2 months'
      />
      <Select.Option
        value={new Date(Date.now() + 3 * 2.628e9)}
        label='In 3 months'
      />
    </Select>
  )
}

const goalString = goals =>
  `When is the deadline for ${goals.length} goal${
    goals.length !== 1 ? 's' : ''
  }: `

class GoalList extends Component {
  state = {
    goals: this.props.goals.map(
      ({ relatedSkills, developmentPlan: { content, mentors }, ...goal }) => ({
        ...goal,
        relatedSkills: relatedSkills.map(({ _id, name }) => ({ _id, name })),
        developmentPlan: {
          mentors,
          content: content.map(({ content, setBy }) => ({ ...content, setBy }))
        }
      })
    ),
    addReview: true,
    deadline: null,
    settingDevelopmentPlan: false,
    activeGoalIndex: null
  }

  handleMutating = async (mutate, variables, firstName) => {
    try {
      const {
        data: { approveGoals: response }
      } = await mutate({
        variables
      })
      if (response !== null) {
        Notification({
          type: 'success',
          message: `Your decision has been submitted.${
            firstName ? ` ${firstName} will be notified of this.` : ''
          }`,
          duration: 2500,
          offset: 90
        })
        return 0
      } else {
        Notification({
          type: 'warning',
          message: 'Oops, something went wrong!',
          duration: 2500,
          offset: 90
        })
        return 1
      }
    } catch (err) {
      captureFilteredError(err)
      Notification({
        type: 'warning',
        message: 'Oops, something went wrong!',
        duration: 2500,
        offset: 90
      })
      return 1
    }
  }

  handleApproving = (index, decision) => {
    this.setState(({ goals }) => {
      const newGoals = goals.map(({ approved, ...rest }, i) => ({
        ...rest,
        approved: i === index ? decision : approved
      }))
      return {
        goals: newGoals
      }
    })
  }

  handleNoteChange = (index, value) => {
    this.setState(({ goals }) => {
      const newGoals = goals.map((goal, i) => ({
        ...goal,
        note: index === i ? value : goal.note
      }))
      return {
        goals: newGoals
      }
    })
  }

  // toggleHeaderPosiiton = devPlan => {
  //   const tabsHeader = document.getElementById('tabsHeader')
  //   return (tabsHeader.className = !devPlan
  //     ? 'tabs-header__content content--right'
  //     : 'tabs-header__content')
  // }

  toggleSettingDevelopmentPlan = goalIndex => {
    this.setState(({ settingDevelopmentPlan: value }) => ({
      settingDevelopmentPlan: !value,
      activeGoalIndex: goalIndex
    }))
    this.props.toggleReviewHeading()
    // this.toggleHeaderPosiiton(this.state.settingDevelopmentPlan)
  }

  setPlanForGoal = (content, mentors) => {
    this.setState(({ activeGoalIndex, goals }) => {
      const newGoals = goals.map((goal, i) => ({
        ...goal,
        developmentPlan:
          i === activeGoalIndex
            ? {
                content,
                mentors
              }
            : goal.developmentPlan
      }))
      return {
        goals: newGoals
      }
    })
  }

  render() {
    const {
      goals,
      addReview,
      deadline,
      settingDevelopmentPlan,
      activeGoalIndex
    } = this.state
    const { history, firstName, userId: user, currentUser } = this.props
    if (settingDevelopmentPlan) {
      const {
        _id: goalId,
        goalName,
        relatedSkills,
        measures,
        developmentPlan: { content, mentors }
      } = goals[activeGoalIndex]

      return (
        <DevelopmentPlanSetting
          onBackButtonClick={this.toggleSettingDevelopmentPlan}
          selectedContent={content}
          selectedMentors={mentors}
          neededSkills={relatedSkills}
          setPlanForGoal={this.setPlanForGoal}
          goalId={goalId}
          user={user}
          currentUser={currentUser}
          isOnGoalApproval
          status='DRAFT'
        >
          <GoalItem
            goalName={goalName}
            relatedSkills={relatedSkills}
            measures={[]}
            hideMeasureCount
          />
        </DevelopmentPlanSetting>
      )
    } else {
      return (
        <>
          {goals.map(({ _id, approved, note, ...rest }, i) => (
            <React.Fragment key={_id}>
              <GoalItem
                _id={_id}
                {...rest}
                showDevPlanButton
                inApproval
                hideMeasureCount
                onDevPlanButtonClick={() =>
                  this.toggleSettingDevelopmentPlan(i)
                }
                options={getApprovalOptions({
                  handleApproving: value => this.handleApproving(i, value),
                  approved
                })}
              >
                <Input
                  type='textarea'
                  autosize={{ minRows: 1, maxRows: 3 }}
                  placeholder={`Add a note${
                    firstName ? ` for ${firstName}` : ''
                  }`}
                  value={note}
                  onChange={value => this.handleNoteChange(i, value)}
                  style={{ marginBottom: '15px' }}
                />
              </GoalItem>
            </React.Fragment>
          ))}
          {goals.some(({ approved }) => approved) && (
            <div className='align-left' style={{ marginBottom: '15px' }}>
              <span style={{ fontSize: '13px' }}>
                {goalString(goals.filter(({ approved }) => approved))}
                <DateSelect
                  value={deadline}
                  onChange={value => this.setState({ deadline: value })}
                />
              </span>
              {deadline && (
                <div style={{ padding: '15px 0px' }}>
                  <Checkbox
                    className='full-label'
                    checked={addReview}
                    onChange={value => this.setState({ addReview: value })}
                  >
                    I would like to review {firstName || ' the employee'}'s
                    progress on their goals on the day of the deadline
                  </Checkbox>
                </div>
              )}
            </div>
          )}
          <Mutation mutation={approveGoals}>
            {(mutate, { loading }) => (
              <Button
                type='primary'
                onClick={async () => {
                  const variables = {
                    goals: goals.map(
                      ({
                        _id: goalId,
                        approved,
                        note,
                        developmentPlan: { content, mentors }
                      }) => ({
                        goalId,
                        approved,
                        note,
                        developmentPlan: {
                          content: content.map(
                            ({
                              _id: contentId,
                              type: contentType,
                              price: { value: price }
                            }) => {
                              return {
                                contentId,
                                contentType,
                                price
                              }
                            }
                          ),
                          mentors: mentors.map(({ _id: mentorId }) => ({
                            mentorId
                          }))
                        }
                      })
                    ),
                    user,
                    deadline,
                    addReview
                  }
                  const error = await this.handleMutating(
                    mutate,
                    variables,
                    firstName
                  )
                  if (!error) history.goBack()
                }}
                disabled={goals.some(goal => goal.approved === undefined)}
                loading={loading}
                size='large'
              >
                Finish review
              </Button>
            )}
          </Mutation>
        </>
      )
    }
  }
}

export default withRouter(
  ({ match: { params }, history, location: { search }, currentUser }) => {
    const { userId } = params
    if (!userId) {
      history.goBack()
      return null
    } else {
      const searchStrings = search && search.split('?')[1].split('&')
      const nameSearch =
        searchStrings &&
        searchStrings.find(str => str.indexOf('firstName') === 0)
      const firstName = nameSearch && nameSearch.split('=')[1]

      const [reviewHeadingVisible, setReviewHeading] = useState(true)

      return (
        <Query
          query={fetchDraftGoalsForUser}
          variables={{ userId }}
          fetchPolicy='cache-and-network'
        >
          {({ data, loading, error }) => {
            if (error) {
              captureFilteredError(error)
              return <Statement content='Oops! Something went wrong' />
            }
            if (loading) return <LoadingSpinner />

            if (data && data.fetchDraftGoalsForUser !== null) {
              const draftGoals = data.fetchDraftGoalsForUser

              if (draftGoals.length > 0) {
                return (
                  <div>
                    {reviewHeadingVisible && (
                      <div className='goal-review__heading'>
                        <i
                          className='goal-review__back__button icon icon-small-right icon-rotate-180'
                          onClick={e => {
                            e.preventDefault()
                            history.goBack()
                          }}
                        />
                        <div className='goal-review__heading-info'>
                          <h1>{firstName || 'Employee'}'s goals</h1>
                        </div>
                      </div>
                    )}
                    <GoalList
                      goals={draftGoals}
                      userId={userId}
                      firstName={firstName}
                      history={history}
                      toggleReviewHeading={() =>
                        setReviewHeading(!reviewHeadingVisible)
                      }
                      currentUser={currentUser}
                    />
                    <style jsx>{goalReviewStyle}</style>
                  </div>
                )
              } else return <Redirect to={{ pathname: '/goals?tab=team' }} />
            }
            return <Redirect to={{ pathname: '/error-page/404' }} />
          }}
        </Query>
      )
    }
  }
)
