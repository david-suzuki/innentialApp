import React from 'react'
import { Button } from 'element-react'
import { Mutation } from 'react-apollo'
import {
  addRoleRequirements,
  addRoleGroup,
  fetchRoleGroups,
  fetchRoles,
  fetchRoleSuggestions
} from '../../../api'
import { removeDuplicates } from '../../../utils'

export default ({
  form,
  label = 'Submit',
  onSubmit,
  group = false,
  edit = false,
  suggestion = false
}) => {
  const mutationName = group ? 'addRoleGroup' : 'addRoleRequirements'
  return (
    <Mutation
      mutation={group ? addRoleGroup : addRoleRequirements}
      update={(cache, { data: { [mutationName]: result } }) => {
        if (!edit || suggestion) {
          // UPDATE ROLE LIST
          try {
            const { fetchRoleGroups: roleGroups } = cache.readQuery({
              query: fetchRoleGroups
            })
            const [ungrouped] = roleGroups.splice(
              roleGroups.findIndex(
                ({ _id: groupId }) => groupId === 'default:ungrouped'
              ),
              1
            )
            if (group) {
              cache.writeQuery({
                query: fetchRoleGroups,
                data: {
                  fetchRoleGroups: [
                    result,
                    ...roleGroups,
                    {
                      ...ungrouped,
                      relatedRoles: ungrouped.relatedRoles.filter(
                        ug =>
                          !result.relatedRoles.some(
                            related => related._id === ug._id
                          )
                      )
                    }
                  ]
                }
              })
            } else {
              cache.writeQuery({
                query: fetchRoleGroups,
                data: {
                  fetchRoleGroups: [
                    ...roleGroups,
                    {
                      ...ungrouped,
                      relatedRoles: [...ungrouped.relatedRoles, result]
                    }
                  ]
                }
              })
            }
          } catch (e) {}
          if (suggestion) {
            // REMOVE SUGGESTION FROM SUGGESTIONS LIST
            try {
              const { fetchRoleSuggestions: suggestions } = cache.readQuery({
                query: fetchRoleSuggestions
              })
              cache.writeQuery({
                query: fetchRoleSuggestions,
                data: {
                  fetchRoleSuggestions: suggestions.filter(
                    sugg => sugg._id !== result._id
                  )
                }
              })
            } catch (e) {}
          }
          // UPDATE ROLE SELECTOR ROLES
          try {
            const { fetchRoles: roles } = cache.readQuery({
              query: fetchRoles,
              variables: {
                organizationOnly: true
              }
            })
            if (group) {
              cache.writeQuery({
                query: fetchRoles,
                variables: {
                  organizationOnly: true
                },
                data: {
                  fetchRoles: [...result.relatedRoles, ...roles]
                }
              })
            } else {
              cache.writeQuery({
                query: fetchRoles,
                variables: {
                  organizationOnly: true
                },
                data: {
                  fetchRoles: removeDuplicates([result, ...roles], '_id')
                }
              })
            }
          } catch (e) {}
        }
      }}
      // refetchQueries={['fetchRoles', 'fetchRoleGroups']}
    >
      {(mutation, { loading }) => (
        <Button
          type='primary'
          loading={loading}
          onClick={e => {
            e.preventDefault()
            onSubmit(mutation, form, mutationName)
          }}
        >
          {label}
        </Button>
      )}
    </Mutation>
  )
}
