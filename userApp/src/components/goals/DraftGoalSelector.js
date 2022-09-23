import React, { Component } from 'react'
import goalPathItemStyle from '../../styles/goalPathItemStyle'
import { Button } from 'element-react'
import { Query } from 'react-apollo'
import { fetchDraftGoalsForUser } from '../../api'
import { captureFilteredError } from '../general'
import { List } from '../ui-components'

class GoalPathItem extends Component {
  state = {
    draftsVisible: false
  }

  render() {
    const { draftsVisible } = this.state
    const { goals = [], user: userId, addDraftToReview } = this.props

    if (!userId) return null

    return (
      <Query
        query={fetchDraftGoalsForUser}
        variables={{
          userId
        }}
        fetchPolicy='network-only'
      >
        {({ data, loading, error }) => {
          if (loading) return null
          if (error) {
            captureFilteredError(error)
            return null
          }

          const draftGoals = data && data.fetchDraftGoalsForUser

          if (draftGoals && draftGoals.length > 0) {
            const filteredGoals = draftGoals.filter(
              ({ _id: draftId }) =>
                !goals.some(
                  ([key, { _id: selectedId }]) => selectedId === draftId
                )
            )
            if (filteredGoals.length > 0) {
              return (
                <div className='goal-path__item'>
                  <div className='goal-path__item-heading'>
                    <p>Drafts</p>
                    <Button
                      className='el-button goal-path__item-button'
                      onClick={() =>
                        this.setState({ draftsVisible: !draftsVisible })
                      }
                    >
                      {draftsVisible ? 'Hide' : 'Show'}
                    </Button>
                  </div>
                  {this.state.draftsVisible && (
                    <List noBoxShadow noPadding>
                      {filteredGoals.map(draft => (
                        <div key={draft._id} className='list-item '>
                          <div className='draft-goal-selector__goal-item--label'>
                            <div>
                              <img
                                src={require('../../static/goal.svg')}
                                alt=''
                              />{' '}
                              <span className='draft-goal-selector__goal-item--name'>
                                {draft.goalName}
                              </span>
                            </div>
                            <a
                              onClick={() => {
                                addDraftToReview(draft)
                                // this.setState({ draftsVisible: !draftsVisible })
                              }}
                            >
                              Add to review +
                            </a>
                          </div>
                          {draft.relatedSkills &&
                            draft.relatedSkills.length > 0 && (
                              <div className='goal-item__skills-wrapper'>
                                <p>Related skills</p>
                                <div className='goal-item__skills'>
                                  {draft.relatedSkills.map(skill => (
                                    <span
                                      key={draft.goalName + skill._id}
                                      className='goal-item__skill-tag'
                                    >
                                      {skill.name}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            )}
                          {draft.measures && draft.measures.length > 0 && (
                            <div className='goal-item__measures-wrapper'>
                              <div className='goal-item__success-measures-label'>
                                Success measures
                              </div>
                              {draft.measures.map(
                                ({
                                  _id: measureId,
                                  measureName,
                                  completed
                                }) => (
                                  <div
                                    className='goal-item__success-wrapper'
                                    key={measureId}
                                  >
                                    <div className='goal-item__success-icon'>
                                      <img
                                        src={require(`../../static/${
                                          completed
                                            ? 'check-green.svg'
                                            : 'check.svg'
                                        }`)}
                                        alt=''
                                      />
                                    </div>
                                    <span className='goal-item__success-item'>
                                      {'  '}
                                      {measureName}
                                    </span>
                                  </div>
                                )
                              )}
                            </div>
                          )}
                        </div>
                      ))}
                    </List>
                  )}
                  <style jsx>{goalPathItemStyle}</style>
                </div>
              )
            }
          }
          return null
        }}
      </Query>
    )
  }
}

export default GoalPathItem
