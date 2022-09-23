import React, { useEffect, useState } from 'react'
import { fetchUserCompletedContentPlan } from '../../api'
import { useQuery } from 'react-apollo'
import { LoadingSpinner, captureFilteredError } from '../general'
import {
  Statement,
  LearningItems,
  remapLearningContentForUI
} from '../ui-components'

const CompletedContentList = () => {
  const initialLimit = 8

  const [limit, setLimit] = useState(initialLimit)
  const [noMoreItems, setNoMoreItems] = useState(false)
  const [loadingMore, setLoadingMore] = useState(false)

  const { data, loading, error, fetchMore } = useQuery(
    fetchUserCompletedContentPlan,
    {
      variables: {
        limit: initialLimit
      }
    }
  )

  useEffect(() => {
    const listener = async event => {
      try {
        if (loadingMore || noMoreItems) return

        const scrollingElement = event?.target?.scrollingElement

        if (scrollingElement) {
          const { scrollTop, clientHeight, scrollHeight } = scrollingElement
          const maxHeight = scrollHeight - 200
          if (scrollTop + clientHeight > maxHeight) {
            setLoadingMore(true)

            setLimit(limit + 4)

            await fetchMore({
              variables: {
                limit: limit + 4
              },
              updateQuery: (prev, { fetchMoreResult, ...rest }) => {
                if (
                  fetchMoreResult.fetchUserCompletedContentPlan.length ===
                  prev.fetchUserCompletedContentPlan.length
                ) {
                  setNoMoreItems(true)
                  return prev
                } else return fetchMoreResult
              }
            })
          }
        }

        setLoadingMore(false)
      } catch (err) {
        setLoadingMore(false)
        captureFilteredError(err)
      }
    }

    document.addEventListener('scroll', listener)

    return () => document.removeEventListener('scroll', listener)
  }, [limit, loadingMore, noMoreItems])

  if (loading) return <LoadingSpinner />

  if (error) {
    captureFilteredError(error)
    return <Statement content='Oops! Something went wrong' />
  }

  const completedContent = data?.fetchUserCompletedContentPlan || []

  if (completedContent.length === 0)
    return <Statement content='No learning items completed' />

  const mappedContent = completedContent.map(({ content, endDate }) => ({
    ...remapLearningContentForUI({
      content
    }),
    endDate
  }))

  return (
    <>
      <LearningItems items={mappedContent} />
      {loadingMore && <LoadingSpinner />}
      {noMoreItems && 'No more items'}
    </>
  )
}

export default CompletedContentList
