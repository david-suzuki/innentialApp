import React from 'react'
import { Mutation } from 'react-apollo'
import { Message, Button, Loading } from 'element-react'
import {
  addDemoOrganization,
  fetchAllOrganizations as OrganizationQuery
} from '../../../api'
import slug from 'slug'

const SubmitButtonDemo = ({
  form,
  data,
  handleReset,
  children,
  queryVariables
}) => (
  <Mutation
    mutation={addDemoOrganization}
    // refetchQueries={['fetchAllUsers', 'fetchAllOrganizations']}
    update={(cache, { data: { addDemoOrganization } }) => {
      const { fetchAllOrganizations } = cache.readQuery({
        query: OrganizationQuery,
        variables: queryVariables
      })
      cache.writeQuery({
        query: OrganizationQuery,
        data: {
          fetchAllOrganizations: [
            {
              ...addDemoOrganization,
              // employees: [],
              // teams: [],
              admins: addDemoOrganization.admins
                ? [...addDemoOrganization.admins]
                : [],
              isDemoOrganization: true
            },
            ...fetchAllOrganizations
          ]
        },
        variables: queryVariables
      })
    }}
  >
    {(addDemoOrganization, { loading }) => {
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
                  await addDemoOrganization({
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

export default SubmitButtonDemo
