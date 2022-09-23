import React, { useState, useRef } from 'react'
import ApolloCacheUpdater from 'apollo-cache-updater'
import {
  Table,
  Button,
  Pagination,
  Message,
  MessageBox,
  Tag,
  Checkbox,
  Loading
} from 'element-react'
import { AssignPopup, ContentStats, Duplicate } from './components'
import { useQuery, useMutation } from 'react-apollo'
import { localizedTime } from '../general/utilities'
import { /* Redirect, */ Link } from 'react-router-dom'
import {
  fetchInnentialLearningPathStatistics,
  fetchInnentialLearningPathDetails,
  deleteOrganizationLearningPathByAdmin,
  changeLearningPathsStatus,
  fetchInnentialLearningPaths
} from '../../api'

const handleDeletingPath = (mutation, id) => {
  MessageBox.confirm(
    `This will permanently delete the template. Continue? All goal templates will be removed`,
    'Warning',
    {
      confirmButtonText: 'OK',
      cancelButtonText: 'Cancel',
      type: 'warning'
    }
  )
    .then(() => {
      // MODIFY THE DATA IF NEEDED
      mutation({
        variables: {
          id
        },
        update: (
          proxy,
          {
            data: { deleteOrganizationLearningPathByAdmin: mutationResult = {} }
          }
        ) => {
          // your mutation response
          const updates = ApolloCacheUpdater({
            proxy, // apollo proxy
            queriesToUpdate: [fetchInnentialLearningPathStatistics],
            operation: 'REMOVE',
            searchVariables: {},
            mutationResult,
            ID: '_id'
          })
          if (updates)
            Message({
              type: 'success',
              message: 'Delete completed!'
            })
        }
      }).catch(e => {
        if (e && e.message) {
          Message({
            type: 'warning',
            message: e.message
          })
        }
      })
    })
    .catch(e => {
      if (e && e.message) {
        Message({
          type: 'warning',
          message: e.message
        })
      }
    })
}

const handlePublishedStatusChange = async (pathIds, ref, mutation, value) => {
  mutation({
    variables: {
      pathIds,
      value
    }
    // update: (proxy, { data: { changeLearningPathsStatus: mutationResult = {} }}) =>
    //   ApolloCacheUpdater({
    //     proxy, // apollo proxy
    //     queriesToUpdate: [fetchInnentialLearningPathsAndStatistics],
    //     operation: 'UPDATE',
    //     searchVariables: { active: true },
    //     mutationResult,
    //     ID: '_id'
    //   })
  })
    .then(() => {
      Message({
        type: 'success',
        message: 'Status changed!'
      })
      if (ref.current !== null) ref.current.clearSelection()
    })
    .catch(({ graphQLErrors = [{ message: 'Something went wrong' }] }) => {
      Message({
        type: 'warning',
        message: graphQLErrors[0].message
      })
    })
}

const getGoalStats = (learningGoalId, goalsStats) => {
  const goalStats = goalsStats.find(
    goalStats => goalStats.goalId === learningGoalId
  )

  if (goalStats === undefined) {
    return null
  } else {
    const startedCount = goalStats.inProgressCount
    goalStats.startedDescription = startedCount

    const percentage =
      startedCount === 0 ? 0 : goalStats.completedCount / startedCount
    goalStats.completedDescription = `${goalStats.completedCount} (${(
      percentage * 100
    ).toFixed(1)}%)`
    return goalStats
  }
}

const getPathStats = (learningPathId, pathsStats) => {
  // TODO: Fix
  return null
  // const pathStats = pathsStats.find(
  //   pathStats => pathStats.learningPathId === learningPathId
  // )

  // if (!pathStats) return null

  // const startedCount = pathStats.completedCount + pathStats.inProgressCount
  // pathStats.startedDescription = startedCount

  // const percentage =
  //   startedCount === 0 ? 0 : pathStats.completedCount / startedCount
  // pathStats.completedDescription = `${pathStats.completedCount} (${(
  //   percentage * 100
  // ).toFixed(1)}%)`

  // return pathStats
}

const DetailsPanel = ({ _id: learningPathId, statistics }) => {
  const { data, loading, error } = useQuery(fetchInnentialLearningPathDetails, {
    variables: { id: learningPathId }
  })
  if (loading) {
    return <Loading />
  } else if (error) {
    Message({
      message: `Error! ${error.message}`,
      type: 'error'
    })
    return null
  } else {
    const {
      category,
      abstract,
      duration,
      publishedDate,
      description,
      goalTemplate
    } = data.fetchInnentialLearningPathDetails
    return (
      <div>
        {category && (
          <p style={{ padding: '10px 0px' }}>
            <strong>Category: </strong>
            <em>{category}</em>
          </p>
        )}
        {abstract && (
          <p style={{ paddingBottom: '10px' }}>
            <strong>Short abstract: </strong>
            <em>{abstract}</em>
          </p>
        )}
        {duration && (
          <p style={{ paddingBottom: '10px' }}>
            <strong>Duration: </strong>
            <em>{duration}</em>
          </p>
        )}
        {publishedDate && (
          <p style={{ paddingBottom: '10px' }}>
            <strong>Date published: </strong>
            <em>{new Date(publishedDate).toDateString()}</em>
          </p>
        )}
        {description && (
          <>
            <h3>Long description: </h3>
            <div style={{ padding: '10px 0px' }}>
              <em>{description}</em>
            </div>
          </>
        )}
        <h3>Goal templates: </h3>
        {goalTemplate.map(
          ({ _id, goalName, relatedSkills, measures, content }) => {
            const pathStats = getPathStats(learningPathId, statistics)
            const goalStats = pathStats
              ? getGoalStats(_id, pathStats.learningGoalStatistics)
              : null
            const goalStatsText = goalStats
              ? `${goalStats.startedDescription} | ${goalStats.completedDescription}`
              : ''
            return (
              <div
                className='path-details__goal-wrapper'
                key={`goalTemplate:${_id}`}
              >
                <img
                  src={require('../../static/goal.svg')}
                  alt='goal-icon'
                  style={{ marginRight: '10px' }}
                />
                <strong style={{ color: '#5a55ab' }}>
                  {goalName}
                  {goalStatsText ? ` | ${goalStatsText}` : ''}
                </strong>
                <div style={{ paddingLeft: '15px' }}>
                  <div>
                    {relatedSkills.length > 0 && (
                      <div style={{ padding: '10px 0px' }}>
                        <h5 style={{ marginBottom: '10px' }}>
                          Related skills:{' '}
                        </h5>
                        {relatedSkills.map(skill => (
                          <Tag
                            type='primary'
                            style={{ marginRight: '10px' }}
                            key={`${_id}:${skill._id}`}
                          >
                            {skill.name}
                          </Tag>
                        ))}
                      </div>
                    )}
                    {measures.length > 0 && (
                      <div style={{ padding: '10px 0px' }}>
                        <h5 style={{ marginBottom: '10px' }}>
                          Success measures:{' '}
                        </h5>
                        <ol style={{ paddingLeft: '15px' }}>
                          {measures.map(measure => (
                            <li key={`${_id}:${measure}`}>{measure}</li>
                          ))}
                        </ol>
                      </div>
                    )}
                  </div>
                  {content.length > 0 && (
                    <div style={{ minWidth: '250px', maxWidth: '450px' }}>
                      <h5
                        style={{
                          paddingTop: '10px',
                          marginBottom: '10px',
                          textAlign: 'left'
                        }}
                      >
                        Content:{' '}
                      </h5>
                      <ol style={{ textAlign: 'justify', paddingLeft: '15px' }}>
                        {content.map(({ content }) => (
                          <ContentStats
                            key={`${_id}:${content._id}`}
                            content={content}
                            goalStats={goalStats}
                          />
                        ))}
                      </ol>
                    </div>
                  )}
                </div>
              </div>
            )
          }
        )}
        <style jsx global>{`
          .path-details__goal-wrapper {
            padding: 20px;
            background-color: white;
            box-shadow: 0 6px 11px 5px rgba(0, 0, 0, 0.05);
            margin: 20px 0px;
          }
        `}</style>
      </div>
    )
  }
}

const PathTemplateList = () => {
  const [mutation, { loading: saving }] = useMutation(
    deleteOrganizationLearningPathByAdmin
  )
  const [statusMutation] = useMutation(changeLearningPathsStatus)

  const defaultShowOrganization = false

  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(20)
  const [selection, setSelection] = useState([])
  const [showOrganization, setShowOrganization] = useState(
    defaultShowOrganization
  )
  const [pathId, setPathId] = useState(null)
  const [pathName, setPathName] = useState(null)

  const tableRef = useRef()
  const { data: dataLP, loading: loadingLP, error: errorLP } = useQuery(
    fetchInnentialLearningPaths,
    {
      variables: {
        showOrganization,
        params: { limit: pageSize, skip: (page - 1) * pageSize }
      }
    }
  )
  if (loadingLP) return <Loading />

  if (errorLP) {
    Message({
      message: `Error! ${errorLP.message}`,
      type: 'error'
    })
  }

  if (dataLP) {
    const pathTemplates = dataLP.fetchInnentialLearningPaths
    const numberOfPathTemplates = dataLP.totalNumberOfInnentialLearningPaths
    const statistics = dataLP.fetchInnentialLearningPathStatistics

    const listColumns = [
      {
        type: 'selection',
        reserveSelection: true
      },
      {
        type: 'expand',
        expandPannel: data => {
          return <DetailsPanel {...data} statistics={statistics} />
        }
      },
      {
        label: 'Last updated',
        render: ({ updatedAt }) => {
          return localizedTime(updatedAt)
        },
        sortable: true,
        sortMethod: (a, b) => {
          return new Date(a.updatedAt) - new Date(b.updatedAt) < 0
        }
      },
      {
        label: 'Name',
        prop: 'name',
        sortable: true
      },
      {
        label: 'Started',
        render: ({ _id: learningPathId }) => {
          const pathStats = getPathStats(learningPathId, statistics)

          if (pathStats) {
            return <span>{pathStats.startedDescription}</span>
          }

          return <span>Unavailable</span>
        }
      },
      {
        label: 'Completed',
        render: ({ _id: learningPathId }) => {
          const pathStats = getPathStats(learningPathId, statistics)

          if (pathStats) {
            return <span>{pathStats.completedDescription}</span>
          }

          return <span>Unavailable</span>
        }
      },
      {
        label: 'Category',
        prop: 'targetGroup',
        sortable: true
      },
      {
        label: 'Public',
        render: ({ active }) => (active ? 'Yes' : 'No'),
        sortable: true,
        sortMethod: ({ active }) => !!active
      },
      {
        label: 'Organization specific?',
        render: ({ organization }) => {
          return organization ? organization.organizationName : 'No'
        }
      },
      {
        label: 'Operations',
        render: ({ _id: pathId, name: pathName }) => {
          return (
            <span>
              <Link to={`/path-templates/edit/${pathId}`}>
                <Button type='primary' size='small'>
                  Edit
                </Button>
              </Link>
              <Button
                type='danger'
                size='small'
                loading={saving}
                onClick={() => handleDeletingPath(mutation, pathId)}
              >
                <i className='el-icon-delete' />
              </Button>
              <Button
                type='success'
                size='small'
                onClick={() => {
                  setPathId(pathId)
                  setPathName(pathName)
                }}
              >
                Assign
              </Button>
              <Duplicate pathId={pathId} />
            </span>
          )
        }
      }
    ]

    const disabled = selection.length === 0

    return (
      <React.Fragment>
        {pathId && (
          <AssignPopup
            pathId={pathId}
            pathName={pathName}
            setNotVisible={() => {
              setPathId(null)
              setPathName(null)
            }}
          />
        )}
        <div
          style={{
            padding: '10px 0px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          <span style={{ display: 'flex', alignItems: 'center' }}>
            <Link to='/path-templates/create'>
              <Button type='primary'>Add new Path Template</Button>
            </Link>
            <Pagination
              total={numberOfPathTemplates}
              layout='sizes, prev, pager, next'
              pageSizes={[20, 50, 100, 200]}
              pageSize={pageSize}
              currentPage={page}
              onSizeChange={pageSize => setPageSize(pageSize)}
              onCurrentChange={page => setPage(page)}
            />
          </span>
          <div>
            <Checkbox
              checked={showOrganization}
              onChange={value => setShowOrganization(value)}
            >
              Show organization Learning Paths
            </Checkbox>
          </div>
          <span>
            <Button
              type='success'
              disabled={disabled}
              onClick={() =>
                handlePublishedStatusChange(
                  selection.map(({ _id }) => _id),
                  tableRef,
                  statusMutation,
                  true
                )
              }
            >
              Publish selected
            </Button>
            <Button
              type='warning'
              disabled={disabled}
              onClick={() =>
                handlePublishedStatusChange(
                  selection.map(({ _id }) => _id),
                  tableRef,
                  statusMutation,
                  false
                )
              }
              style={{ marginLeft: '10px' }}
            >
              Unpublish selected
            </Button>
          </span>
        </div>
        <Table
          ref={tableRef}
          style={{ width: '100%' }}
          columns={listColumns}
          data={pathTemplates}
          onSelectChange={value => setSelection(value)}
          rowKey={row => `path-template:${row._id}`}
          stripe
          emptyText='No Path Templates to display'
        />
      </React.Fragment>
    )
  }

  return null
}

export default PathTemplateList
