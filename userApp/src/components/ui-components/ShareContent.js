import React, { useState } from 'react'
import { Dialog, Button, Select, Notification } from 'element-react'
import Container from '../../globalState'
import { Mutation, Query, useQuery } from 'react-apollo'
import {
  shareLearningContentInTeam,
  fetchSharedByMeContent,
  fetchSharedInTeamContent,
  unshareLearningContent,
  fetchCurrentUserTeams,
  fetchCurrentUserOrganizationTeamsDetails,
  fetchLikedContentForUser
} from '../../api'
import shareContentStyle from '../../styles/shareContentStyle'
import { captureFilteredError, LoadingSpinner } from '../general'
import history from '../../history'

class OneClickSharer extends React.Component {
  componentDidMount() {
    this.props
      .mutation({
        variables: {
          contentId: this.props.contentId,
          teamIds: this.props.selectedTeams,
          note: this.props.noteValue
        }
      })
      .then(res => {
        this.props.container.setSharingContent(false)
        this.props.container.setSharedContent(null)
        if (Array.isArray(res.data.shareLearningContentInTeam)) {
          if (history.location.pathname.split('/')[1] !== 'library') {
            this.props.setLibraryHighlight(true)
          }
          Notification({
            type: 'success',
            message: 'Item shared with team(s)',
            duration: 1500,
            offset: 90
          })
        } else {
          Notification({
            type: 'warning',
            message: "Couldn't share item with team",
            duration: 1500,
            offset: 90
          })
        }
      })
      .catch(e => {
        this.props.container.setSharingContent(false)
        this.props.container.setSharedContent(null)
        captureFilteredError(e)
      })
  }

  render() {
    return null
  }
}

const UnShare = ({ teams, content, container }) => {
  const [selectedTeams, setSelectedTeam] = useState([])
  return (
    <Query query={fetchSharedByMeContent} fetchPolicy='network-only'>
      {({ data, loading, error }) => {
        if (loading) return <LoadingSpinner />
        if (error) {
          captureFilteredError(error)
          return null
        }
        if (data) {
          const myContent = data.fetchSharedByMeContent || []

          const sharedContent = myContent.find(c => c._id === content.contentId)

          if (!sharedContent) {
            Notification({
              type: 'warning',
              message: 'Something went wrong',
              duration: 1500,
              offset: 90
            })
            setSelectedTeam([])
            container.setSharingContent(false)
            container.setUnsharingContent(false)
            container.setSharedContent(null)
            return null
          }
          sharedContent.sharedIn.sort((a, b) => {
            const team1 = teams.find(team => team.teamName === a)
            const team2 = teams.find(team => team.teamName === b)
            if (team1 && team2) {
              return new Date(team2.createdAt) - new Date(team1.createdAt)
            } else return -1
          })
          const selectOptions = []
          sharedContent.sharedIn.forEach(teamName => {
            const t = teams.find(t => t.teamName === teamName)
            if (t) {
              selectOptions.push(
                <Select.Option key={t._id} value={t._id} label={t.teamName} />
              )
            }
          })
          return (
            <div>
              <p className='share-content__title'>
                From which teams do you want to un-share this item?
              </p>
              <div className='select-autosuggest-in-modal'>
                <Select
                  value={selectedTeams}
                  onChange={val => setSelectedTeam(val)}
                  placeholder='Select teams'
                  multiple
                >
                  {selectOptions}
                </Select>
              </div>
              <Mutation
                variables={{
                  contentId: sharedContent._id,
                  teamIds: selectedTeams
                }}
                mutation={unshareLearningContent}
                refetchQueries={[
                  'fetchSharedByMeContent',
                  'fetchSharedInTeamContent',
                  'fetchRelevantContentForUser',
                  'fetchUserUploadedContent',
                  'fetchLikedContentForUser'
                ]}
              >
                {(mutation, { loading }) => {
                  if (selectedTeams && selectedTeams.length > 0) {
                    return (
                      <Button
                        className='el-button--space-top'
                        type='primary'
                        loading={loading}
                        onClick={e => {
                          e.preventDefault()
                          mutation().then(res => {
                            if (res.data.unshareLearningContent === 'success') {
                              setSelectedTeam([])
                              container.setSharingContent(false)
                              container.setUnsharingContent(false)
                              container.setSharedContent(null)
                              Notification({
                                type: 'success',
                                message: 'Item removed from team(s) list',
                                duration: 1500,
                                offset: 90
                              })
                            } else {
                              setSelectedTeam([])
                              container.setSharingContent(false)
                              container.setUnsharingContent(false)
                              container.setSharedContent(null)
                              Notification({
                                type: 'error',
                                message: 'Something went wrong',
                                duration: 1500,
                                offset: 90
                              })
                            }
                          })
                        }}
                      >
                        Unshare from team(s)
                      </Button>
                    )
                  } else return null
                }}
              </Mutation>
            </div>
          )
        }
        return null
      }}
    </Query>
  )
}

class OneClickUnshare extends React.Component {
  componentDidMount() {
    const { container } = this.props
    this.props
      .mutation({
        variables: {
          contentId: this.props.content._id,
          teamIds: [this.props.initialTeam]
        }
      })
      .then(res => {
        if (res.data.unshareLearningContent === 'success') {
          container.setSharingContent(false)
          container.setUnsharingContent(false)
          container.setSharedContent(null)
          Notification({
            type: 'success',
            message: 'Item removed from team(s) list',
            duration: 1500,
            offset: 90
          })
        } else {
          container.setSharingContent(false)
          container.setUnsharingContent(false)
          container.setSharedContent(null)
          Notification({
            type: 'error',
            message: 'Something went wrong',
            duration: 1500,
            offset: 90
          })
        }
      })
      .catch(e => {
        this.props.container.setSharingContent(false)
        this.props.container.setSharedContent(null)
        captureFilteredError(e)
      })
  }

  render() {
    return null
  }
}
const ShareContent = ({ currentUser, setLibraryHighlight, teams }) => {
  const container = Container.useContainer()
  let [noteValue, setNoteValue] = useState('') //eslint-disable-line
  const initialTeam = teams.length === 1 ? [teams[0]._id] : []
  const [selectedTeams, setSelectedTeam] = useState(initialTeam)

  teams.sort((a, b) => {
    if (a.createdAt && b.createdAt) {
      return new Date(b.createdAt) - new Date(a.createdAt)
    } else return -1
  })

  if (!container.sharedContent) return null

  const { /* contentLabel, */ contentId } = container.sharedContent
  const selectOptions = [
    teams.map(t => (
      <Select.Option key={t._id} value={t._id} label={t.teamName} />
    ))
  ]
  selectOptions.unshift(
    <Select.Option key='allteams' value='ALL' label='All teams' />
  )
  const alreadyShared = []
  return (
    /* <p className="share-content__title share-content__title--note">
      Add a note or a short abstract so that your colleagues know why you
      are sharing this
    </p>
    <Input
      type="textarea"
      autosize={{ minRows: 2, maxRows: 4 }}
      placeholder="Please input"
      value={noteValue}
      onChange={val => setNoteValue(val)}
    /> */
    <div>
      <Mutation
        mutation={shareLearningContentInTeam}
        update={(proxy, { data: { shareLearningContentInTeam } }) => {
          const sharedIn =
            Array.isArray(shareLearningContentInTeam) &&
            shareLearningContentInTeam.map(c => c.teams)
          if (shareLearningContentInTeam.length === 0) return
          const baseContent = shareLearningContentInTeam[0]
          // .sharedContent
          if (!baseContent && !baseContent._id) return
          try {
            // update my content
            if (baseContent.sharedBy !== currentUser._id)
              throw new Error('Not first shared')
            const data = proxy.readQuery({
              query: fetchSharedByMeContent
            })

            const sharedBeforeIndex = data.fetchSharedByMeContent.findIndex(
              c => c._id === baseContent.sharedContent._id
            )
            if (sharedBeforeIndex === -1) {
              data.fetchSharedByMeContent.unshift({
                ...baseContent.sharedContent,
                sharedIn
              })
            } else {
              const prev = data.fetchSharedByMeContent[sharedBeforeIndex]
              const sharedUnique = sharedIn
              prev.sharedIn.forEach(team => {
                if (sharedUnique.indexOf(team) === -1) {
                  sharedUnique.push(team)
                } else alreadyShared.push(team)
              })

              data.fetchSharedByMeContent[sharedBeforeIndex] = {
                ...prev,
                sharedIn: [...sharedUnique]
              }
            }

            proxy.writeQuery({ query: fetchSharedByMeContent, data })
          } catch (e) {}

          try {
            // update teams content
            const data = proxy.readQuery({
              query: fetchSharedInTeamContent
            })
            shareLearningContentInTeam.forEach(teamContent => {
              const prevIndex = data.fetchSharedInTeamContent.findIndex(c => {
                return c._id === teamContent._id
              })
              if (prevIndex === -1) {
                data.fetchSharedInTeamContent.unshift(teamContent)
              }
            })
            proxy.writeQuery({ query: fetchSharedInTeamContent, data })
          } catch (e) {}

          if (alreadyShared.length > 0) {
            Notification({
              type: 'success',
              message: `Item already shared in teams: ${alreadyShared.join(
                ', '
              )}`,
              duration: 1500,
              offset: 90
            })
          } else
            Notification({
              type: 'success',
              message: 'Item shared with teams',
              duration: 1500,
              offset: 90
            })
        }}
        refetchQueries={[
          'fetchRelevantContentForUser',
          'fetchUserUploadedContent'
        ]}
      >
        {(mutation, { loading }) => {
          if (initialTeam.length === 1) {
            if (container.isSharingContent) {
              return (
                <OneClickSharer
                  mutation={mutation}
                  container={container}
                  contentId={contentId}
                  selectedTeams={selectedTeams}
                  noteValue={noteValue}
                  setLibraryHighlight={setLibraryHighlight}
                />
              )
            } else if (container.isUnsharingContent) {
              return (
                <Mutation
                  mutation={unshareLearningContent}
                  refetchQueries={[
                    'fetchSharedByMeContent',
                    'fetchSharedInTeamContent',
                    'fetchRelevantContentForUser',
                    'fetchUserUploadedContent'
                  ]}
                >
                  {unshareLearningContent => {
                    return (
                      <Query query={fetchSharedByMeContent}>
                        {({ data, loading, error }) => {
                          if (loading) return <LoadingSpinner />
                          if (error) {
                            captureFilteredError(error)
                            return null
                          }
                          if (data) {
                            const myContent = data.fetchSharedByMeContent || []
                            const sharedContent = myContent.find(
                              c => c._id === container.sharedContent.contentId
                            )
                            if (!sharedContent) {
                              Notification({
                                type: 'warning',
                                message: 'Something went wrong',
                                duration: 1500,
                                offset: 90
                              })
                              return null
                            }
                            return (
                              <OneClickUnshare
                                mutation={unshareLearningContent}
                                content={sharedContent}
                                initialTeam={initialTeam[0]}
                                container={container}
                              />
                            )
                          }
                          return null
                        }}
                      </Query>
                    )
                  }}
                </Mutation>
              )
            } else return null
          } else {
            return (
              <Dialog
                visible={
                  container.isSharingContent || container.isUnsharingContent
                }
                onCancel={() => {
                  container.setSharingContent(false)
                  container.setUnsharingContent(false)
                  container.setSharedContent(null)
                }}
              >
                <Dialog.Body>
                  {container.isUnsharingContent && (
                    <UnShare
                      content={container.sharedContent}
                      teams={teams}
                      container={container}
                    />
                  )}
                  {container.isSharingContent && (
                    <div>
                      {/*
                 <    p className="share-content__title">Shared Content: {contentLabel}</p>
                   */}
                      <p className='share-content__title'>
                        To which teams do you want to share this item?
                      </p>
                      <div className='select-autosuggest-in-modal'>
                        <Select
                          value={selectedTeams}
                          onChange={val => {
                            if (val.indexOf('ALL') !== -1) {
                              setSelectedTeam(teams.map(team => team._id))
                            } else setSelectedTeam(val)
                          }}
                          placeholder='Select teams'
                          multiple
                        >
                          {selectOptions}
                        </Select>
                      </div>
                      {/* <Button
                        className="el-button--space-top"
                        type="primary"
                        loading={loading}
                        onClick={e => {
                          e.preventDefault()
                          const teamIds = teams.map(team => team._id)
                          mutation({
                            variables: {
                              contentId,
                              teamIds,
                              note: noteValue
                            }
                          }).then(res => {
                            container.setSharingContent(false)
                            container.setSharedContent(null)
                            if (
                              Array.isArray(res.data.shareLearningContentInTeam)
                            ) {
                              if (history.location.pathname !== '/content') {
                                const navLinks = document.getElementsByClassName(
                                  `main-nav__item`
                                )
                                const contentTab = navLinks[1].children[0]
                                contentTab.innerText = '• Content'
                              }
                              setSelectedTeam([])
                            } else {
                              Notification({
                                type: 'warning',
                                message: "Couldn't share content with team",
                                duration: 1500,
                                offset: 90
                              })
                            }
                          })
                        }}
                      >
                        Share to all
                      </Button> */}
                      <Button
                        className='el-button--space-top'
                        type='primary'
                        loading={loading}
                        disabled={selectedTeams && selectedTeams.length === 0}
                        onClick={e => {
                          e.preventDefault()
                          mutation({
                            variables: {
                              contentId,
                              teamIds: selectedTeams,
                              note: noteValue
                            }
                          }).then(res => {
                            container.setSharingContent(false)
                            container.setSharedContent(null)
                            if (
                              Array.isArray(res.data.shareLearningContentInTeam)
                            ) {
                              if (
                                history.location.pathname.split('/')[1] !==
                                'library'
                              ) {
                                setLibraryHighlight(true)
                              }
                              setSelectedTeam([])
                            } else {
                              Notification({
                                type: 'warning',
                                message: "Couldn't share item with team",
                                duration: 1500,
                                offset: 90
                              })
                            }
                          })
                        }}
                      >
                        Share in team
                      </Button>
                    </div>
                  )}
                </Dialog.Body>
              </Dialog>
            )
          }
        }}
      </Mutation>
      <style jsx>{shareContentStyle}</style>
    </div>
  )
}

export default props => {
  const {
    data: currentUserTeamsData,
    loading: currentUserTeamsLoading,
    error: currentUserTeamsError
  } = useQuery(fetchCurrentUserOrganizationTeamsDetails)

  if (!currentUserTeamsLoading) {
    const teams = currentUserTeamsData.fetchCurrentUserOrganization.teams
    return <ShareContent {...props} teams={teams} />
  } else if (currentUserTeamsLoading) {
    return <LoadingSpinner />
  }
}
