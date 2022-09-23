import React from 'react'
import { Table } from 'element-react'
import { useQuery } from 'react-apollo'
import {
  fetchOrganizationStatsGrowthData,
  fetchOrganizationRequiredSkillData
} from '../../api'

const OrganizationSkillStats = props => {
  const organizationId = props.organizationId

  const { data, loading, error } = useQuery(fetchOrganizationStatsGrowthData, {
    variables: { organizationId }
  })

  const { data: teamData, loading: teamLoading, error: teamError } = useQuery(
    fetchOrganizationRequiredSkillData,
    {
      variables: { organizationId }
    }
  )

  if (loading || teamLoading) return 'Loading...'
  if (error || teamError) return new Error(error || teamError).message

  const growthData = data && data.fetchOrganizationStatsGrowthData
  const teamRequiredSkills =
    teamData && teamData.fetchOrganizationRequiredSkillData

  if (growthData) {
    const { mostNeededSkills = [] } = growthData

    return (
      <>
        {mostNeededSkills.length > 0 && (
          <>
            <h3 style={{ marginBottom: '20px' }}>Most needed skills: </h3>
            <Table
              labelWidth='120'
              style={{ width: '100%' }}
              columns={[
                // {
                //   type: "index",
                //   width: '80'
                // },
                {
                  label: 'Skill name',
                  prop: 'name'
                },
                {
                  label: '# of employees w/ skill',
                  width: '300',
                  prop: 'employeesCount'
                }
              ]}
              data={mostNeededSkills}
              stripe
            />
          </>
        )}
        {teamRequiredSkills.length > 0 && (
          <>
            <h3 style={{ marginBottom: '20px', marginTop: '40px' }}>
              Most required team skills:{' '}
            </h3>
            <Table
              labelWidth='120'
              style={{ width: '100%' }}
              columns={[
                // {
                //   type: "index",
                //   width: '80'
                // },
                {
                  label: 'Skill name',
                  prop: 'name'
                },
                {
                  label: '# of teams w/ skill',
                  width: '300',
                  prop: 'employeesCount'
                }
              ]}
              data={teamRequiredSkills}
              stripe
            />
          </>
        )}
      </>
    )
  }
  return (
    <div style={{ textAlign: 'center', padding: '20px' }}>
      Nothing to display
    </div>
  )
}

export default OrganizationSkillStats
