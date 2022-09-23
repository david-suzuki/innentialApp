import React, { Component, useState, useEffect } from 'react'
import { Notification } from 'element-react'
import { Mutation, Query, useQuery, useMutation } from 'react-apollo'
import {
  fetchRelevantContentForUser as ContentQuery,
  dislikeContent,
  likeContent,
  markContentAsViewed,
  currentUserSkillsProfile,
  addContentToActiveGoal
} from '../../api'
import {
  Statement,
  List,
  remapLearningContentForUI,
  LearningItems,
  Sort,
  LearningContentSearchBar
  // DesktopFilters
} from '../ui-components'
import '../../styles/theme/notification.css'
import { captureFilteredError, LoadingSpinner } from '../general'
import { getOptions } from './utils/_getOptions'
import Container from '../../globalState'
import ApolloCacheUpdater from 'apollo-cache-updater'
import queryString from 'query-string'
import { useLocation } from 'react-router-dom'

const mapSkills = skills => {
  return skills.map(skill => {
    const { name, skillId } = skill
    if (!skillId) return skill
    return {
      name,
      _id: skillId
    }
  })
}

class LearningContentList extends Component {
  state = {
    limit: 8,
    // clickedContentQueue: [],
    noMoreContent: false
  }

  componentWillReceiveProps() {
    this.setState({
      limit: 8,
      noMoreContent: false,
      isLoading: false
    })
  }

  componentDidMount() {
    this.props.setFetchPolicy('cache-first')
    document.addEventListener('scroll', this.handleScroll, true)
  }

  componentWillUnmount() {
    this.props.setFetchPolicy('cache-and-network')
    document.removeEventListener('scroll', this.handleScroll, true)

    // document.addEventListener('blur', this.handleBlur, true)
  }

  // handleBlur = event => {
  //   if (!document.hasFocus()) {
  //     this.setState({
  //       clickedContentQueue: [
  //         ...this.state.clickedContentQueue,
  //         event.target.href
  //       ]
  //     })
  //   }
  // }

  handleScroll = event => {
    if (!event || !event.target || !event.target.scrollingElement) return

    let scrollHeight = Math.max(
      document.body.scrollHeight,
      document.documentElement.scrollHeight,
      document.body.offsetHeight,
      document.documentElement.offsetHeight,
      document.body.clientHeight,
      document.documentElement.clientHeight
    )
    let clientHeight = event.target.scrollingElement.clientHeight
    let scrollTop = window.pageYOffset
    if (scrollTop + clientHeight <= scrollHeight) {
      this.props.isSearchedContent
        ? this.props.loadMoreSearched()
        : this.loadMore()
    }
  }

  loadMore = async () => {
    if (!this.state.isLoading && !this.state.noMoreContent) {
      this.setState({ isLoading: true })
      const { limit } = this.state
      try {
        await this.props.fetchMore({
          variables: { limit: limit + 4 },
          updateQuery: (prev, { fetchMoreResult, ...rest }) => {
            if (
              fetchMoreResult.fetchRelevantContentForUser.length ===
              prev.fetchRelevantContentForUser.length
            ) {
              this.setState({ isLoading: false, noMoreContent: true })
              return prev
            } else return fetchMoreResult
          }
        })
        this.setState({ limit: limit + 4, isLoading: false })
      } catch (err) {}
    }
  }

  handleLikingContent = async (likeContent, learningContentId) => {
    if (!this.state.isLoading) {
      try {
        await likeContent({
          variables: { learningContentId }
        }).then(() => {
          // const navLinks = document.getElementsByClassName(`main-nav__item`)
          // const likedTab = navLinks[1].children[0]
          // likedTab.innerText = '• Learning'
          this.props.setLibraryHighlight(true)
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
  }

  handleDislikingContent = async (dislikeContent, learningContentId) => {
    if (!this.state.isLoading) {
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

  handleClickingContent = async (markContentAsViewed, learningContentId) => {
    await markContentAsViewed({
      variables: { learningContentId }
    })
  }

  render() {
    const { isLoading, noMoreContent } = this.state

    const {
      neededWorkSkills,
      relevantContent,
      likeContent,
      dislikeContent,
      canRecommend,
      container,
      loadingMore,
      noMoreSearchedContent
    } = this.props

    const noMore =
      (noMoreContent && !isLoading) || (!loadingMore && noMoreSearchedContent)

    const remappedContent = relevantContent.map(content => {
      const options = getOptions({
        content,
        container,
        canRecommend,
        handleLikingContent: contentId =>
          this.handleLikingContent(likeContent, contentId),
        handleDislikingContent: contentId =>
          this.handleDislikingContent(dislikeContent, contentId),
        disabled: isLoading,
        handleAddingToGoal: variables => this.handleAddingToGoal(variables)
      })
      return {
        ...remapLearningContentForUI({
          content,
          neededWorkSkills,
          options
        })
      }
    })

    return (
      <div>
        <List overflow noBoxShadow noPadding purpleBackground>
          <Mutation mutation={markContentAsViewed}>
            {markContentAsViewed => (
              <LearningItems
                items={remappedContent}
                onLinkClick={learningContentId =>
                  this.handleClickingContent(
                    markContentAsViewed,
                    learningContentId
                  )
                }
              />
            )}
          </Mutation>
        </List>
        {(isLoading || loadingMore) && <LoadingSpinner />}
        {noMore && (
          <p style={{ marginTop: '40px' }}>No more learning items available</p>
        )}
      </div>
    )
  }
}

export default ({ canRecommend, setLibraryHighlight }) => {
  const [fetchPolicy, setFetchPolicy] = useState('cache-and-network')
  const [searchedContent, setSearchedContent] = useState([])
  const container = Container.useContainer()
  const [sortMethod, setSortMethod] = useState('RELEVANCE')

  const { search: urlSearch } = useLocation()
  const urlSearchQuery = new URLSearchParams(urlSearch).get('query')

  const [addToGoalMutation] = useMutation(addContentToActiveGoal)

  const {
    setNeededSkills,
    filters,
    extraSkills,
    setUser,
    setDisplayFilters,
    search,
    setInDPSetting,
    neededSkills,
    loadingMore,
    setFetchMoreSearched,
    noMoreSearchedContent
  } = container

  const { data, loading, error } = useQuery(currentUserSkillsProfile)

  useEffect(() => {
    if (data) {
      const { currentUserSkillsProfile: profile } = data
      const mappedSkills = mapSkills(profile.neededWorkSkills)
      setNeededSkills(mappedSkills)
      setUser(null)
      setDisplayFilters(true)
      // setSearch('')
      setInDPSetting(false)
    }
    return () => setDisplayFilters(false)
  }, [data])

  // useEffect(() => {
  //   console.log('Search: ', search, 'SearchedContent: ', searchedContent)
  // }, [search, searchedContent])

  if (loading) return <LoadingSpinner />

  if (error) {
    captureFilteredError(error)
    return null
  }

  const loadMoreSearched = () => {
    setFetchMoreSearched(true)
  }

  const mainTagSkills =
    filters.preferredSkills.length > 0
      ? filters.preferredSkills
      : [...neededSkills, ...extraSkills]
  return (
    <>
      {/* <DesktopFilters 
        filters={filters}
        setFilters={filters}
      /> */}
      <LearningContentSearchBar
        setDisplayedContent={setSearchedContent}
        setInitiallySearched={() => {}}
        dontDisplayContent
        urlSearchQuery={urlSearchQuery}
      />
      {!loading &&
        !loadingMore &&
        (!search || (searchedContent.length !== 0 && search.length > 2)) && (
          <Sort setSortMethod={setSortMethod} />
        )}
      <div>
        <Query
          query={ContentQuery}
          fetchPolicy={fetchPolicy}
          variables={{
            limit: 8,
            filters,
            neededSkills: [...neededSkills, ...extraSkills],
            sortMethod
          }}
        >
          {({ data, loading, error, fetchMore }) => {
            if (loading || !data) return <LoadingSpinner />
            if (error)
              return (
                <Statement
                  label='Error'
                  content='Error loading learning items'
                />
              )

            const relevantContent = data && data.fetchRelevantContentForUser

            if (relevantContent.length > 0 || searchedContent.length > 0) {
              return (
                <Mutation
                  mutation={dislikeContent}
                  refetchQueries={[
                    'fetchDislikedContentForUser',
                    'fetchSharedInTeamContent'
                  ]}
                  update={(proxy, { data: { dislikeContent: _id } }) => {
                    ApolloCacheUpdater({
                      proxy, // apollo proxy
                      queriesToUpdate: [ContentQuery],
                      operation: 'REMOVE',
                      searchVariables: {},
                      mutationResult: { _id },
                      ID: '_id'
                    })
                  }}
                >
                  {dislikeContent => (
                    <Mutation
                      mutation={likeContent}
                      refetchQueries={[
                        'fetchLikedContentForUser',
                        'fetchSharedInTeamContent'
                      ]}
                      update={(proxy, { data: { likeContent: _id } }) => {
                        ApolloCacheUpdater({
                          proxy, // apollo proxy
                          queriesToUpdate: [ContentQuery],
                          operation: 'REMOVE',
                          searchVariables: {},
                          mutationResult: { _id },
                          ID: '_id'
                        })
                      }}
                    >
                      {likeContent => (
                        <>
                          <LearningContentList
                            relevantContent={
                              searchedContent.length > 0
                                ? searchedContent
                                : search.length <= 2
                                ? relevantContent
                                : []
                            }
                            isSearchedContent={searchedContent.length > 0}
                            dislikeContent={dislikeContent}
                            likeContent={likeContent}
                            addToGoalMutation={addToGoalMutation}
                            fetchMore={fetchMore}
                            setFetchPolicy={setFetchPolicy}
                            canRecommend={canRecommend}
                            setLibraryHighlight={setLibraryHighlight}
                            container={container}
                            neededWorkSkills={mainTagSkills}
                            loadMoreSearched={loadMoreSearched}
                            loadingMore={loadingMore}
                            noMoreSearchedContent={noMoreSearchedContent}
                          />
                        </>
                      )}
                    </Mutation>
                  )}
                </Mutation>
              )
            } else {
              return (
                <Statement content='Currently no learning items matching your preferences' />
              )
            }
          }}
        </Query>
      </div>
    </>
  )
}
