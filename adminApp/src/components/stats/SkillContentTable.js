import React from 'react'
import { Query } from 'react-apollo'
import { Table } from 'element-react'
import { fetchSkillStats } from '../../api'

export const SkillContentTable = () => {
  return (
    <Query query={fetchSkillStats}>
      {({ data, loading, error }) => {
        if (loading) return 'loading'
        if (error) {
          console.log(error)
          return 'Error'
        }

        if (data) {
          const tableData = data && data.fetchSkillStats
          if (tableData) {
            return (
              <Table
                data={tableData}
                columns={[
                  {
                    label: 'Name',
                    prop: 'name',
                    sortable: true,
                    render: ({ name }) => <p>{name}</p>
                  },
                  {
                    label: 'Count',
                    prop: 'count',
                    sortable: true,
                    render: ({ count }) => <p>{count}</p>
                  },
                  {
                    label: 'Articles',
                    prop: 'articles',
                    sortable: true,
                    render: ({ articles }) => <p>{articles}</p>
                  },
                  {
                    label: 'E-Learning',
                    prop: 'eLearning',
                    sortable: true,
                    render: ({ eLearning }) => <p>{eLearning}</p>
                  },
                  {
                    label: 'Books',
                    prop: 'books',
                    sortable: true,
                    render: ({ books }) => <p>{books}</p>
                  },
                  {
                    label: 'Tools',
                    prop: 'tools',
                    sortable: true,
                    render: ({ tools }) => <p>{tools}</p>
                  },
                  {
                    label: 'New Content',
                    prop: 'newContent',
                    sortable: true,
                    render: ({ newContent }) => <p>{newContent}</p>
                  }
                ]}
              />
            )
          }
          return null
        }
      }}
    </Query>
  )
}
