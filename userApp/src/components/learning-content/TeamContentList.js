import React, { Component } from 'react'
import { Query, Mutation, useMutation } from 'react-apollo'
import {
  fetchSharedInTeamContent,
  markContentAsViewed,
  likeContent,
  dislikeContent,
  addContentToActiveGoal,
  fetchDataForTeamContentList

  // currentUserPreferredTypes
} from '../../api'
import { LoadingSpinner, captureFilteredError } from '../general'
import {
  Sort,
  Statement,
  remapLearningContentForUI,
  LearningItems
} from '../ui-components'
import { Notification, Select } from 'element-react'
import { withRouter } from 'react-router-dom'
import Container from '../../globalState'
import { getOptions } from './utils/_getOptions'

class TeamContentList extends Component {
  constructor(props) {
    super(props)

    // const { searchTeamName } = props

    this.state = {
      sortBy: 'DATE',
      selectedTeam: 'All Teams'
    }
  }

  // componentDidMount() {
  //   const navLinks = document.getElementsByClassName(`main-nav__item`)
  //   const likedTab = navLinks[1].children[0]
  //   likedTab.innerText = 'Learning'
  // }

  handleLikingContent = async (likeContent, learningContentId) => {
    try {
      await likeContent({
        variables: { learningContentId }
      }).then(() => {
        Notification({
          type: 'success',
          message: `The item has been saved in your private list`,
          duration: 2500,
          offset: 90
        })
      })
    } catch (e) {
      captureFilteredError(e)
      Notification({
        type: 'error',
        message: `Oops, something went wrong!`,
        duration: 2500,
        offset: 90,
        iconClass: 'el-icon-error'
      })
    }
  }

  handleDislikingContent = async (dislikeContent, learningContentId) => {
    try {
      await dislikeContent({
        variables: { learningContentId }
      }).then(() => {
        Notification({
          type: 'success',
          message: `The item has been disliked`,
          duration: 2500,
          offset: 90
        })
      })
    } catch (e) {
      captureFilteredError(e)
      Notification({
        type: 'error',
        message: `Oops, something went wrong!`,
        duration: 2500,
        iconClass: 'el-icon-error'
      })
    }
  }

  handleClickingContent = async (markContentAsViewed, learningContentId) => {
    await markContentAsViewed({
      variables: { learningContentId }
    })
  }

  handleAddingToGoal = async variables => {
    try {
      const {
        data: { addContentToActiveGoal: result }
      } = await this.props.addToGoalMutation({
        variables
      })
      if (result !== null) {
        Notification({
          type: 'success',
          message: `Item added to development plan`,
          duration: 2500,
          offset: 90
        })
      } else {
        Notification({
          type: 'error',
          message: `Oops, something went wrong!`,
          duration: 2500,
          iconClass: 'el-icon-error'
        })
      }
    } catch (e) {
      captureFilteredError(e)
      Notification({
        type: 'error',
        message: `Oops, something went wrong!`,
        duration: 2500,
        iconClass: 'el-icon-error'
      })
    }
  }

  render() {
    const {
      // sharedContent,
      teamsSharedContent,
      teamSelectOptions,
      // currentUser,
      organizationData,
      neededWorkSkills,
      // sortMethod,
      newSharedContent,
      canRecommend,
      container,
      likeContent,
      dislikeContent
    } = this.props
    if (newSharedContent.length === 0) {
      return <Statement content='No items to display' />
    }
    const { sortBy, selectedTeam } = this.state

    if (sortBy === 'DATE') {
      newSharedContent.sort((a, b) => {
        const aDate = new Date(a.lastShared)
        const bDate = new Date(b.lastShared)
        return bDate - aDate
      })
    }

    const allRemappedContent = newSharedContent.map(shared => {
      const { sharedContent: content, sharedBy, teams } = shared
      const options = getOptions({
        content,
        container,
        canRecommend,
        handleLikingContent: contentId =>
          this.handleLikingContent(likeContent, contentId),
        handleDislikingContent: contentId =>
          this.handleDislikingContent(dislikeContent, contentId),
        handleAddingToGoal: this.handleAddingToGoal
      })

      return {
        ...remapLearningContentForUI({
          content,
          neededWorkSkills,
          shareInfo: {
            sharedBy: organizationData.employees.find(e => e._id === sharedBy),
            sharedTeams: teams
          },
          options
        })
      }
    })

    return (
      <div>
        <Sort
          onTeamPage
          sortMethod={sortBy}
          onSortChange={sortBy => this.setState({ sortBy })}
        />

        <Mutation mutation={markContentAsViewed}>
          {markContentAsViewed => {
            return (
              <>
                {sortBy === 'DATE' && (
                  <div>
                    <LearningItems
                      items={allRemappedContent}
                      onLinkClick={learningContentId =>
                        this.handleClickingContent(
                          markContentAsViewed,
                          learningContentId
                        )
                      }
                    />
                  </div>
                )}
                {sortBy === 'TEAMS' && (
                  <>
                    <Select
                      value={selectedTeam}
                      onChange={val => this.setState({ selectedTeam: val })}
                    >
                      {teamSelectOptions}
                    </Select>
                    {Object.keys(teamsSharedContent)
                      .sort((a, b) => {
                        const team1 = organizationData.teams.find(
                          team => team._id === a
                        )
                        const team2 = organizationData.teams.find(
                          team => team._id === b
                        )
                        if (team1 && team2) {
                          return (
                            new Date(team2.createdAt) -
                            new Date(team1.createdAt)
                          )
                        } else return -1
                      })
                      .map(teamId => {
                        const team = teamsSharedContent[teamId]
                        if (
                          selectedTeam === 'All Teams' ||
                          team.slug === selectedTeam
                        ) {
                          const remappedTeamContent = team.sharedContent.map(
                            shared => {
                              const {
                                sharedContent: content,
                                sharedBy,
                                teams
                              } = shared
                              const options = getOptions({
                                content,
                                container,
                                canRecommend,
                                handleLikingContent: contentId =>
                                  this.handleLikingContent(
                                    likeContent,
                                    contentId
                                  ),
                                handleDislikingContent: contentId =>
                                  this.handleDislikingContent(
                                    dislikeContent,
                                    contentId
                                  )
                              })
                              return {
                                ...remapLearningContentForUI({
                                  content,
                                  neededWorkSkills,
                                  shareInfo: {
                                    sharedBy: organizationData.employees.find(
                                      e => e._id === sharedBy
                                    ),
                                    sharedTeams: teams
                                  },
                                  options
                                })
                              }
                            }
                          )

                          return (
                            <React.Fragment key={team._id}>
                              <div className='list__section-title list__section-title--margin-top'>
                                <h3>{team.teamName}</h3>
                              </div>
                              <LearningItems
                                items={remappedTeamContent}
                                onLinkClick={learningContentId =>
                                  this.handleClickingContent(
                                    markContentAsViewed,
                                    learningContentId
                                  )
                                }
                              />
                            </React.Fragment>
                          )
                        } else return null
                      })}
                  </>
                )}
              </>
            )
          }}
        </Mutation>
      </div>
    )
  }
}

const refetchQueries = [
  'fetchLikedContentForUser',
  'fetchRelevantContentForUser',
  'fetchSharedInTeamContent',
  'fetchSharedByMeContent',
  'fetchDislikedContentForUser'
]

export default withRouter(({ currentUser, neededWorkSkills }) => {
  const canRecommend =
    currentUser.roles.indexOf('ADMIN') !== -1 || currentUser.leader
  const container = Container.useContainer()
  const [addToGoalMutation] = useMutation(addContentToActiveGoal)

  return (
    // The current user organization should be one of the default queries to init the app
    <Query query={fetchDataForTeamContentList}>
      {({
        data: organizationData,
        loading: loadingOrganization,
        error: errorOrganization
      }) => {
        return (
          <Query
            query={fetchSharedInTeamContent}
            fetchPolicy='cache-and-network'
          >
            {({ data, loading, error }) => {
              if (loading || loadingOrganization) return <LoadingSpinner />
              if (error || errorOrganization) {
                captureFilteredError(new Error(error || errorOrganization))
                return <Statement content='Oops! Something went wrong.' />
              }
              if (data && organizationData) {
                const {
                  fetchCurrentUserOrganization: organization
                } = organizationData
                const newSharedContent = []
                const teamsSharedContent = {}
                data.fetchSharedInTeamContent.forEach(element => {
                  const team = organization.teams.find(
                    t => t.teamName === element.teams
                  )
                  if (team) {
                    const prev = teamsSharedContent[team._id]
                    if (prev) {
                      teamsSharedContent[team._id] = {
                        ...prev,
                        sharedContent: [...prev.sharedContent, element]
                      }
                    } else {
                      teamsSharedContent[team._id] = {
                        ...team,
                        sharedContent: [element]
                      }
                    }
                  }
                  const index = newSharedContent.findIndex(
                    val => val.sharedContent._id === element.sharedContent._id
                  )
                  if (index > -1) {
                    const prev = newSharedContent[index]
                    newSharedContent[index] = {
                      ...prev,
                      lastShared:
                        new Date(prev.lastShared) > new Date(element.lastShared)
                          ? prev.lastShared
                          : element.lastShared,
                      teams: `${prev.teams}, ${element.teams}`
                    }
                  } else {
                    newSharedContent.push(element)
                  }
                })
                const selectOptions = [
                  <Select.Option
                    key={Math.random()}
                    value='All Teams'
                    label='All Teams'
                  />,
                  Object.keys(teamsSharedContent)
                    .sort((a, b) => {
                      const team1 = organization.teams.find(
                        team => team._id === a
                      )
                      const team2 = organization.teams.find(
                        team => team._id === b
                      )
                      if (team1 && team2) {
                        return (
                          new Date(team2.createdAt) - new Date(team1.createdAt)
                        )
                      } else return -1
                    })
                    .map(teamId => (
                      <Select.Option
                        key={teamId}
                        value={teamsSharedContent[teamId].slug}
                        label={teamsSharedContent[teamId].teamName}
                      />
                    ))
                ]

                return (
                  <Mutation
                    mutation={likeContent}
                    refetchQueries={refetchQueries}
                  >
                    {likeContent => {
                      return (
                        <Mutation
                          mutation={dislikeContent}
                          refetchQueries={refetchQueries}
                        >
                          {dislikeContent => {
                            return (
                              <TeamContentList
                                currentUser={currentUser}
                                organizationData={organization}
                                // sharedContent={
                                //   data.fetchSharedInTeamContent
                                // }
                                neededWorkSkills={neededWorkSkills}
                                // sortMethod={preferredTypes.sortMethod}
                                newSharedContent={newSharedContent}
                                teamsSharedContent={teamsSharedContent}
                                teamSelectOptions={selectOptions}
                                // searchTeamName={searchTeamName}
                                likeContent={likeContent}
                                dislikeContent={dislikeContent}
                                addToGoalMutation={addToGoalMutation}
                                container={container}
                                canRecommend={canRecommend}
                              />
                            )
                          }}
                        </Mutation>
                      )
                    }}
                  </Mutation>
                )
              }
              return <Statement content='Oops! Something went wrong.' />
            }}
          </Query>
        )
      }}
    </Query>
  )
})

// const index = allSharedContent.findIndex(el => String(el.sharedContent._id) === String(sc.contentId))
// if (index > -1) {
//   const prev = allSharedContent[index]
//   allSharedContent[index] = {
//     sharedContent: prev.sharedContent,
//     _id: prev._id,
//     teams: `${prev.teams}, ${team.teamName}`,
//     notes: [...prev.notes, ...sc.notes],
//     sharedBy: prev.sharedBy,
//     lastShared: prev.lastShared
//   }
// } else {

// }
