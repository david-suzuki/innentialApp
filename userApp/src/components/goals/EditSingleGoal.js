import React, { Component } from 'react'
import { withRouter, Redirect } from 'react-router-dom'
import { ListSkillSelector } from '../ui-components'
import { Query, Mutation } from 'react-apollo'
import { fetchSingleGoal, updateGoal } from '../../api'
import { captureFilteredError, LoadingSpinner } from '../general'
import history from '../../history'
import goalReviewStyle from '../../styles/goalReviewStyle'
import { Input, Button, Notification } from 'element-react'
import goalItemStyle from '../../styles/goalItemStyle'
import { removeTypename } from '../user-onboarding/utilities'

export class SingleGoalForm extends Component {
  constructor(props) {
    super(props)

    const { goalName, relatedSkills, measures } = props

    this.state = {
      goalName,
      relatedSkills,
      measures
    }
  }

  selectorRef = React.createRef()

  onChangeName = value => {
    this.setState({ goalName: value })
  }

  onChangeMeasure = (value, i) => {
    this.setState(({ measures }) => ({
      measures: measures.map((measure, ix) => {
        if (ix === i) {
          return {
            ...measure,
            measureName: value
          }
        } else return measure
      })
    }))
  }

  addNewMeasure = () => {
    this.setState(({ measures }) => ({
      measures: [...measures, { measureName: '' }]
    }))
  }

  deleteMeasure = i => {
    this.setState(({ measures }) => ({
      measures: measures.filter((measure, ix) => ix !== i)
    }))
  }

  setActiveDialog = () => {
    this.selectorRef.current.toggleVisibility()
  }

  setRelatedSkills = skills => {
    this.setState({ relatedSkills: skills })
  }

  render() {
    const { goalName, relatedSkills, measures } = this.state

    return (
      <>
        <ListSkillSelector
          skills={relatedSkills}
          forwardRef={this.selectorRef}
          onSkillsSubmit={selected => this.setRelatedSkills(selected)}
          hideLoading
          clearState
          neededSkillsSelector
        />
        <div className='list-item goal-item'>
          <div className='goal-item__name-wrapper'>
            <div className='goal-item__name'>
              <Input
                value={goalName}
                onChange={value => this.onChangeName(value)}
                placeholder='Set new goal'
              />
            </div>
            <div className='goal-item__completion'>
              <p className='goal-item__completion--numbers'>
                <span>{measures.length}</span>
              </p>
              <p className='goal-item__completion-text'>success measures</p>
            </div>
          </div>
          <div className='goal-item__skills-wrapper'>
            <p>Related skills</p>
            <div className='goal-item__skills'>
              {relatedSkills.map((skill, i) => (
                <span key={`skilltag:${i}`} className='goal-item__skill-tag'>
                  {skill.name}
                </span>
              ))}
            </div>
            <a
              onClick={() => this.setActiveDialog()}
              className='goal-item__add-button'
            >
              + Add skill
            </a>
          </div>
          <div className='goal-item__measures-wrapper'>
            <p>Success measures</p>
            {measures.map(({ measureName }, i) => (
              <Input
                key={`measureinput:${i}`}
                value={measureName}
                onChange={value => this.onChangeMeasure(value, i)}
                icon='delete'
                onIconClick={() => this.deleteMeasure(i)}
                placeholder='Input...'
              />
            ))}
            <a
              onClick={() => this.addNewMeasure()}
              className='goal-item__add-button'
            >
              + Add new
            </a>
          </div>
        </div>
        <Mutation
          mutation={updateGoal}
          refetchQueries={['fetchUserGoals', 'fetchUsersGoals']}
        >
          {(mutation, { loading }) => (
            <Button
              type='primary'
              loading={loading}
              onClick={() => {
                if (
                  goalName.length === 0 ||
                  !measures.every(({ measureName }) => measureName.length > 0)
                ) {
                  Notification({
                    type: 'warning',
                    message:
                      'Please provide all the goal and measure descriptions!',
                    duration: 2500,
                    offset: 90
                  })
                } else {
                  const inputData = {
                    _id: this.props._id,
                    goalName,
                    goalType: 'PERSONAL',
                    relatedSkills: relatedSkills.map(skill => skill._id),
                    measures: removeTypename(measures)
                  }

                  mutation({
                    variables: {
                      inputData
                    }
                  })
                    .then(({ data: { updateGoal: result } }) => {
                      if (result !== null) {
                        Notification({
                          type: 'success',
                          message: 'Goal successfully updated.',
                          duration: 2500,
                          offset: 90
                        })
                        history.push('/goals')
                      } else {
                        Notification({
                          type: 'warning',
                          message: 'Oops, something went wrong!',
                          duration: 2500,
                          offset: 90
                        })
                      }
                    })
                    .catch(e => {
                      captureFilteredError(e)
                      Notification({
                        type: 'warning',
                        message: 'Oops, something went wrong!',
                        duration: 2500,
                        offset: 90
                      })
                    })
                }
              }}
            >
              Save changes
            </Button>
          )}
        </Mutation>
        <style jsx>{goalItemStyle}</style>
      </>
    )
  }
}

export default withRouter(({ match: { params } }) => {
  const { goalId } = params
  if (!goalId) {
    return <Redirect to='/goals' />
  } else {
    return (
      <Query query={fetchSingleGoal} variables={{ goalId }}>
        {({ data, loading, error }) => {
          if (error) {
            captureFilteredError(error)
            return <Redirect to='/error-page/500' />
          }
          if (loading) return <LoadingSpinner />

          if (data && data.fetchSingleGoal !== null) {
            const goal = data.fetchSingleGoal

            return (
              <>
                <div
                  className='goal-review__heading'
                  style={{ marginBottom: '20px' }}
                >
                  <i
                    className='goal-review__back__button icon icon-small-right icon-rotate-180'
                    onClick={e => {
                      e.preventDefault()
                      history.push('/goals')
                    }}
                  />
                  <div className='goal-review__heading-info'>
                    <h1>Edit goal</h1>
                    {/* <div className="goal-review__date">{fullName}</div> */}
                  </div>
                </div>
                <SingleGoalForm {...goal} />
                <style jsx>{goalReviewStyle}</style>
              </>
            )
          }
          return <Redirect to={{ pathname: '/error-page/404' }} />
        }}
      </Query>
    )
  }
})
