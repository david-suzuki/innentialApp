import React, { Component } from 'react'
import {
  Carousel,
  GoalItem,
  BodyPortal,
  StarBar,
  ListSkillSelector,
  TextEditor,
  SuccessRatePicker
} from '../../ui-components'
import { Input, Button, Notification, Dialog, Slider } from 'element-react'
import { Query, Mutation, useMutation } from 'react-apollo'
import {
  fetchOrganizationSpecificSkills,
  reviewGoals,
  reviewFeedback
  // fetchUserGoalInfoForReview
} from '../../../api'
import { LoadingSpinner, captureFilteredError } from '../../general'
import 'element-theme-chalk/lib/slider.css'
import listStyleSelectorStyle from '../../../styles/listStyleSelectorStyle'
import Container from '../../../globalState'
import { removeTypename } from '../../user-profile/utilities'
import List from '../../ui-components/List'

const GoalSubmitButton = ({ reviewId, user, goals, onGoalsReviewed }) => {
  const [mutate, { loading }] = useMutation(reviewGoals, {
    refetchQueries: [
      'fetchUserGoals',
      'fetchEvaluationInfo',
      'fetchLatestTeamEvaluation',
      'fetchOrganizationEvaluationToo',
      'fetchStatsTeamsData',
      'fetchStatsOverviewData',
      'fetchUsersProfile'
    ]
  })

  return (
    <Button
      type='primary'
      size='large'
      onClick={e => {
        e.preventDefault()
        const inputData = {
          user,
          reviewId,
          goals: removeTypename(
            Object.entries(goals).map(([key, value]) => {
              const {
                _id,
                measures,
                goalName,
                goalType,
                relatedSkills: skills,
                feedback
              } = value
              return {
                _id,
                goalName,
                goalType,
                measures: removeTypename(measures),
                skills: removeTypename(
                  skills.map(skill => ({
                    skillId: skill._id,
                    level: skill.level,
                    related: skill.related !== false
                  }))
                ),
                feedback
              }
            })
          )
        }
        mutate({
          variables: {
            inputData
          }
        })
          .then(({ data: { reviewGoals } }) => {
            if (reviewGoals) {
              Notification({
                type: 'success',
                message: 'Goal results successfully saved!',
                duration: 2500,
                offset: 90
              })
              onGoalsReviewed()
            } else {
              Notification({
                type: 'warning',
                message: 'Oops, something went wrong!',
                duration: 2500,
                offset: 90
              })
            }
          })
          .catch(() => {
            Notification({
              type: 'warning',
              message: 'Oops, something went wrong!',
              duration: 2500,
              offset: 90
            })
          })
      }}
      loading={loading}
    >
      Finish
    </Button>
  )
}

const FeedbackSubmitButton = ({
  reviewId,
  user,
  skills = [],
  feedback,
  onGoalsReviewed
}) => {
  const [mutate, { loading }] = useMutation(reviewFeedback, {
    refetchQueries: [
      'fetchUserGoals',
      'fetchEvaluationInfo',
      'fetchLatestTeamEvaluation',
      'fetchOrganizationEvaluationToo',
      'fetchStatsTeamsData',
      'fetchStatsOverviewData',
      'fetchUsersProfile'
    ]
  })

  return (
    <Button
      type='primary'
      size='large'
      onClick={e => {
        e.preventDefault()
        const inputData = {
          user,
          reviewId,
          skills: removeTypename(
            skills.map(skill => ({
              skillId: skill._id,
              level: skill.level,
              related: true
            }))
          ),
          feedback
        }
        mutate({
          variables: {
            inputData
          }
        })
          .then(({ data: { reviewFeedback: result } }) => {
            if (result) {
              Notification({
                type: 'success',
                message: 'Feedback saved!',
                duration: 2500,
                offset: 90
              })
              onGoalsReviewed()
            } else {
              Notification({
                type: 'warning',
                message: 'Oops, something went wrong!',
                duration: 2500,
                offset: 90
              })
            }
          })
          .catch(() => {
            Notification({
              type: 'warning',
              message: 'Oops, something went wrong!',
              duration: 2500,
              offset: 90
            })
          })
      }}
      loading={loading}
    >
      Submit feedback
    </Button>
  )
}

// GLOBAL STATE COMPONENT FOR SKILLS FRAMEWORK

const HandleGlobalState = ({ children }) => {
  const { setFrameworkState } = Container.useContainer()
  return children(setFrameworkState)
}

// COMPONENTS FOR GOAL REVIEW FORM

// const SuccessRatePicker = ({
//   sliderValue,
//   setSliderValue,
//   dialogVisible,
//   setDialogVisible,
//   setMeasureSuccessLevel
// }) => {
//   return (
//     <BodyPortal>
//       <Dialog
//         onCancel={() => setDialogVisible(false)}
//         visible={dialogVisible}
//         className="el-dialog--success-rate"
//       >
//         <Dialog.Body className="el-dialog__body--success-rate">
//           <p>Set measure success level</p>
//           <Slider
//             value={sliderValue}
//             onChange={value => setSliderValue(value)}
//           />
//         </Dialog.Body>
//         <Dialog.Footer className="el-dialog__footer--success-rate">
//           <Button
//             type="primary"
//             onClick={() => {
//               setMeasureSuccessLevel(sliderValue)
//               setDialogVisible(false)
//             }}
//           >
//             Save
//           </Button>
//         </Dialog.Footer>
//       </Dialog>
//     </BodyPortal>
//   )
// }

const GoalReviewActionItem = ({
  _id,
  name,
  frameworkId,
  level,
  onRate,
  setFramework
}) => {
  return (
    <List>
      <div className='list-item action-item goal-review-action-item-wrapper'>
        <div className='intro-block goal-review-rating'>
          <div className='block'>
            {/* <span className="demonstration goal-review-action-item-heading">
              {name}
            </span> */}
            <span className='wrapper'>
              <StarBar
                level={level}
                name={name}
                updateSkillLevels={(skillName, value) => onRate(_id, value)}
                handleHover={(value, skillName) => {
                  if (frameworkId) {
                    setFramework(frameworkId, value, skillName)
                  } else {
                    setFramework('no_framework', 0, skillName)
                  }
                }}
                handleMouseOut={() => setFramework('no_framework', 0, '')}
              />{' '}
            </span>
          </div>
        </div>
      </div>
    </List>
  )
}

class GoalsReviewPage extends Component {
  constructor(props) {
    super(props)

    const { goals } = props

    this.state = {
      total: goals.length,
      onlyFeedback: goals.length === 0,
      activeGoal: 0,
      goals: Object.assign({}, goals), // GOALS ARE OBJECTIFIED FOR EASIER STATE MANAGEMENT WITH SUCH A COMPLICATED STRUCTURE
      dialogVisible: false,
      activeMeasureId: '',
      sliderValue: 0,
      debouncing: false, // GETTING RID OF ELEMENT-REACT INTERNAL STATE SHENANIGANS (OVERWRITING MY OWN VALUES)
      feedback: '',
      skills: []
    }
  }

  // GOAL FORM METHODS

  setMeasureSuccessLevel = value => {
    this.setState(
      ({ activeGoal, goals, activeMeasureId }) => ({
        goals: {
          ...goals,
          [activeGoal]: {
            ...goals[activeGoal],
            measures: goals[activeGoal].measures.map(measure => {
              if (measure._id === activeMeasureId) {
                return {
                  ...measure,
                  completed: true,
                  successRate: value
                }
              } else return measure
            })
          }
        },
        activeMeasureId: '',
        sliderValue: 0,
        debouncing: true
      }),
      () =>
        setTimeout(
          () =>
            this.setState({
              debouncing: false
            }),
          100
        )
    )
  }

  setSkillFeedbackLevel = (skillId, level) => {
    this.setState(({ activeGoal, goals, onlyFeedback, skills }) => {
      if (!onlyFeedback) {
        return {
          goals: {
            ...goals,
            [activeGoal]: {
              ...goals[activeGoal],
              relatedSkills: goals[activeGoal].relatedSkills.map(skill => {
                if (skill._id === skillId) {
                  return {
                    ...skill,
                    level
                  }
                } else return skill
              })
            }
          }
        }
      } else {
        return {
          skills: skills.map(skill => {
            if (skill._id === skillId) {
              return {
                ...skill,
                level
              }
            } else return skill
          })
        }
      }
    })
  }

  changeFeedback = value => {
    this.setState(({ activeGoal, goals, onlyFeedback }) => {
      if (!onlyFeedback) {
        return {
          goals: {
            ...goals,
            [activeGoal]: {
              ...goals[activeGoal],
              feedback: value
            }
          }
        }
      } else {
        return {
          feedback: value
        }
      }
    })
  }

  setCurrentGoal = nextGoal => {
    this.setState({
      activeGoal: nextGoal,
      dialogVisible: false,
      activeMeasureId: '',
      sliderValue: 0
    })
    this.props.setFrameworkState({ visible: false })
  }

  setDialogVisible = value => {
    this.setState({ dialogVisible: value })
  }

  setActiveMeasure = (measureId, successRate) => {
    this.setState(
      {
        activeMeasureId: measureId,
        dialogVisible: true,
        sliderValue: successRate !== null ? successRate : 0,
        debouncing: true
      },
      () =>
        setTimeout(
          () =>
            this.setState({
              debouncing: false
            }),
          100
        )
    )
  }

  setSliderValue = value => {
    if (!this.state.debouncing) {
      this.setState({ sliderValue: value })
    }
  }

  // setSkillSearch = (e, value) => {
  //   if (value === undefined) {
  //     captureFilteredError(`Undefined value in autosuggest component`)
  //   } else {
  //     const { newValue } = value
  //     this.setState({
  //       skillSearch: newValue
  //     })
  //   }
  // }

  onSkillsSubmit = (newSkills = []) => {
    this.setState(({ activeGoal, goals, onlyFeedback }) => {
      const skills = newSkills.map(({ _id, skillId, name, frameworkId }) => ({
        _id: skillId || _id,
        name,
        level: 0,
        frameworkId,
        related: false
      }))
      if (!onlyFeedback) {
        return {
          goals: {
            ...goals,
            [activeGoal]: {
              ...goals[activeGoal],
              relatedSkills: [...goals[activeGoal].relatedSkills, ...skills]
            }
          }
        }
      } else {
        return {
          skills
        }
      }
    })
  }

  setFramework = (id, level, name) => {
    this.props.setFrameworkState({
      visible: true,
      frameworkId: id,
      level,
      skillName: name
    })
    // this.setState({
    //   shouldSeeFramework: true,
    //   selectedFrameworkId: id,
    //   selectedLevel: level,
    //   selectedName: name
    // })
  }

  componentDidMount = () => {
    const mainWrapper = document.getElementById('main-wrapper')
    mainWrapper.className = 'container-main__wrapper wrapper--right'
  }

  componentWillUnmount = () => {
    this.props.setFrameworkState({ visible: false })

    const mainWrapper = document.getElementById('main-wrapper')
    mainWrapper.className = 'container-main__wrapper'
  }

  render() {
    const {
      total,
      goals,
      activeGoal,
      dialogVisible,
      sliderValue,
      onlyFeedback
    } = this.state
    const { onGoalsReviewed, userId: user, reviewId, userName } = this.props

    let skills = []
    let feedback = ''

    const currentGoal = goals[activeGoal]

    if (currentGoal) {
      skills = currentGoal.relatedSkills
      feedback = currentGoal.feedback
    } else {
      skills = this.state.skills
      feedback = this.state.feedback
    }

    const selectorProps = {
      buttonValue: 'Find skills...',
      buttonClass: 'list-skill-selector__button-input',
      skills: [],
      onSkillsSubmit: this.onSkillsSubmit,
      filterSkills: skills,
      clearState: true
    }

    return (
      <div className='goal-review-wrapper'>
        {!onlyFeedback && (
          <>
            <SuccessRatePicker
              sliderValue={sliderValue}
              setSliderValue={this.setSliderValue}
              dialogVisible={dialogVisible}
              setDialogVisible={this.setDialogVisible}
              setMeasureSuccessLevel={this.setMeasureSuccessLevel}
            />
            <div className='goal-review__goal-item'>
              <GoalItem
                {...currentGoal}
                onMeasureClick={this.setActiveMeasure}
                inReview
              />
            </div>
          </>
        )}
        {skills.length > 0 && (
          <>
            <div className='goal-review__skills-feedback'>Skills feedback</div>
            <Carousel
              animation='zoom'
              rightArrow={({ nextSlide }) => (
                <i
                  className='goal-review__back__button icon icon-small-right'
                  style={{
                    position: 'relative',
                    top: '40px',
                    left: '15px',
                    backgroundColor: 'white'
                  }}
                  onClick={nextSlide}
                />
              )}
              leftArrow={({ previousSlide }) => (
                <i
                  className='goal-review__back__button icon icon-small-right icon-rotate-180'
                  style={{
                    position: 'relative',
                    top: '40px',
                    right: '15px',
                    backgroundColor: 'white'
                  }}
                  onClick={previousSlide}
                />
              )}
              renderBottomControls={null}
            >
              {skills.map(skill => {
                return (
                  <GoalReviewActionItem
                    key={skill._id}
                    {...skill}
                    onRate={this.setSkillFeedbackLevel}
                    frameworkId={skill.frameworkId}
                    setFramework={this.setFramework}
                  />
                )
              })}
            </Carousel>
          </>
        )}
        <div className='goal-review__skill-select-label'>
          What {skills.length > 0 ? 'other ' : ''}skills would you like to give
          feedback for?
        </div>
        <ListSkillSelector {...selectorProps} />
        <div className='goal-review__feedback'>
          Give feedback{userName ? ` to ${userName}` : ''}
        </div>
        {/* <div className="goal-review__feedback-label">
          Anything else you want to add to the feedback?
        </div> */}
        <TextEditor
          value={feedback}
          handleChange={value => this.changeFeedback(value)}
        />
        <div className='page-footer'>
          {onlyFeedback ? (
            <FeedbackSubmitButton
              user={user}
              reviewId={reviewId}
              onGoalsReviewed={onGoalsReviewed}
              feedback={feedback}
              skills={skills}
            />
          ) : (
            <>
              {activeGoal !== 0 && (
                <div>
                  <Button
                    onClick={() => this.setCurrentGoal(activeGoal - 1)}
                    type='text'
                    style={{ marginBottom: '10px' }}
                  >
                    Previous goal
                  </Button>
                </div>
              )}
              {activeGoal === total - 1 ? (
                <GoalSubmitButton
                  user={user}
                  reviewId={reviewId}
                  onGoalsReviewed={onGoalsReviewed}
                  goals={goals}
                />
              ) : (
                <Button
                  onClick={() => this.setCurrentGoal(activeGoal + 1)}
                  type='primary'
                  size='large'
                >
                  Next goal
                </Button>
              )}
            </>
          )}
        </div>
        <style jsx>{listStyleSelectorStyle}</style>
      </div>
    )
  }
}

export default props => (
  <HandleGlobalState>
    {setFrameworkState => (
      <Query query={fetchOrganizationSpecificSkills}>
        {({ data, loading, error }) => {
          if (loading) return <LoadingSpinner />
          if (error) {
            captureFilteredError(error)
            return (
              <GoalsReviewPage
                {...props}
                setFrameworkState={setFrameworkState}
                skillData={[]}
              />
            )
          }

          const skillData = data && data.fetchOrganizationSpecificSkills
          if (skillData && skillData.length > 0) {
            return (
              <GoalsReviewPage
                {...props}
                setFrameworkState={setFrameworkState}
                skillData={skillData}
              />
            )
          }
          return (
            <GoalsReviewPage
              {...props}
              setFrameworkState={setFrameworkState}
              skillData={[]}
            />
          )
        }}
      </Query>
    )}
  </HandleGlobalState>
)
