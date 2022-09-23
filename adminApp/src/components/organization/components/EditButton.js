import React from 'react'
import { Mutation } from 'react-apollo'
import { Message, Button, Loading } from 'element-react'
import { editOrganization } from '../../../api'

const EditButton = ({ form, data, organizationId, children }) => (
  <Mutation mutation={editOrganization}>
    {(editOrganization, { loading }) => {
      if (loading) return <Loading fullscreen />
      return (
        <Button
          type='primary'
          onClick={e => {
            e.preventDefault()
            form.validate(async valid => {
              if (valid) {
                const parsedData = {
                  ...data,
                  _id: organizationId
                }
                try {
                  await editOrganization({
                    variables: {
                      OrganizationEditData: parsedData
                    }
                  })
                  Message({
                    type: 'success',
                    message: 'Organization is successfully updated'
                  })
                } catch (e) {
                  Message({
                    type: 'error',
                    message: `${e.graphQLErrors[0].message}`
                  })
                }
              } else {
                console.log('error submit!!')
                return false
              }
            })
          }}
        >
          {children}
        </Button>
      )
    }}
  </Mutation>
)

export default EditButton
