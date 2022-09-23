import React, { useState, useEffect, useContext } from 'react'
import { useQuery } from 'react-apollo'
import {
  fetchLearningPathsForDashboard,
  fetchOrganizationLearningPathForDashboard,
  fetchTeamsLearningPathsForDashboard,
  fetchCurrentUserTeams
} from '../../api'
import {
  Statement,
  List,
  LearningPathItems,
  LearningPathDiscussions
} from '../ui-components'
import '../../styles/theme/notification.css'
import { captureFilteredError, LoadingSpinner } from '../general'
import { Input } from 'element-react'
import learningPathListStyle from '../../styles/learningPathListStyle'
import learningPathItemsStyle from '../../styles/learningPathItemsStyle'
import { Redirect, Route, Switch } from 'react-router-dom'
import { ManageOrganizationPathTemplates } from '../organization-settings'
import { LearningPathsRecommendations } from '../dashboard-components'
import { CategoryFilters } from '.'
import { UserContext } from '../../utils'

const TeamsPathList = () => {
  const { data, loading, error } = useQuery(
    fetchTeamsLearningPathsForDashboard,
    {
      fetchPolicy: 'cache-and-network'
    }
  )

  if (loading) return <LoadingSpinner />

  if (error) {
    captureFilteredError(error)
    return <Statement content='Oops! Something went wrong' />
  }

  if (data) {
    const { key: title, value: paths = [] } =
      data?.fetchTeamsLearningPathsForDashboard || {}

    paths.sort((path1, path2) => !!path1.team - !!path2.team)

    // if (showNoResults && paths.length === 0) {
    //   return <Statement content='No learning paths to browse' />
    // }

    return <LearningPathItems title={title} value={paths} />
  }
  return null
}

const CompanyPathList = ({
  search,
  showNoResults
  // neededWorkSkills
}) => {
  const { data, loading, error } = useQuery(
    fetchOrganizationLearningPathForDashboard,
    {
      variables: {
        search
      },
      fetchPolicy: 'cache-and-network'
    }
  )

  if (loading) return <LoadingSpinner />

  if (error) {
    captureFilteredError(error)
    return <Statement content='Oops! Something went wrong' />
  }

  if (data) {
    const paths = data?.fetchOrganizationLearningPathForDashboard || []

    if (showNoResults && !search && paths.length === 0) {
      return <Statement content='No learning paths to browse' />
    }

    const title = search
      ? paths.length > 0
        ? `Found ${paths.length} path${
            paths.length > 1 ? 's' : ''
          } in the organization`
        : 'No results found in the organization'
      : `${paths[0]?.organization?.organizationName + ' Paths' || 'Organization Paths'}`

    return (
      <LearningPathItems
        title={title}
        value={paths}
        showEmpty={showNoResults}
      />
    )
  }
  return null
}

const LearningPathList = ({
  search,
  categories
  // neededWorkSkills
}) => {
  const bigScreen = window.innerHeight > 1000

  const initialLimit = bigScreen ? 2 : 1

  const [fetchPolicy, setFetchPolicy] = useState('cache-and-network')
  const [limit, setLimit] = useState(initialLimit)
  // const [{ isLoading, noMorePaths }, setScrollState] = useState({ isLoading: false, noMorePaths: false })
  const [isLoading, setLoading] = useState(false)
  const [noMorePaths, setNoMorePaths] = useState(false)

  const { data, loading, error, fetchMore } = useQuery(
    fetchLearningPathsForDashboard,
    {
      variables: {
        limit: initialLimit,
        search,
        categories
      },
      fetchPolicy
    }
  )

  useEffect(() => {
    setFetchPolicy('cache-first')
  })

  useEffect(() => {
    const handleScroll = async event => {
      try {
        if (search || categories.length > 0 || isLoading || noMorePaths) return
        const scrollingElement = event?.target?.scrollingElement
        if (scrollingElement) {
          const { scrollTop, clientHeight, scrollHeight } = scrollingElement
          const maxHeight = scrollHeight - 200
          if (scrollTop + clientHeight > maxHeight) {
            setLoading(true)
            await fetchMore({
              variables: {
                limit: limit + 1,
                search
              },
              updateQuery: (prev, { fetchMoreResult, ...rest }) => {
                if (
                  fetchMoreResult.fetchLearningPathsForDashboard.length ===
                  prev.fetchLearningPathsForDashboard.length
                ) {
                  setNoMorePaths(true)
                  return prev
                } else return fetchMoreResult
              }
            })
            if (!noMorePaths) {
              setLimit(limit + 1)
            }
          }
        }
        setLoading(false)
      } catch (err) {
        setLoading(false)
        captureFilteredError(err)
      }
    }
    document.addEventListener('scroll', handleScroll)

    return () => document.removeEventListener('scroll', handleScroll)
  }, [search, categories, isLoading, noMorePaths])

  if (loading) return <LoadingSpinner />

  if (error) {
    captureFilteredError(error)
    return <Statement content='Oops! Something went wrong' />
  }

  if (data) {
    const pathlists = data?.fetchLearningPathsForDashboard || []
    return (
      <div>
        {pathlists.map(({ _id, key, value }) => {
          return (
            <LearningPathItems
              key={_id}
              title={key}
              value={value}
              search={search}
              showEmpty
            />
          )
        })}
        {isLoading && <LoadingSpinner />}
      </div>
    )
  }
  return null
}

export const LearningPathDashboard = ({ dashboard, neededSkills = [] }) => {
  const [searchValue, setSearchValue] = useState('')
  const [search, setSearch] = useState(searchValue)
  const [categories, setCategories] = useState([])

  const { organizationName } = useContext(UserContext)

  const showTeamPaths =
    categories.length === 0 || categories.indexOf('Team Paths') !== -1
  const showCompanyPaths =
    categories.length === 0 || categories.indexOf(organizationName) !== -1

  useEffect(() => {
    const eventCallback = e => {
      if (e.key === 'Enter' && searchValue !== '') setSearch(searchValue)
    }
    document.addEventListener('keypress', eventCallback)
    return () => document.removeEventListener('keypress', eventCallback)
  }, [searchValue])

  useEffect(() => {
    if (searchValue === '') setSearch('')
  }, [searchValue])

  return (
    <div style={{ display: 'flex' }}>
      <CategoryFilters categories={categories} setCategories={setCategories} />
      <div className='learning-path-list__wrapper'>
        {!dashboard && (
          <div className='learning-path-list__search-box-input'>
            <Input
              value={searchValue}
              placeholder='Search learning paths'
              onChange={value => setSearchValue(value)}
              icon={search ? 'close' : 'search'}
              onIconClick={() => {
                if (search) {
                  setSearch('')
                  setSearchValue('')
                } else {
                  setSearch(searchValue)
                }
              }}
              className='learning-path-list__input'
            />
            {/* <Sort /> */}
          </div>
        )}

        <div
          className='tab-content tab-content--no-bg-shadow'
          style={{ boxShadow: 'none', padding: '0' }}
        >
          <List purpleBackground>
            {!search && dashboard && (
              <LearningPathsRecommendations neededSkills={neededSkills} />
            )}
            {!search && showTeamPaths && <TeamsPathList />}
            {showCompanyPaths && <CompanyPathList search={search} />}
            <LearningPathList search={search} categories={categories} />
          </List>
          <style jsx>{learningPathItemsStyle}</style>
          <style>{learningPathListStyle}</style>
        </div>
      </div>
    </div>
  )
}

export default ({ currentUser }) => {
  return (
    <div className='component-block--paths'>
      {/* <MobilePreferences /> */}
      {/* <div className='page-header page-header--button absolute-button-paths'>
              {(currentUser.roles.indexOf('ADMIN') !== -1 || currentUser.leader) && (
                <Link to='/path-templates/form'>
                  <Button className='el-button--green'>Add new Learning Path</Button>
                </Link>
              )}
            </div> */}
      <Switch>
        <Route path='/learning-paths/dashboard' exact>
          <LearningPathDashboard currentUser={currentUser} />
        </Route>
        <Route path='/learning-paths/discussions' exact>
          <LearningPathDiscussions currentUser={currentUser} />
        </Route>
        {(currentUser.leader || currentUser.roles.indexOf('ADMIN') !== -1) && (
          <Route path='/learning-paths/organization' exact>
            <ManageOrganizationPathTemplates currentUser={currentUser} />
          </Route>
        )}
        <Route path='/learning-paths/discussions' exact>
          <LearningPathDiscussions />
        </Route>
        <Route>
          <Redirect to='/learning-paths/dashboard' />
        </Route>
      </Switch>
      <style>{learningPathListStyle}</style>
    </div>
  )
}
