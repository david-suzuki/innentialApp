import React, { useState } from 'react'
import { Table, Button, Pagination, Loading, Message } from 'element-react'
import {
  fetchRelevantLearningContent
  // deleteLearningContent
} from '../../../api'
// import { localizedTime } from '../../general/utilities'
import { LearningContentDetails } from '../../learning-content/components'
// import { Link } from 'react-router-dom'
import { useQuery } from '@apollo/react-hooks'

const listColumns = onContentAdd => [
  {
    type: 'expand',
    expandPannel: data => {
      return <LearningContentDetails data={data} />
    }
  },
  {
    label: 'Type',
    prop: 'type',
    sortable: true
  },
  {
    label: 'Title',
    prop: 'title',
    sortable: true
  },
  {
    label: 'Difficulty',
    render: ({ relatedPrimarySkills = [] }) => {
      const difficultyLevels = [
        'ENTRY-LEVEL',
        'BEGINNER',
        'NOVICE',
        'INTERMEDIATE',
        'ADVANCED',
        'EXPERT'
      ]
      return difficultyLevels[
        relatedPrimarySkills.reduce((acc, curr) => {
          if (curr.skillLevel > acc) return curr.skillLevel
          return acc
        }, 0)
      ]
    },
    sortable: true
  },
  {
    label: 'Relevance Rating',
    render: row => {
      return Math.round(row.relevanceRating * 100) / 100
    }
  },
  {
    label: 'Operations',
    render: item => {
      return (
        <Button type='primary' size='small' onClick={() => onContentAdd(item)}>
          Add to learning path
        </Button>
      )
    }
  }
]

const GoalRelatedContent = ({
  selectedContent = [],
  neededSkills,
  onContentAdd = () => {},
  toggleDevelopmentPlan,
  children
}) => {
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(20)

  const { loading, error, data } = useQuery(fetchRelevantLearningContent, {
    variables: {
      neededSkills,
      selectedSkills: []
    }
  })

  if (loading) return <Loading />

  if (error) {
    Message({
      message: `Error! ${error.message}`,
      type: 'error'
    })
    return null
  }

  if (data) {
    const relevantContent = data.fetchRelevantLearningContent.filter(
      item => !selectedContent.some(selected => selected._id === item._id)
    )

    return (
      <div style={{ padding: '15px' }}>
        <div
          style={{ padding: '10px 0px', display: 'flex', alignItems: 'center' }}
        >
          {children}
          <Button type='primary' onClick={() => toggleDevelopmentPlan()}>
            Hide
          </Button>
          <Pagination
            total={relevantContent.length}
            layout='sizes, prev, pager, next'
            pageSizes={[20, 50, 100, 200]}
            pageSize={pageSize}
            currentPage={page}
            onSizeChange={pageSize => setPageSize(pageSize)}
            onCurrentChange={page => setPage(page)}
          />
        </div>
        <Table
          style={{ width: '100%' }}
          columns={listColumns(onContentAdd)}
          data={relevantContent.slice(pageSize * (page - 1), pageSize * page)}
          stripe
          emptyText='No Learning Content Available'
        />
      </div>
    )
  }
  return null
}

export default GoalRelatedContent
