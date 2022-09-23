import React, { useState } from 'react'
import { Route, Link, withRouter } from 'react-router-dom'
import {
  Layout,
  Table,
  Button,
  Message,
  MessageBox,
  Icon,
  Pagination,
  Tag
} from 'element-react'
import { OrganizationAdd, OrganizationAddDemo } from './'
import {
  deleteOrganization,
  fetchAllOrganizations as OrganizationQuery
} from '../../api'
import { Mutation } from 'react-apollo'
import { useQuery } from '@apollo/react-hooks'
import { fetchOrganizationsListLength } from '../../api/_queries'
// import { ROLES } from '../../environment'

const handleRemovingOrganization = (organizationId, deleteOrganization) => {
  MessageBox.confirm(
    'This will permanently delete the file. Continue?',
    'Warning',
    {
      confirmButtonText: 'OK',
      cancelButtonText: 'Cancel',
      type: 'warning'
    }
  )
    .then(async () => {
      await deleteOrganization({
        variables: {
          organizationId
        }
      })
      Message({
        type: 'success',
        message: 'Delete completed!'
      })
    })
    .catch(() => {
      Message({
        type: 'info',
        message: 'Delete canceled'
      })
    })
}

const listColumns = queryVariables => [
  // {
  //   type: 'expand',
  //   expandPannel: function(data) {
  //     const admins = data.employees.filter(
  //       employee =>
  //         employee.roles.includes(ROLES.ADMIN) ||
  //         employee.roles.includes(ROLES.INNENTIAL_ADMIN)
  //     )
  //     let invitedEmployees = []
  //     const activeEmployees = data.employees.reduce((acc, curr) => {
  //       if (curr.status === 'active') {
  //         acc.push(curr)
  //       } else {
  //         invitedEmployees.push(curr)
  //       }
  //       return acc
  //     }, [])
  //     return (
  //       <div>
  //         <p>Number of Active Employees: {activeEmployees.length}</p>
  //         <p>Number of Invited Employees: {invitedEmployees.length}</p>
  //         <p>Number of Teams: {data.teams.length}</p>
  //         <div>Admins: {admins.map(admin => admin.email).toString()}</div>
  //         <p>Is Paying: {data.isPayingOrganization ? 'Yes' : 'No'}</p>
  //       </div>
  //     )
  //   }
  // },
  {
    label: 'Organization Name',
    prop: 'organizationName',
    sortable: true
  },
  // {
  //   label: 'Active Employees',
  //   render: ({ employees }) => {
  //     return (
  //       employees.filter(employee => employee.status === 'active').length || 0
  //     )
  //   }
  // },
  // {
  //   label: 'Invited Employees',
  //   render: ({ employees }) => {
  //     return (
  //       employees.filter(employeefetchOrganizationsListLengthoarded',
  //   render: ({ employees }) => {
  //     return (
  //       employees.filter(employee => employee.status === 'not-onboarded')
  //         .length || 0
  //     )
  //   }
  // },
  {
    label: 'Admins',
    render: ({ admins }) => {
      return (
        <div>
          {admins.map(admin => (
            <p key={admin}>{admin}</p>
          ))}
        </div>
      )
    }
  },
  {
    label: 'Status',
    render: ({ disabled }) => {
      return (
        <Tag type={disabled ? 'danger' : 'primary'}>
          {disabled ? 'Disabled' : 'Active'}
        </Tag>
      )
    }
  },
  {
    label: 'Paying',
    sortable: true,
    sortMethod: ({ isPayingOrganization: a }) => !a,
    render: ({ isPayingOrganization }) => {
      return <div>{isPayingOrganization ? 'Yes' : 'No'}</div>
    }
  },
  {
    label: 'Operations',
    width: 120,
    render: ({ _id, slug }) => {
      return (
        <Mutation
          mutation={deleteOrganization}
          update={(cache, { data: { deleteOrganization } }) => {
            const { fetchAllOrganizations } = cache.readQuery({
              query: OrganizationQuery,
              variables: queryVariables
            })
            const newOrganizations = fetchAllOrganizations.filter(
              content => content._id !== deleteOrganization
            )
            cache.writeQuery({
              query: OrganizationQuery,
              variables: queryVariables,
              data: { fetchAllOrganizations: [...newOrganizations] }
            })
          }}
        >
          {deleteOrganization => (
            <span
              style={{
                display: 'flex',
                justifyContent: 'center'
              }}
            >
              <Button
                style={{ marginTop: '25%', marginRight: 10 }}
                type='danger'
                size='small'
                onClick={async () =>
                  handleRemovingOrganization(_id, deleteOrganization)
                }
              >
                Delete
              </Button>
              <Link
                to={`/organizations/${slug}/${_id}`}
                style={{ marginTop: '25%' }}
              >
                <Button type='success' size='small'>
                  <Icon name='arrow-right' />
                </Button>
              </Link>
            </span>
          )}
        </Mutation>
      )
    }
  }
]

const OrganizationList = ({ match }) => {
  const [displayPaid, setDisplayPaid] = useState(false)
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(20)

  const queryVariables = {
    offset: page,
    limit: pageSize,
    displayPaid
  }

  const useQueryMany = () => {
    const resData = useQuery(OrganizationQuery, {
      fetchPolicy: 'cache-and-network',
      variables: queryVariables
    })
    const resLength = useQuery(fetchOrganizationsListLength, {
      fetchPolicy: 'cache-and-network',
      variables: { displayPaid }
    })

    return [resData, resLength]
  }

  const [
    { data = {}, loading: loadingData, error: errorData },
    { data: dataLength, loading: loadingLength, error: errorLength }
  ] = useQueryMany()

  if (loadingData || loadingLength) return 'Loading...'
  if (errorData || errorLength)
    return `Error! ${errorData.message || errorLength.message}`

  const { fetchAllOrganizations: organizations = [] } = data
  // const {fetchOrganizationsListLength } = dataLength

  const filteredOrganizations = organizations.filter(
    organization => !displayPaid || organization.isPayingOrganization
  )

  // const paginated = filteredOrganizations.slice(
  //   pageSize * (page - 1),
  //   pageSize * page
  // )

  const handleDisplayPaid = displayPaid => {
    if (!displayPaid) {
      setPage(1)
    }
    setDisplayPaid(!displayPaid)
  }

  const handlePageSizeChange = pageSize => {
    setPage(1)
    setPageSize(pageSize)
  }

  return (
    <div>
      <Route
        exact
        path={`${match.url}/add`}
        component={() => <OrganizationAdd queryVariables={queryVariables} />}
      />
      <Route
        exact
        path={`${match.url}/demo`}
        component={() => (
          <OrganizationAddDemo queryVariables={queryVariables} />
        )}
      />

      <Layout.Row>
        <Layout.Col span='24'>
          <span
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}
          >
            <span style={{ display: 'flex', alignItems: 'center' }}>
              <Link to={`${match.url}/add`} style={{ marginRight: 12 }}>
                <Button type='primary'>Add</Button>
              </Link>
              <Link to={`${match.url}/demo`} style={{ marginRight: 12 }}>
                <Button type='primary'>Add Demo</Button>
              </Link>
              <Button
                onClick={() => handleDisplayPaid(displayPaid)}
                type='primary'
                style={{ marginRight: 12 }}
              >
                {displayPaid ? 'Display All' : 'Display Paid'}
              </Button>
            </span>
            <Pagination
              total={dataLength && dataLength.fetchOrganizationsListLength}
              layout='sizes, prev, pager, next'
              pageSizes={[10, 20, 50, 100]}
              pageSize={pageSize}
              currentPage={page}
              onSizeChange={pageSize => handlePageSizeChange(pageSize)}
              onCurrentChange={page => setPage(page)}
            />
          </span>
          <Table
            labelWidth='120'
            style={{ width: '100%' }}
            columns={listColumns(queryVariables)}
            data={[...filteredOrganizations]}
            stripe
          />
        </Layout.Col>
      </Layout.Row>
      <style jsx global>{`
        .el-button {
          margin-bottom: 20px;
        }
      `}</style>
    </div>
  )
}

export default withRouter(OrganizationList)
