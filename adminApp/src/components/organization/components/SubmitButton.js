import React from 'react'
import { Mutation } from 'react-apollo'
import { Message, Button } from 'element-react'
import {
  addOrganization,
  fetchAllOrganizations as OrganizationQuery
} from '../../../api'
import slug from 'slug'

const SubmitButton = ({
  form,
  data,
  handleReset,
  children,
  queryVariables
}) => (
  <Mutation
    mutation={addOrganization}
    // refetchQueries={['fetchAllUsers', 'fetchAllOrganizations']}
    update={(cache, { data: { addOrganization } }) => {
      const { fetchAllOrganizations } = cache.readQuery({
        query: OrganizationQuery,
        variables: queryVariables
      })
      cache.writeQuery({
        query: OrganizationQuery,
        data: {
          fetchAllOrganizations: [
            {
              ...addOrganization,
              // employees: [],
              // teams: [],
              admins: addOrganization.admins ? [...addOrganization.admins] : []
            },
            ...fetchAllOrganizations
          ]
        },
        variables: queryVariables
      })
    }}
  >
    {(addOrganization, { loading }) => {
      // loading is not needed anymore because now the cache is updated first
      // if (loading) return <Loading fullscreen />
      return (
        <Button
          type='primary'
          onClick={e => {
            e.preventDefault()
            form.validate(async valid => {
              if (valid) {
                const admins =
                  data &&
                  data.admins.reduce((acc, curr) => {
                    if (!acc.includes(curr.value)) {
                      acc.push(curr.value)
                    }
                    return acc
                  }, [])

                const parsedData = {
                  ...data,
                  admins: admins.map(m => m.toLowerCase()),
                  slug: slug(data.organizationName, {
                    replacement: '_',
                    lower: true
                  })
                }
                try {
                  await addOrganization({
                    variables: {
                      OrganizationAddData: parsedData
                    }
                  })
                  Message({
                    type: 'success',
                    message: 'Organization is successfully added'
                  })
                  handleReset()
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

export default SubmitButton
