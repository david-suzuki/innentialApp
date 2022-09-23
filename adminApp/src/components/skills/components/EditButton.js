import React from 'react'
import { Button, Message } from 'element-react'
import { Mutation } from 'react-apollo'
import { editSkill } from '../../../api'

export const EditButton = ({ formRef, form, skillId, goBack }) => {
  return (
    <Mutation
      mutation={editSkill}
      refetchQueries={[
        'fetchAllSkills',
        'fetchRegularSkills',
        'fetchSkillEditForm'
      ]}
    >
      {editSkill => (
        <Button
          type='primary'
          onClick={e => {
            e.preventDefault()
            formRef.current.validate(async valid => {
              if (valid) {
                // const skillId = this.state.skillId
                const skillData = {
                  ...form
                }
                try {
                  await editSkill({
                    variables: { skillData, skillId }
                  })
                  Message({
                    type: 'success',
                    message: `Successfully updated!`
                  })
                  goBack()
                } catch (e) {
                  Message({
                    type: 'error',
                    message: `${e.graphQLErrors[0].message}`
                  })
                }
              } else {
                console.log('Validation error')
              }
            })
          }}
        >
          Submit
        </Button>
      )}
    </Mutation>
  )
}
