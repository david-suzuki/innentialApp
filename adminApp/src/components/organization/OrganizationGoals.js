import React from 'react'
import { Table, Tag } from 'element-react'
import { useQuery } from 'react-apollo'
import {
  fetchGoalsStatsForOrganization,
  fetchOrganizationGoals
} from '../../api'
import { capitalize } from '../../utils'

const DetailsPanel = ({ measures, developmentPlan }) => {
  const content = (developmentPlan && developmentPlan.content) || []
  return (
    <div style={{ padding: '10px 0px' }}>
      <h5 style={{ marginBottom: '10px' }}>Success measures: </h5>
      {measures.length > 0 ? (
        <ol style={{ paddingLeft: '15px' }}>
          {measures.map(({ _id, measureName }) => (
            <li key={_id}>{measureName}</li>
          ))}
        </ol>
      ) : (
        <em>---</em>
      )}
      <h5 style={{ marginBottom: '10px' }}>Content in development plan: </h5>
      <ul style={{ paddingLeft: '15px' }}>
        {content.map(({ _id, content: item, status, fulfillmentRequest }) => (
          <li key={_id}>
            <em>{item.title}</em>; <strong>status:</strong> {status}{' '}
            {status === 'AWAITING FULFILLMENT' ? (
              <strong>
                {fulfillmentRequest ? '(REQUESTED)' : '(NOT REQUESTED)'}
              </strong>
            ) : (
              ''
            )}
          </li>
        ))}
      </ul>
    </div>
  )
}

const OrganizationGoalList = ({ organizationId }) => {
  const { data, loading, error } = useQuery(fetchOrganizationGoals, {
    variables: { organizationId }
  })

  if (loading) return 'Loading...'
  if (error) return `Error! ${error.message}`

  const goalData = data && data.fetchOrganizationGoals

  return (
    <Table
      labelWidth='120'
      style={{ width: '100%' }}
      columns={[
        {
          type: 'expand',
          expandPannel: data => <DetailsPanel {...data} />
        },
        {
          label: 'Goal',
          render: ({ goalName }) => (
            <>
              <img
                src={require('../../static/goal.svg')}
                alt='goal-icon'
                style={{ marginRight: '10px' }}
              />
              <strong style={{ color: '#5a55ab' }}>{goalName}</strong>
            </>
          )
        },
        {
          label: 'Skills',
          render: ({ _id: goalId, relatedSkills }) => (
            <div style={{ padding: '10px 0px' }}>
              {relatedSkills.map(skill => (
                <Tag
                  key={`${goalId}:${skill._id}`}
                  type='primary'
                  style={{ marginRight: '10px' }}
                >
                  {skill.name}
                </Tag>
              ))}
            </div>
          )
        },
        {
          label: 'Owner',
          render: ({ owner }) =>
            `${owner.firstName
              ? `${owner.firstName} ${owner.lastName}`
              : owner.email
            }`
        },
        {
          label: 'Status',
          render: ({ status }) => capitalize(status),
          sortable: true,
          sortMethod: ({ status = '' }, { status: status2 = '' }) =>
            status2.localeCompare(status)
        },
        {
          label: '# of learning items',
          render: ({ developmentPlan }) =>
            (developmentPlan &&
              developmentPlan.content &&
              developmentPlan.content.length) ||
            '0',
          sortable: true,
          sortMethod: ({ developmentPlan: d1 }, { developmentPlan: d2 }) => {
            if (!d1 || !d2) return 0
            return d2.content.length - d1.content.length
          }
        },
        {
          label: 'Private',
          width: '110',
          render: ({ isPrivate }) => (isPrivate ? 'Yes' : 'No')
        }
      ]}
      data={goalData}
      stripe
    />
  )
}

const OrganizationGoals = props => {
  const organizationId = props.organizationId

  const { data, loading, error } = useQuery(fetchGoalsStatsForOrganization, {
    variables: { organizationId }
  })

  if (loading) return 'Loading...'
  if (error) return `Error! ${error.message}`

  const teamData = data && data.fetchGoalsStatsForOrganization

  return (
    <>
      <h3 style={{ marginBottom: '20px' }}>Goal statistics: </h3>
      <Table
        labelWidth='120'
        style={{ width: '100%' }}
        columns={[
          {
            label: 'Team Name',
            prop: 'teamName'
          },
          {
            label: 'Draft',
            width: '100',
            prop: 'draft'
          },
          {
            label: 'Ready for review',
            width: '150',
            prop: 'review'
          },
          {
            label: 'Active',
            width: '100',
            prop: 'active'
          },
          {
            label: 'Completed',
            width: '110',
            prop: 'completed'
          },
          {
            label: 'Private',
            width: '110',
            prop: 'privateGoal'
          }
        ]}
        data={teamData}
        stripe
      />
      <h3 style={{ marginTop: '40px', marginBottom: '20px' }}>Goal list: </h3>
      <OrganizationGoalList organizationId={organizationId} />
    </>
  )
}

export default OrganizationGoals
