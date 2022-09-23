import React, { useEffect, useState } from 'react'
import { SkillItemsAdmin, Statement } from '../../ui-components'
import { Query, useQuery } from 'react-apollo'
import {
  fetchLatestTeamEvaluation,
  fetchTeamEvaluationsForOrganization
} from '../../../api'
import { sortSkillGapItems } from '../../teams/_teamUtils'
import '../../../styles/theme/notification.css'
import { captureFilteredError, LoadingSpinner } from '../../general'
import { Button } from 'element-react'
import history from '../../../history'

const initialLimitOffset = 1

const TeamSkillItems = ({ _id: teamId, teamName, skills, displayRequired }) => {
  const finalItems = sortSkillGapItems(skills)

  const filteredItems = finalItems.filter(
    ({ skillNeeded }) => !displayRequired || skillNeeded > 0
  )

  if (!displayRequired && filteredItems.length === 0) return null

  return (
    <div style={{ marginBottom: '20px' }}>
      <SkillItemsAdmin
        items={filteredItems}
        teamName={teamName}
        teamId={teamId}
        displayRequired={displayRequired}
        withLink
        isAdmin
        tooltip
      />
    </div>
  )
}

export const TeamSkillQuery = ({
  teamId,
  teamName,
  displayRequired,
  search
}) => {
  const { data, loading, error } = useQuery(fetchLatestTeamEvaluation, {
    variables: {
      teamId,
      search
    }
  })

  if (loading) return <LoadingSpinner />

  if (error) {
    captureFilteredError(error)
    return <Statement content='Oops! Something went wrong' />
  }

  if (data) {
    const skills = data?.fetchLatestTeamEvaluation || []

    return (
      <TeamSkillItems
        _id={teamId}
        teamName={teamName}
        skills={skills}
        displayRequired={displayRequired}
      />
    )
  }
  return null
}

const TeamSkills = ({ search, displayRequired }) => {
  const [limit, setLimit] = useState(initialLimitOffset)
  const [offset, setOffset] = useState(initialLimitOffset)
  const [loadingMore, setLoadingMore] = useState(false)
  const [reloading, setReloading] = useState(false)
  const [noMoreTeams, setNoMoreTeams] = useState(false)

  const { data, loading, error, fetchMore } = useQuery(
    fetchTeamEvaluationsForOrganization,
    {
      variables: {
        offset: 0,
        search
      }
    }
  )

  useEffect(() => {
    ;(async () => {
      try {
        setReloading(true)
        await fetchMore({
          variables: {
            offset: 0,
            search
          },
          updateQuery: (prev, { fetchMoreResult }) => fetchMoreResult
        })
        setNoMoreTeams(false)
        setOffset(initialLimitOffset)
        setLimit(initialLimitOffset)
        setReloading(false)
      } catch (e) {
        captureFilteredError(e)
      }
    })()
  }, [search])

  useEffect(() => {
    const handleScroll = async event => {
      try {
        if (search || loadingMore || noMoreTeams) return
        const scrollingElement = event?.target?.scrollingElement
        if (scrollingElement) {
          const { scrollTop, clientHeight, scrollHeight } = scrollingElement
          const maxHeight = scrollHeight - 400
          if (scrollTop + clientHeight > maxHeight) {
            setLimit(limit + 1)
            setLoadingMore(true)
            await fetchMore({
              variables: {
                offset: offset + 1,
                search
              },
              updateQuery: (prev, { fetchMoreResult }) => {
                const oldTeams = prev.fetchTeamEvaluationsForOrganization
                const [
                  newTeam
                ] = fetchMoreResult.fetchTeamEvaluationsForOrganization
                if (!newTeam) {
                  // NO MORE TEAMS
                  setNoMoreTeams(true)
                  return prev
                }
                if (oldTeams.some(({ _id }) => _id === newTeam._id)) {
                  // DUPLICATE RESULT
                  return prev
                }
                return {
                  fetchTeamEvaluationsForOrganization: [...oldTeams, newTeam]
                }
              }
            })
            setLoadingMore(false)
            setOffset(offset + 1)
          }
        }
      } catch (err) {
        captureFilteredError(err)
      }
    }
    document.addEventListener('scroll', handleScroll)

    return () => document.removeEventListener('scroll', handleScroll)
  }, [
    search,
    limit,
    setLimit,
    offset,
    setOffset,
    loadingMore,
    setLoadingMore,
    noMoreTeams,
    setNoMoreTeams
  ])

  if (loading) {
    return <LoadingSpinner />
  }

  if (error) {
    captureFilteredError(error)
    return <Statement content='Oops! Something went wrong' />
  }

  if (data) {
    if (reloading) return <LoadingSpinner />
    const teamItems =
      JSON.parse(JSON.stringify(data))?.fetchTeamEvaluationsForOrganization ||
      []
    return (
      <>
        {teamItems.slice(0, search ? undefined : limit).map(item => (
          <TeamSkillItems
            key={`team-evaluate-item:${item._id}`}
            {...item}
            displayRequired={displayRequired}
          />
        ))}
        {search && teamItems.length === 0 && (
          <Statement content='No matching skills found in organization' />
        )}
        {loadingMore && <LoadingSpinner />}
      </>
    )
  }
  return null
}

export default TeamSkills
