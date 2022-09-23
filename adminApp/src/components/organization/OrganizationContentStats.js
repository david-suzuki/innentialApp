import React from 'react'
import { Query } from 'react-apollo'
import { Table } from 'element-react'
import { fetchAdminTeamContentStats } from '../../api'

export default ({ organizationId }) => {
  return (
    <Query
      query={fetchAdminTeamContentStats}
      variables={{
        organizationId
      }}
    >
      {({ data, loading, error }) => {
        if (loading) return <p>Loading...</p>
        if (error) {
          console.log(error)
          return <p>Error! {error.message}</p>
        }

        if (data) {
          const tableData = data && data.fetchAdminTeamContentStats
          if (tableData) {
            return (
              <Table
                data={tableData}
                columns={[
                  {
                    label: 'Name',
                    prop: 'teamName',
                    sortable: true,
                    render: ({ teamName }) => <strong>{teamName}</strong>
                  },
                  {
                    label: 'Content liked',
                    sortable: true,
                    render: ({ total }) => <p>{total.liked}</p>
                  },
                  {
                    label: 'Content shared',
                    sortable: true,
                    render: ({ total }) => <p>{total.shared}</p>
                  },
                  {
                    label: 'Content opened',
                    sortable: true,
                    render: ({ total }) => <p>{total.opened}</p>
                  },
                  {
                    label: 'Content added',
                    sortable: true,
                    render: ({ total }) => <p>{total.added}</p>
                  }
                ]}
              />
            )
          }
        }
        return null
      }}
    </Query>
  )
}
