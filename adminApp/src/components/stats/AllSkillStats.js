import React, { useState } from 'react'
import { Table, Checkbox, Loading } from 'element-react'
import { useQuery } from 'react-apollo'
import { fetchAllGrowthData, fetchSkillBreakdown } from '../../api'
import { Link } from 'react-router-dom'

const SkillBreakdown = ({ skillId, showActiveClients, showLastSixMonths }) => {
  const { data, loading, error } = useQuery(fetchSkillBreakdown, {
    variables: {
      skillId,
      showActiveClients,
      showLastSixMonths
    }
  })

  if (loading) return <Loading />

  if (error) {
    console.error(error)
    return <div>{error.message}</div>
  }

  if (data) {
    const users = (data && data.fetchSkillBreakdown) || []
    if (users.length === 0) return <div>Something went wrong!</div>
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          flexWrap: 'wrap'
        }}
      >
        {users.map(({ _id: userId, email, firstName, lastName }) => (
          <span style={{ width: '50%' }}>
            <Link to={`/users/${userId}`}>
              {firstName ? `${firstName} ${lastName} (${email})` : email}
            </Link>
          </span>
        ))}
      </div>
    )
  }
  return null
}

const AllSkillStats = () => {
  const showActiveClientsDefault = false
  const showLastSixMonthsDefault = false

  const [showActiveClients, setShowActiveClients] = useState(
    showActiveClientsDefault
  )
  const [showLastSixMonths, setShowLastSixMonths] = useState(
    showLastSixMonthsDefault
  )

  const { data, loading, error } = useQuery(fetchAllGrowthData, {
    variables: {
      showActiveClients,
      showLastSixMonths
    }
  })

  if (loading) return 'Loading...'
  if (error) return `Error! ${error.message}`

  const growthData = data && data.fetchAllGrowthData

  if (growthData) {
    const { mostNeededSkills = [] } = growthData

    return (
      <>
        <div style={{ marginTop: '10px' }}>
          <Checkbox
            checked={showActiveClients}
            onChange={value => setShowActiveClients(value)}
          >
            See only active clients
          </Checkbox>
        </div>
        <div style={{ marginTop: '10px', marginBottom: '40px' }}>
          <Checkbox
            checked={showLastSixMonths}
            onChange={value => setShowLastSixMonths(value)}
          >
            See only data from the last 6 months
          </Checkbox>
        </div>
        <h3 style={{ marginBottom: '20px' }}>Most needed skills: </h3>
        <Table
          labelWidth='120'
          style={{ width: '100%' }}
          columns={[
            {
              type: 'expand',
              expandPannel: ({ _id }) => (
                <SkillBreakdown
                  skillId={_id.split(':')[0]}
                  showActiveClients={showActiveClients}
                  showLastSixMonths={showLastSixMonths}
                />
              )
            },
            {
              label: 'Skill name',
              prop: 'name'
            },
            {
              label: '# of users w/ skill',
              width: '300',
              prop: 'employeesCount'
            }
          ]}
          data={mostNeededSkills}
          stripe
          emptyText='No users match the criteria'
        />
      </>
    )
  }
  return (
    <div style={{ textAlign: 'center', padding: '20px' }}>
      Nothing to display
    </div>
  )
}

export default AllSkillStats
