import React, { useState, useRef } from 'react'
import ApolloCacheUpdater from 'apollo-cache-updater'
import {
  Table,
  Button,
  Pagination,
  Loading,
  Message,
  MessageBox,
  Tag
} from 'element-react'
import { useQuery, useMutation } from 'react-apollo'
import { localizedTime } from '../general/utilities'
import { /* Redirect, */ Link } from 'react-router-dom'
import {
  fetchAllFulfillmentRequests
  // deleteOrganizationLearningPathByAdmin,
  // changeLearningPathsStatus,
} from '../../api'

// const handleDeletingPath = (mutation, id) => {
//   MessageBox.confirm(
//     `This will permanently delete the template. Continue? All goal templates will be removed`,
//     'Warning',
//     {
//       confirmButtonText: 'OK',
//       cancelButtonText: 'Cancel',
//       type: 'warning'
//     }
//   )
//     .then(() => {
//       // MODIFY THE DATA IF NEEDED
//       mutation({
//         variables: {
//           id
//         },
//         update: (
//           proxy,
//           {
//             data: { deleteOrganizationLearningPathByAdmin: mutationResult = {} }
//           }
//         ) => {
//           // your mutation response
//           const updates = ApolloCacheUpdater({
//             proxy, // apollo proxy
//             queriesToUpdate: [fetchAllFulfillmentRequests],
//             operation: 'REMOVE',
//             searchVariables: {},
//             mutationResult,
//             ID: '_id'
//           })
//           if (updates)
//             Message({
//               type: 'success',
//               message: 'Delete completed!'
//             })
//         }
//       }).catch(e => {
//         if (e && e.message) {
//           Message({
//             type: 'warning',
//             message: e.message
//           })
//         }
//       })
//     })
//     .catch(e => {
//       if (e && e.message) {
//         Message({
//           type: 'warning',
//           message: e.message
//         })
//       }
//     })
// }

const DetailsPanel = ({}) => {
  return (
    <div>
      {/* {category && (
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
      )} */}
    </div>
  )
}

const FulfillmentRequestList = () => {
  // const [mutation, { loading: saving }] = useMutation(
  //   deleteOrganizationLearningPathByAdmin
  // )
  // const [statusMutation] = useMutation(changeLearningPathsStatus)

  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(20)
  // const [selection, setSelection] = useState([])

  const tableRef = useRef()

  const { loading, error, data } = useQuery(fetchAllFulfillmentRequests)

  if (loading) return <Loading />

  if (error) {
    Message({
      message: `Error! ${error.message}`,
      type: 'error'
    })
    // return <Redirect to="/error-page/500" />
  }

  if (data) {
    const requests = data.fetchAllFulfillmentRequests

    const listColumns = [
      // {
      //   type: 'selection',
      //   reserveSelection: true
      // },
      {
        type: 'expand',
        expandPannel: data => <DetailsPanel {...data} />
      },
      {
        label: 'Requested',
        render: ({ createdAt }) => {
          return localizedTime(createdAt)
        },
        sortable: true,
        width: '170',
        sortMethod: (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      },
      {
        label: 'Fulfilled',
        render: ({ reviewedAt }) => {
          return reviewedAt ? localizedTime(reviewedAt) : ''
        },
        sortable: true,
        width: '170',
        sortMethod: (a, b) => new Date(b.reviewedAt) - new Date(a.reviewedAt)
      },
      {
        label: 'User',
        render: ({ user }) =>
          `${user.firstName} ${user.lastName} (${user.email})`,
        sortable: true,
        sortMethod: (a, b) => b.user.firstName.localeCompare(a.user.firstName)
      },
      {
        label: 'Item',
        render: ({ content }) => (
          <span>
            <strong>{content.title}</strong> from {content.source.name}
          </span>
        )
      },
      {
        label: 'Status',
        render: ({ fulfilled }) => (
          <Tag type={fulfilled ? 'success' : 'warning'}>
            {fulfilled ? 'Fulfilled' : 'Pending'}
          </Tag>
        ),
        sortable: true,
        sortMethod: (a, b) => !!b.fulfilled - !!a.fulfilled,
        width: '100'
      },
      {
        label: 'Operations',
        render: ({ _id: requestId }) => {
          return (
            <span>
              <Link to={`/request/${requestId}`}>
                <Button type='primary' size='small'>
                  Process request
                </Button>
              </Link>
            </span>
          )
        },
        width: '150'
      }
    ]

    // const disabled = selection.length === 0

    const paginated = requests.slice(pageSize * (page - 1), pageSize * page)

    return (
      <React.Fragment>
        <div
          style={{
            padding: '10px 0px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center' }}>
            {/* <Link to="/path-templates/create">
              <Button type="primary">Add new Path Template</Button>
            </Link> */}
            <Pagination
              total={requests.length}
              layout='sizes, prev, pager, next'
              pageSizes={[20, 50, 100, 200]}
              pageSize={pageSize}
              currentPage={page}
              onSizeChange={pageSize => setPageSize(pageSize)}
              onCurrentChange={page => setPage(page)}
            />
          </div>
          {/* <span>
            <Button
              type="success"
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
              type="warning"
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
          </span> */}
        </div>
        <Table
          // ref={tableRef}
          style={{ width: '100%' }}
          columns={listColumns}
          data={[...paginated]}
          // onSelectChange={value => setSelection(value)}
          rowKey={row => `fulfillment-request:${row._id}`}
          stripe
          emptyText='No pending delivery requests'
        />
      </React.Fragment>
    )
  }
  return null
}

export default FulfillmentRequestList
