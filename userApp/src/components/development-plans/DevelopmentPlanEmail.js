import React, { useState } from 'react'
import { Query } from 'react-apollo'
import { Select } from 'element-react'
import { LoadingSpinner, captureFilteredError } from '../general'
import { fetchUserGoals, fetchLearningContent } from '../../api'
import { Redirect, withRouter } from 'react-router-dom'
import {
  Statement,
  remapLearningContentForUI,
  LearningItemNew,
  List
} from '../ui-components'

const DisplayContent = ({ content }) => {
  const remappedContent = remapLearningContentForUI({ content })

  return (
    <List noPadding overflow noBoxShadow>
      <LearningItemNew {...remappedContent} />
    </List>
  )
}

export default withRouter(
  ({
    match: {
      params: { learningContentId }
    }
  }) => {
    const [value, onChange] = useState(null)
    return (
      <Query query={fetchLearningContent} variables={{ learningContentId }}>
        {({ data, loading, error }) => {
          if (loading) return <LoadingSpinner />

          return (
            <Query query={fetchUserGoals} fetchPolicy='cache-and-network'>
              {({ data: goalData, loading: goalLoading, error: goalError }) => {
                if (goalLoading) return <LoadingSpinner />

                if (goalError) {
                  captureFilteredError(goalError)
                  return <Redirect to='/error-page/500' />
                }

                if (goalData) {
                  const goals = goalData.fetchUserGoals

                  if (Array.isArray(goals)) {
                    const filteredGoals = goals.filter(
                      ({ status }) => status === 'ACTIVE'
                    )
                    if (filteredGoals.length === 0) return <Redirect to='/' />

                    const selectOptions = filteredGoals.map(
                      ({ _id, goalName, relatedSkills }) => (
                        <Select.Option
                          label={goalName}
                          value={{ _id, relatedSkills }}
                          key={_id}
                        />
                      )
                    )

                    const content = !error && data && data.fetchLearningContent
                    const state =
                      !error && data && data.fetchLearningContent !== null
                        ? { addContent: content }
                        : {}

                    const selectedGoal = goals.find(({ _id }) => _id === value)

                    if (selectedGoal) {
                      return (
                        <Redirect to={{ pathname: `/plan/${value}`, state }} />
                      )
                    } else {
                      return (
                        <>
                          <div className='page-heading'>
                            <div className='page-heading-info'>
                              <h1>Add content to plan</h1>
                            </div>
                          </div>
                          {content ? (
                            <DisplayContent content={content} />
                          ) : (
                            <Statement content='Oops! Could not find learning item' />
                          )}
                          <Select
                            value={selectedGoal}
                            placeholder='Choose an active goal'
                            onChange={goal => onChange(goal._id)}
                          >
                            {selectOptions}
                          </Select>
                        </>
                      )
                    }
                  }
                }
                return <Redirect to='/' />
              }}
            </Query>
          )
        }}
      </Query>
    )
  }
)
