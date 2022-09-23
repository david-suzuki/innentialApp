import React, { useEffect, useState } from 'react'
import TableRow from './TableRow'
import { ReactComponent as ArrowIcon } from '../../../../static/chevron-down.svg'
import { useQuery } from 'react-apollo'
import { Statement, Sort, ListSort } from '../../../ui-components'
import { fetchTeamLearningPathsProgress } from './../../../../api'
import { captureFilteredError, LoadingSpinner } from '../../../general'

const useMobileBreakpoint = () => {
  const minWidth = 1200
  const [isShrunk, setIsShrunk] = useState(window.innerWidth < minWidth)

  useEffect(() => {
    const listener = () => {
      if (window.innerWidth > minWidth) {
        isShrunk && setIsShrunk(false)
      } else {
        !isShrunk && setIsShrunk(true)
      }
    }

    window.addEventListener('resize', listener)

    return () => window.removeEventListener('resize', listener)
  }, [isShrunk, setIsShrunk])

  return isShrunk
}

const filterMethodList = [
  { label: 'This week', value: 'THIS_WEEK' },
  { label: 'All time', value: 'ALL_TIME' }
]

const ProgressTable = ({ teamId, filterMethod }) => {
  const shrunk = useMobileBreakpoint()
  const maxRows = 3
  const [showMore, setShowMore] = useState(false)

  const { data, loading, error } = useQuery(fetchTeamLearningPathsProgress, {
    variables: {
      teamId,
      filter: filterMethod.value
    }
  })

  if (loading) return <LoadingSpinner />

  if (error) {
    captureFilteredError(error)
    return <Statement label='Oops! Something went wrong' />
  }

  if (data) {
    const progress = data.fetchTeamLearningPathsProgress

    if (!progress || progress.length === 0) {
      return (
        <Statement content='No learning paths info available for this period' />
      )
    }

    return (
      <div className='progress-table-body'>
        {progress.map(
          (el, index) =>
            (showMore || index < maxRows) && (
              <TableRow data={el} key={`table-row-${index}`} shrunk={shrunk} />
            )
        )}
        {progress.length > maxRows && (
          <div
            className={`more-path-items-button ${showMore ? 'up' : ''}`}
            onClick={() => setShowMore(!showMore)}
          >
            Show {showMore ? 'less' : 'more'} Paths <ArrowIcon />
          </div>
        )}
      </div>
    )
  }

  return null
}

const ProgressTableWrapper = ({ teamId }) => {
  const [filterMethod, setFilterMethod] = useState(
    filterMethodList.find(({ value }) => value === 'ALL_TIME') ||
      filterMethodList[0]
  )

  return (
    <div className='team-stats-item__wrapper'>
      <div className='team-stats-item__header'>Learning paths progress</div>
      <div className='team-stats-item__action'>
        <ListSort
          filter={filterMethod.label}
          changeFilter={filter => setFilterMethod(filter)}
          filterList={filterMethodList}
          filterLabel='Filter by'
        />
      </div>
      <ProgressTable teamId={teamId} filterMethod={filterMethod} />
    </div>
  )
}

export default ProgressTableWrapper
