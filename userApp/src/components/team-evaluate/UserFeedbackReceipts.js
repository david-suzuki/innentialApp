import React, { useState, useEffect } from 'react'
import { ListSort, Statement, UserFeedbackItem } from '../ui-components'
import { useQuery } from 'react-apollo'
import { fetchFeedbackReceipts } from '../../api'
import { captureFilteredError, LoadingSpinner } from '../general'

const allOption = { label: 'All', callback: () => true }

const UserFeedbackReceipts = () => {
  const [filter, setFilter] = useState(allOption)
  const [limit, setLimit] = useState(8)
  const { data, loading, error } = useQuery(fetchFeedbackReceipts)

  const handleScroll = event => {
    if (!event || !event.target || !event.target.scrollingElement) return
    const {
      scrollHeight,
      scrollTop,
      clientHeight
    } = event.target.scrollingElement
    if (scrollTop + clientHeight === scrollHeight) {
      setLimit(limit + 4)
    }
  }

  useEffect(() => {
    document.addEventListener('scroll', handleScroll, true)

    return () => document.removeEventListener('scroll', handleScroll, true)
  }, [])

  if (loading) return <LoadingSpinner />

  if (error) {
    captureFilteredError(error)
    return <Statement content='Oops! Something went wrong' />
  }

  const feedback = data && data.fetchFeedbackReceipts

  const filterOptions = [
    allOption,
    ...feedback
      .reduce((acc, curr) => {
        if (curr.evaluated === null) return acc
        if (!acc.some(user => user._id === curr.evaluated._id)) {
          return [...acc, { ...curr.evaluated }]
        }
        return acc
      }, [])
      .map(({ _id: userId, firstName, lastName, email }) => {
        return {
          label: firstName ? `${firstName} ${lastName}` : email,
          callback: ({ evaluated }) => evaluated && evaluated._id === userId
        }
      })
  ]

  const filteredFeedback = feedback.filter(filter.callback).slice(0, limit)

  return (
    <div className='generate-feedback__content'>
      <ListSort
        filter={filter.label}
        filterList={filterOptions}
        filterLabel='Show'
        changeFilter={setFilter}
      />
      {filteredFeedback.map(({ _id: key, ...rest }) => (
        <UserFeedbackItem key={key} {...rest} given />
      ))}
      {filteredFeedback.length === 0 && (
        <Statement content='No feedback to display' />
      )}
    </div>
  )
}

export default UserFeedbackReceipts
