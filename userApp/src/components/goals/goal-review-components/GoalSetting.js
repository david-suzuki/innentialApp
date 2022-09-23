import React, { Component } from 'react'
import { ListSkillSelector, GoalItem } from '../../ui-components'
import { Input, Button, Icon, MessageBox } from 'element-react'
import goalItemStyle from '../../../styles/goalItemStyle'
// import { LoadingSpinner } from '../../general'
import { DevelopmentPlanSetting } from '../../development-plans'
import { SubmitButton, GoalItemEdit } from './components'
import { DraftGoalSelector } from '../'

export default class GoalSetting extends Component {
  constructor(props) {
    super(props)

    const { total = 0 } = props

    // I know this looks weird, but, essentially,
    // intialize array of goal objects and then turn it into an enumerable object
    const goalArray = new Array(total).fill().map(() => {
      return {
        goalName: '',
        relatedSkills: [],
        measures: {},
        developmentPlan: {
          content: [],
          mentors: []
        }
      }
    })
    const goals = Object.assign(goalArray, {})

    this.state = {
      goals,
      total,
      initialGoalNo: total,
      skills: [],
      settingDevelopmentPlan: false
    }
  }

  selectorRef = React.createRef()

  addNewGoal = () => {
    this.setState(({ goals, total }) => ({
      goals: {
        [total]: {
          goalName: '',
          relatedSkills: [],
          measures: {},
          developmentPlan: {
            content: [],
            mentors: []
          }
        },
        ...goals
      },
      total: total + 1
    }))
  }

  removeGoal = goalIndex => {
    this.setState(({ goals, total }) => {
      delete goals[goalIndex]
      return {
        goals,
        total: total - 1
      }
    })
  }

  setRelatedSkills = (goalIndex, skills) => {
    this.setState(({ goals }) => ({
      goals: {
        ...goals,
        [goalIndex]: {
          ...goals[goalIndex],
          relatedSkills: skills.map(({ _id, name }) => ({ _id, name }))
        }
      }
    }))
  }

  addNewMeasure = goalIndex => {
    this.setState(({ goals }) => ({
      goals: {
        ...goals,
        [goalIndex]: {
          ...goals[goalIndex],
          measures: {
            ...goals[goalIndex].measures,
            [Object.keys(goals[goalIndex].measures).length]: ''
          }
        }
      }
    }))
  }

  deleteMeasure = (goalIndex, measureIndex) => {
    this.setState(({ goals }) => {
      delete goals[goalIndex].measures[measureIndex]
      return {
        goals: {
          ...goals,
          [goalIndex]: {
            ...goals[goalIndex]
          }
        }
      }
    })
  }

  onChangeName = (goalIndex, value) => {
    this.setState(({ goals }) => ({
      goals: {
        ...goals,
        [goalIndex]: {
          ...goals[goalIndex],
          goalName: value
        }
      }
    }))
  }

  onChangeMeasure = (goalIndex, measureIndex, value) => {
    this.setState(({ goals }) => ({
      goals: {
        ...goals,
        [goalIndex]: {
          ...goals[goalIndex],
          measures: {
            ...goals[goalIndex].measures,
            [measureIndex]: value
          }
        }
      }
    }))
  }

  setActiveDialog = (activeGoalIndex, skills) => {
    if (this.selectorRef.current) this.selectorRef.current.toggleVisibility()
    this.setState({
      activeGoalIndex,
      skills
    })
  }

  onSubmit = (nextGoals, result) => {
    this.setState({
      goals: {},
      total: 0,
      skills: []
    })
    this.props.onGoalSet(nextGoals, result)
  }

  // DEVELOPMENT PLAN METHODS

  toggleSettingDevelopmentPlan = goalIndex => {
    this.setState(({ settingDevelopmentPlan: value }) => ({
      settingDevelopmentPlan: !value,
      activeGoalIndex: goalIndex
    }))
    this.props.toggleReviewHeading()
  }

  setPlanForGoal = (content, mentors) => {
    this.setState(({ activeGoalIndex, goals }) => ({
      goals: {
        ...goals,
        [activeGoalIndex]: {
          ...goals[activeGoalIndex],
          developmentPlan: {
            mentors,
            content
          }
        }
      }
    }))
  }

  addDraftToReview = ({
    measures,
    developmentPlan: { content, mentors },
    relatedSkills,
    ...draft
  }) => {
    this.setState(({ goals, total }) => ({
      goals: {
        [total]: {
          ...draft,
          relatedSkills: relatedSkills.map(({ _id, name }) => ({ _id, name })),
          measures: Object.assign(
            measures.map(({ measureName }) => measureName),
            {}
          ),
          developmentPlan: {
            content: content.map(({ content }) => content),
            mentors
          }
        },
        ...goals
      },
      total: total + 1
    }))
  }

  render() {
    const {
      goals,
      total,
      skills,
      activeGoalIndex,
      settingDevelopmentPlan,
      initialGoalNo
    } = this.state
    const {
      reviewId,
      previousReviewId,
      userId: user,
      currentUser,
      active
    } = this.props

    const goalsArray = Object.entries(goals)

    if (settingDevelopmentPlan) {
      const {
        goalName,
        relatedSkills,
        measures,
        developmentPlan: { content, mentors }
      } = goals[activeGoalIndex]
      const measureArray = Object.entries(measures).map(
        ([measureKey, measureName]) => ({
          measureName,
          completed: false
        })
      )
      return (
        <DevelopmentPlanSetting
          onBackButtonClick={this.toggleSettingDevelopmentPlan}
          selectedContent={content}
          selectedMentors={mentors}
          neededSkills={relatedSkills}
          isOnGoalSetting
          setPlanForGoal={this.setPlanForGoal}
          user={user}
          currentUser={currentUser}
          status='ACTIVE'
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
          {/* <ListSkillSelector
            skills={skills}
            forwardRef={this.selectorRef}
            onSkillsSubmit={selected =>
              this.setRelatedSkills(activeGoalIndex, selected)
            }
            hideLoading
            clearState
          /> */}
          {reviewId && (
            <DraftGoalSelector
              goals={goalsArray}
              user={user}
              addDraftToReview={this.addDraftToReview}
            />
          )}
          {total > 0 ? (
            <>
              <div className='goal-setting__heading'>
                <div className='goal-setting__heading-text'>
                  {reviewId
                    ? 'Your goals for the next milestone '
                    : 'Your proposed goals '}
                  <span className='goal-setting__heading-number'>{total}</span>
                </div>
                <Button
                  className='el-button el-button--green'
                  onClick={this.addNewGoal}
                >
                  Set another goal
                  <i className='icon icon-add' />
                </Button>
              </div>
              {goalsArray
                .map(([key, value], i) => {
                  const measureArray = Object.entries(value.measures).map(
                    ([key, value]) => value
                  )
                  const selectorProps = {
                    skills: value.relatedSkills,
                    onSkillsSubmit: selected =>
                      this.setRelatedSkills(i, selected),
                    clearState: true,
                    buttonValue: 'Find skills...',
                    buttonClass: 'list-skill-selector__button-input',
                    neededSkillsSelector: true
                  }
                  return (
                    <GoalItemEdit
                      key={`goal.${key}`}
                      goalIndex={i}
                      {...value}
                      measures={measureArray}
                      removeGoal={this.removeGoal}
                      addNewMeasure={this.addNewMeasure}
                      deleteMeasure={this.deleteMeasure}
                      onChangeName={this.onChangeName}
                      onChangeMeasure={this.onChangeMeasure}
                      // setActiveDialog={this.setActiveDialog}
                      selectorProps={selectorProps}
                      onDevelopmentPlanClick={this.toggleSettingDevelopmentPlan}
                      initialGoalNo={initialGoalNo}
                      total={total}
                      active={active}
                      hideMeasures={!reviewId}
                    />
                  )
                })
                .reverse()}
              <SubmitButton
                user={user}
                reviewId={reviewId}
                previousReviewId={previousReviewId}
                goalsArray={goalsArray}
                onSubmit={this.onSubmit}
              />
            </>
          ) : (
            <>
              <div className='goal-setting__next-text'>
                What are your goals for the next milestone?
              </div>
              <Button
                type='primary'
                onClick={this.addNewGoal}
                className='el-button el-button--green'
              >
                Set new goal <Icon style={{ marginLeft: '5px' }} name='plus' />
              </Button>
            </>
          )}
          <style jsx>{goalItemStyle}</style>
        </>
      )
    }
  }
}
