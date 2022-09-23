import React, { Component } from 'react'
import {
  GoalItem,
  GoalItemCompleted,
  List,
  SkillProgression,
  SeparatedContentList,
  Statement
} from '../../ui-components'
import { Button } from 'element-react'
import { Link } from 'react-router-dom'
import developmentPlanStyle from '../../../styles/developmentPlanStyle'
class GoalsSummary extends Component {
  state = {
    goalsVisible: false,
    inDevelopmentPlan: false,
    activeGoalIndex: null
  }

  toggleGoalsVisible = () => {
    this.setState(({ goalsVisible: value }) => ({ goalsVisible: !value }))
  }

  toggleDevelopmentPlan = goalIndex => {
    this.setState(({ inDevelopmentPlan: value }) => ({
      inDevelopmentPlan: !value,
      activeGoalIndex: goalIndex
    }))
  }

  render() {
    const {
      reviewId,
      goals,
      nextGoals,
      reviewWillClose,
      onlySummary,
      skillProgression,
      feedback
    } = this.props
    const { goalsVisible, inDevelopmentPlan, activeGoalIndex } = this.state

    if (inDevelopmentPlan) {
      const activeGoal = nextGoals[activeGoalIndex]
      const { developmentPlan } = activeGoal
      if (developmentPlan !== null) {
        const { content, mentors } = developmentPlan
        return (
          <div>
            <div className='goal-summary__goals-reviewed-header'>
              <h3>Development Plan</h3>
              <Button onClick={this.toggleDevelopmentPlan}>
                Back to summary
              </Button>
            </div>
            <SeparatedContentList
              content={content.map(({ content, ...rest }) => ({
                ...content,
                ...rest
              }))}
              mentors={mentors}
            />
            <style jsx>{developmentPlanStyle}</style>
          </div>
        )
      } else {
        return <Statement content='Oops! Something went wrong.' />
      }
    } else {
      return (
        <div>
          {skillProgression && skillProgression.length > 0 && (
            <SkillProgression skillProgression={skillProgression} />
          )}
          {feedback && (
            <>
              <div className='goal-summary__goals-set-header'>Feedback: </div>
              <div
                className='goal-results__feedback-wrapper'
                dangerouslySetInnerHTML={{
                  __html: feedback
                }}
              />
            </>
          )}
          {goals && goals.length > 0 && (
            <div className='goal-summary__goals-reviewed-wrapper'>
              <div className='goal-summary__goals-reviewed-header'>
                <span>
                  Goals reviewed:{'    '}
                  <span className='goal-summary__goals-reviewed-header__number'>
                    {goals.length}
                  </span>
                </span>
                <Button onClick={this.toggleGoalsVisible}>
                  {goalsVisible ? 'Hide' : 'Show'}
                </Button>
              </div>
              {goalsVisible && (
                <List noBoxShadow noPadding>
                  {goals.map(goal => (
                    <GoalItemCompleted
                      key={`goals-summary:goal-reviewed:${goal._id}`}
                      {...goal}
                    />
                  ))}
                </List>
              )}
            </div>
          )}
          {nextGoals && nextGoals.length > 0 && (
            <div>
              <div className='goal-summary__goals-set-header'>Next steps</div>
              {nextGoals.map((goal, i) => (
                <GoalItem
                  key={`goals-summary:goal-set:${goal.goalName}`}
                  {...goal}
                  showDevPlanButton={
                    goal.developmentPlan !== null &&
                    goal.developmentPlan.content.length +
                      goal.developmentPlan.mentors.length >
                      0
                  }
                  onDevPlanButtonClick={() => this.toggleDevelopmentPlan(i)}
                />
              ))}
            </div>
          )}
          {!onlySummary && (
            <Link
              to={
                reviewWillClose ? '/reviews/past' : `/start-review/${reviewId}`
              }
            >
              <Button type='primary'>Finish</Button>
            </Link>
          )}
        </div>
      )
    }
  }
}

// const GoalsSummary = ({
//   reviewId,
//   goals,
//   nextGoals,
//   reviewWillClose,
//   onlySummary,
//   skillProgression
// }) => {
//   let [goalsVisible, setGoalsVisible] = useState(false)
//   let [inDevelopmentPlan, setInDevelopmentPlan] = useState(false)
//   if(inDevelopmentPlan) {

//   } else {
//     return (
//       <div>
//         {skillProgression && skillProgression.length > 0 && (
//           <SkillProgression skillProgression={skillProgression} />
//         )}
//         {goals && goals.length > 0 && (
//           <div className="goal-summary__goals-reviewed-wrapper">
//             <div className="goal-summary__goals-reviewed-header">
//               <span>
//                 Goals reviewed:{'    '}
//                 <span className="goal-summary__goals-reviewed-header__number">
//                   {goals.length}
//                 </span>
//               </span>
//               <Button onClick={() => setGoalsVisible(!goalsVisible)}>
//                 {goalsVisible ? 'Hide' : 'Show'}
//               </Button>
//             </div>
//             {goalsVisible && (
//               <List noBoxShadow noPadding>
//                 {goals.map(goal => (
//                   <GoalItemCompleted
//                     key={`goals-summary:goal-reviewed:${goal._id}`}
//                     {...goal}
//                   />
//                 ))}
//               </List>
//             )}
//           </div>
//         )}
//         {nextGoals && nextGoals.length > 0 && (
//           <div>
//             <div className="goal-summary__goals-set-header">Next steps</div>
//             {nextGoals.map(goal => (
//               <GoalItem
//                 key={`goals-summary:goal-set:${goal.goalName}`}
//                 {...goal}
//                 showDevPlanButton
//                 // onDevPlanButtonClick={() => history.push(`/plan/${goal._id}`)}
//               />
//             ))}
//           </div>
//         )}
//         {!onlySummary && (
//           <Link to={reviewWillClose ? '/reviews' : `/start-review/${reviewId}`}>
//             <Button type="primary">Finish</Button>
//           </Link>
//         )}
//       </div>
//     )
//   }
// }

export default GoalsSummary
