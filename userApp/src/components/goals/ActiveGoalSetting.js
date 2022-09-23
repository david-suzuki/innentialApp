import React, { useState, useEffect } from 'react'
import { ListSkillSelector, GoalItem } from '../ui-components'
import { Button, Loading, Notification } from 'element-react'
// import goalItemStyle from '../../styles/goalItemStyle'
import activeGoalItemStyle from '../../styles/activeGoalItemStyle'
// import { LoadingSpinner } from '../../general'
import { DevelopmentPlanSetting } from '../development-plans'
import { GoalItemEdit } from './goal-review-components/components'
import { useMutation, useQuery } from 'react-apollo'
import {
  createLearningGoal,
  fetchUserGoals,
  fetchUserDevelopmentPlan,
  fetchLearningContent
} from '../../api'
import { useHistory, useLocation } from 'react-router-dom'
import { LoadingSpinner } from '../general'
// import { DraftGoalSelector } from '../'

const ActiveGoalSetting = ({
  // onGoalSet,
  // toggleReviewHeading,
  currentUser,
  item
}) => {
  const history = useHistory()

  const initialSkills =
    item?.relatedPrimarySkills.map(({ _id, name }) => ({
      _id: _id.split(':')[1],
      name
    })) || []

  const generateNameForSkills = (skills = []) =>
    skills.length > 0
      ? `Learn about ${skills
          .slice(0, 3)
          .map(({ name }, i, { length }) => {
            if (i === 0) return name
            if (i < length - 1) return `, ${name}`
            if (i === length - 1 && skills.length < 4) return ` and ${name}`
            return `, ${name} and others`
          })
          .join('')}`
      : ''

  const [goal, setGoal] = useState({
    goalName: generateNameForSkills(initialSkills),
    relatedSkills: initialSkills,
    measures: {},
    developmentPlan: {
      content: item ? [item] : [],
      mentors: []
    }
  })

  const [goalNameUpdated, setGoalNameUpdated] = useState(false)

  // useEffect(() => {
  //   let timeout
  //   if(!loading && data?.fetchLearningContent) {
  //     const item = data.fetchLearningContent
  //     setRelatedSkills(item.relatedPrimarySkills.map(({ _id, name }) => ({ _id: _id.split(':')[1], name })))
  //     timeout = setTimeout(() => setPlanForGoal([item], []), 50)
  //   }
  //   return () => clearTimeout(timeout)
  // }, [data, loading])

  // const [settingDevelopmentPlan, setDevelopmentPlan] = useState(false)

  // const selectorRef = useRef()

  const [mutation] = useMutation(createLearningGoal, {
    update: (cache, { data: { createLearningGoal: newGoal } }) => {
      try {
        const { fetchUserGoals: goals } = cache.readQuery({
          query: fetchUserGoals
        })
        cache.writeQuery({
          query: fetchUserGoals,
          data: {
            fetchUserGoals: [newGoal, ...goals]
          }
        })
      } catch (e) {}
      try {
        const { fetchUserDevelopmentPlan: dp } = cache.readQuery({
          query: fetchUserDevelopmentPlan
        })
        cache.writeQuery({
          query: fetchUserDevelopmentPlan,
          data: {
            fetchUserDevelopmentPlan: {
              ...dp,
              selectedGoalId: newGoal._id
            }
          }
        })
      } catch (e) {}
    }
  })

  const addNewMeasure = () => {
    setGoal({
      ...goal,
      measures: {
        ...goal.measures,
        [Object.keys(goal.measures).length]: ''
      }
    })
  }

  const deleteMeasure = (_, measureIndex) => {
    delete goal.measures[measureIndex]
    setGoal({ ...goal })
  }

  const onChangeName = (_, value) => {
    setGoal({
      ...goal,
      goalName: value
    })
    setGoalNameUpdated(true)
  }

  const onChangeMeasure = (_, measureIndex, value) => {
    setGoal({
      ...goal,
      measures: {
        ...goal.measures,
        [measureIndex]: value
      }
    })
  }

  const setRelatedSkills = skills => {
    setGoal({
      ...goal,
      ...(!goalNameUpdated && {
        goalName: generateNameForSkills(skills)
      }),
      relatedSkills: skills.map(({ _id, name }) => ({ _id, name }))
    })
  }

  const setPlanForGoal = (content, mentors) => {
    setGoal({
      ...goal,
      developmentPlan: {
        content,
        mentors
      }
    })
  }

  // const setActiveDialog = () => {
  //   selectorRef.current && selectorRef.current.toggleVisibility()
  // }

  const onSubmit = (nextGoals, result) => {
    setGoal({
      goalName: '',
      relatedSkills: [],
      measures: {},
      developmentPlan: {
        content: [],
        mentors: []
      }
    })
    // setDevelopmentPlan(false)
    history.push('/')
    // onGoalSet(nextGoals, result)
  }

  // DEVELOPMENT PLAN METHODS

  // const toggleSettingDevelopmentPlan = () => {
  //   setDevelopmentPlan(!settingDevelopmentPlan)
  //   // toggleReviewHeading()
  // }

  const {
    goalName,
    relatedSkills,
    developmentPlan: { content, mentors },
    measures
  } = goal

  const measureArray = Object.values(measures)

  const selectorProps = {
    skills: relatedSkills,
    onSkillsSubmit: setRelatedSkills,
    clearState: true,
    buttonValue: relatedSkills.length > 0 ? 'Change' : 'Click to choose',
    buttonClass:
      relatedSkills.length > 0
        ? 'list-skill-selector__button-input--selected'
        : 'list-skill-selector__button-input',
    neededSkillsSelector: true
  }

  // if (settingDevelopmentPlan) {
  return (
    <div className='goal__wrapper' style={{ marginTop: '70px' }}>
      <DevelopmentPlanSetting
        onBackButtonClick={history.goBack}
        selectedContent={content}
        selectedMentors={mentors}
        neededSkills={relatedSkills}
        isOnGoalSetting
        setPlanForGoal={setPlanForGoal}
        user={currentUser._id}
        currentUser={currentUser}
        status='ACTIVE'
        saveButton
        handleSavePlan={() => {
          if (relatedSkills.length === 0) {
            Notification({
              type: 'warning',
              message: 'You must select a skill',
              duration: 2500,
              offset: 90
            })
            return
          }
          if (content.length === 0) {
            Notification({
              type: 'warning',
              message: 'You must select a learning item',
              duration: 2500,
              offset: 90
            })
            return
          }
          if (goalName.length === 0) {
            Notification({
              type: 'warning',
              message: 'Please name the path',
              duration: 2500,
              offset: 90
            })
            return
          }
          mutation({
            variables: {
              goal: {
                goalName,
                goalType: 'PERSONAL',
                relatedSkills: relatedSkills.map(skill => skill._id),
                measures: measureArray,
                developmentPlan: {
                  content: content.map(
                    ({
                      _id: contentId,
                      type: contentType,
                      price: { value: price },
                      availableWithSubscription: subscriptionAvailable
                    }) => ({
                      contentId,
                      contentType,
                      price,
                      subscriptionAvailable
                    })
                  ),
                  mentors: mentors.map(({ _id: mentorId }) => ({
                    mentorId
                  }))
                }
              }
            }
          })
            .then(({ data: { createLearningGoal: result } }) => {
              if (result !== null) {
                Notification({
                  type: 'success',
                  message: `You can now begin working on your new learning path!`,
                  duration: 2500,
                  offset: 90
                })
                onSubmit()
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
      >
        <GoalItemEdit
          goalIndex={1}
          {...goal}
          measures={measureArray}
          // removeGoal={this.removeGoal}
          addNewMeasure={addNewMeasure}
          deleteMeasure={deleteMeasure}
          onChangeName={onChangeName}
          onChangeMeasure={onChangeMeasure}
          selectorProps={selectorProps}
          initialGoalNo={0}
          total={1}
          hideMeasures
        />
        <style jsx>{activeGoalItemStyle}</style>
      </DevelopmentPlanSetting>
    </div>
  )

  /*

      <Button
        type='primary'
        size='large'
        loading={loading}
        disabled={content.length === 0}
        onClick={() => {
          // e.preventDefault()
          mutation({
            variables: {
              goal: {
                goalName,
                goalType: 'PERSONAL',
                relatedSkills: relatedSkills.map(skill => skill._id),
                measures: measureArray,
                developmentPlan: {
                  content: content.map(
                    ({
                      _id: contentId,
                      type: contentType,
                      price: { value: price }
                    }) => ({
                      contentId,
                      contentType,
                      price
                    })
                  ),
                  mentors: mentors.map(({ _id: mentorId }) => ({
                    mentorId
                  }))
                }
              }
            }
          })
            .then(({ data: { createLearningGoal: result } }) => {
              if (result !== null) {
                Notification({
                  type: 'success',
                  message: `You can now begin working on your new learning goal!`,
                  duration: 2500,
                  offset: 90
                })
                onSubmit()
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
      >
        Create goal
      </Button>
  */

  // } else {
  //   return (
  //     <>
  //       <div className='page-heading'>
  //         <i
  //           className='page-heading__back__button icon icon-small-right icon-rotate-180'
  //           onClick={() => {
  //             history.goBack()
  //           }}
  //         />
  //         <div className='page-heading-info'>
  //           <h1>New learning goal</h1>
  //         </div>
  //       </div>
  //       {/* <ListSkillSelector
  //         skills={relatedSkills}
  //         forwardRef={selectorRef}
  //         onSkillsSubmit={selected =>
  //           setRelatedSkills(selected)
  //         }
  //         hideLoading
  //         clearState
  //       /> */}
  //       {/* <SubmitButton
  //         user={user}
  //         reviewId={reviewId}
  //         previousReviewId={previousReviewId}
  //         goalsArray={goalsArray}
  //         onSubmit={this.onSubmit}
  //       /> */}
  //     </>
  //   )
  // }
}

export default props => {
  const { state } = useLocation()

  const contentId = state?.contentId

  const { data, loading } = useQuery(fetchLearningContent, {
    variables: {
      learningContentId: contentId
    },
    fetchPolicy: 'cache-and-network'
  })

  if (loading) return <LoadingSpinner />

  return <ActiveGoalSetting item={data?.fetchLearningContent} {...props} />
}
