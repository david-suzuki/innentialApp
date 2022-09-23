import React from 'react'
import { Query, Mutation } from 'react-apollo'
import { fetchAllRoles, deleteRole } from '../../api'
import { Table, Button, MessageBox, Message /*, Icon */ } from 'element-react'
import { localizedTime } from '../general/utilities'
import ApolloCacheUpdater from 'apollo-cache-updater'

const handleDeletingRole = mutation => {
  MessageBox.confirm('Are you sure you want to delete the role?', 'Warning', {
    type: 'warning'
  })
    .then(() => {
      mutation()
        .then(() => {
          Message({
            type: 'success',
            message: 'Role has been deleted'
          })
        })
        .catch(e => {
          Message({
            type: 'error',
            message: e.message
          })
        })
    })
    .catch(() => {})
}

const RoleExpandDisplay = ({
  description,
  coreSkills,
  secondarySkills,
  nextSteps
}) => {
  return (
    <div>
      {description && (
        <p style={{ marginBottom: '10px' }}>
          <strong>Description: </strong>
          {description}
        </p>
      )}
      <p>
        <strong>Core Skills:</strong>
      </p>
      <ul>
        {coreSkills.map((sk, i) => {
          return (
            <li key={i}>
              {sk.fullSkill.name} level: {sk.level}
            </li>
          )
        })}
      </ul>
      <p style={{ marginTop: '10px' }}>
        <strong>Secondary Skills:</strong>
      </p>
      <ul>
        {secondarySkills.map((sk, i) => {
          return (
            <li key={i}>
              {sk.fullSkill.name} level: {sk.level}
            </li>
          )
        })}
      </ul>
      {nextSteps.length > 0 && (
        <React.Fragment>
          <p style={{ marginTop: '10px' }}>
            <strong>Next steps: </strong>
          </p>
          <ul>
            {nextSteps.map(({ title, _id }) => (
              <li key={_id}>{title}</li>
            ))}
          </ul>
        </React.Fragment>
      )}
      {/* <p style={{ marginTop: '20px' }}>Other Requirements:</p>
      <ul>
        {otherRequirements.map((sk, i) => {
          return <li key={i}>{sk}</li>
        })}
      </ul> */}
    </div>
  )
}
const listColumns = (setEditedRole, specificOrganizationId) => [
  {
    type: 'expand',
    expandPannel: ({ coreSkills, secondarySkills, description, nextSteps }) => {
      return (
        <RoleExpandDisplay
          description={description}
          coreSkills={coreSkills}
          secondarySkills={secondarySkills}
          nextSteps={nextSteps}
        />
      )
    }
  },
  {
    label: 'Created At',
    render: row => {
      return localizedTime(row.createdAt)
    },
    sortable: true,
    width: 200
  },
  {
    label: 'Title',
    prop: 'title',
    sortable: true
  },
  {
    label: 'Organization',
    prop: 'organization.organizationName',
    sortable: true
  },
  {
    label: 'Operations',
    render: data => (
      <div>
        <Button
          type='primary'
          size='small'
          onClick={e => {
            setEditedRole(data)
          }}
          disabled={
            specificOrganizationId &&
            (!data.organization ||
              data.organization._id !== specificOrganizationId)
          }
        >
          Edit
        </Button>
        <Mutation
          mutation={deleteRole}
          variables={{ roleId: data._id }}
          update={(proxy, { data: { deleteRole: roleId } }) => {
            try {
              const { fetchAllRoles: roles } = proxy.readQuery({
                query: fetchAllRoles,
                variables: { organizationId: specificOrganizationId }
              })
              const newRoles = roles.filter(category => category._id !== roleId)
              proxy.writeQuery({
                query: fetchAllRoles,
                variables: { organizationId: specificOrganizationId },
                data: { fetchAllRoles: [...newRoles] }
              })
            } catch (e) {
              console.log(e)
            }
            // your mutation response
            // const updates = ApolloCacheUpdater({
            //   proxy, // apollo proxy
            //   queriesToUpdate: [fetchAllRoles],
            //   operation: 'REMOVE',
            //   searchVariables: {},
            //   mutationResult: { _id },
            //   ID: '_id'
            // })
            // if (updates)
            //   Message({
            //     type: 'success',
            //     message: 'Delete completed!'
            //   })
          }}
          // refetchQueries={['fetchAllRoles']}
        >
          {(mutation, { loading }) => {
            return (
              <Button
                type='danger'
                size='small'
                loading={loading}
                onClick={() => handleDeletingRole(mutation)}
                disabled={
                  specificOrganizationId &&
                  (!data.organization ||
                    data.organization._id !== specificOrganizationId)
                }
              >
                Delete
              </Button>
            )
          }}
        </Mutation>
      </div>
    )
  }
]

export default ({ setEditedRole, specificOrganizationId }) => {
  return (
    <Query
      query={fetchAllRoles}
      variables={{ organizationId: specificOrganizationId }}
    >
      {({ data, loading, error }) => {
        if (loading) return '...Loading'

        if (error) {
          console.log(error)
          return 'Error!'
        }

        if (data) {
          const roles = data.fetchAllRoles

          return (
            <Table
              style={{ width: '100%' }}
              columns={listColumns(setEditedRole, specificOrganizationId)}
              data={[...roles]}
              stripe
            />
          )
        }
        return null
      }}
    </Query>
  )
}
