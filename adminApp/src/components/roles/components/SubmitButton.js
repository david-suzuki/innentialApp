import React from 'react'
import { Button, Message } from 'element-react'
import { Mutation } from 'react-apollo'
import { createRoleInOrganization, fetchAllRoles } from '../../../api'
import ApolloCacheUpdater from 'apollo-cache-updater'

export default ({ form }) => {
  return (
    <Mutation
      mutation={createRoleInOrganization}
      update={(
        proxy,
        { data: { createRoleInOrganization: mutationResult = {} } }
      ) => {
        try {
          const { fetchAllRoles: roles } = proxy.readQuery({
            query: fetchAllRoles,
            variables: { organizationId: form.organizationId }
          })
          proxy.writeQuery({
            query: fetchAllRoles,
            variables: { organizationId: form.organizationId },
            data: { fetchAllRoles: [mutationResult, ...roles] }
          })
        } catch (e) {
          console.log(e)
        }
      }}
      // refetchQueries={['fetchAllRoles']}
    >
      {(mutation, { loading }) => {
        return (
          <Button
            type='primary'
            loading={loading}
            onClick={e => {
              const {
                title,
                coreSkills,
                secondarySkills,
                description,
                nextSteps,
                organizationId,
                _id
              } = form
              // TODO: VALIDATE FORM - WARN FOR MISSING FIELDS!
              const finalData = {
                _id,
                title,
                coreSkills: coreSkills.map(sk => ({
                  skillId: sk.fullSkill._id,
                  slug: sk.fullSkill.slug,
                  level: sk.level
                })),
                secondarySkills: secondarySkills.map(sk => ({
                  skillId: sk.fullSkill._id,
                  slug: sk.fullSkill.slug,
                  level: sk.level
                })),
                nextSteps: nextSteps.map(({ _id }) => _id),
                description,
                organizationId
              }

              mutation({ variables: { roleData: finalData } })
                .then(() =>
                  Message({
                    type: 'success',
                    message: 'Succesfully saved!'
                  })
                )
                .catch(e =>
                  Message({
                    type: 'error',
                    message: e.message
                  })
                )
            }}
          >
            Create/Edit Role
          </Button>
        )
      }}
    </Mutation>
  )
}
