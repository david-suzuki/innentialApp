import React from 'react'
import { Button, Message } from 'element-react'
import { Mutation } from 'react-apollo'
import { addSkill, addSkillForOrganization } from '../../../api'

export const SubmitButton = ({
  formRef,
  handleOnSubmitSuccess,
  form,
  organizationId
}) => {
  if (organizationId) {
    return (
      <Mutation
        mutation={addSkillForOrganization}
        refetchQueries={['fetchAllSkills', 'fetchOrganizationSkillsForAdmin']}
      >
        {addSkillForOrganization => (
          <Button
            type='primary'
            onClick={e => {
              e.preventDefault()
              formRef.current.validate(async valid => {
                if (valid) {
                  const skillData = {
                    ...form
                  }
                  try {
                    await addSkillForOrganization({
                      variables: {
                        skillData,
                        organizationId: organizationId
                      }
                    })
                    Message({
                      type: 'success',
                      message: `Successfully added!`
                    })
                    handleOnSubmitSuccess()
                  } catch (e) {
                    Message({
                      type: 'error',
                      message: `${e}`
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
  } else {
    return (
      <Mutation
        mutation={addSkill}
        refetchQueries={['fetchAllSkills', 'fetchRegularSkills']}
      >
        {addSkill => (
          <Button
            type='primary'
            onClick={e => {
              e.preventDefault()
              formRef.current.validate(async valid => {
                if (valid) {
                  const skillData = {
                    ...form
                  }
                  try {
                    await addSkill({
                      variables: { skillData }
                    })
                    Message({
                      type: 'success',
                      message: `Successfully added!`
                    })
                    handleOnSubmitSuccess()
                  } catch (e) {
                    Message({
                      type: 'error',
                      message: `${e}`
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
}
