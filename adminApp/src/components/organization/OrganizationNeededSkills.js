import React, { useRef, useState } from 'react'
import { Query, Mutation, ApolloConsumer } from 'react-apollo'
import {
  Layout,
  Table,
  Button,
  Loading,
  Message,
  MessageBox
} from 'element-react'
import { Link } from 'react-router-dom'
import {
  fetchOrganizationSkillsForAdmin,
  disableNeededSkillsForOrganization,
  enableNeededSkillsForOrganization,
  fetchSkillDeleteInfo
} from '../../api'
import { localizedTime } from '../general/utilities'

const transformedSkills = (data, disabledNeededSkills = []) => {
  const newData = JSON.parse(JSON.stringify(data))
  const disabledNeededSkillsIds = disabledNeededSkills.map(item => item._id)
  const enabledForOrganization = newData.filter(skill => skill.enabled)
  return enabledForOrganization.map(skill => {
    if (disabledNeededSkillsIds.includes(skill._id)) {
      skill.enabled = false
    } else {
      skill.enabled = true
    }
    return skill
  })
}

const listColumns = urlextension => [
  {
    type: 'selection'
  },
  {
    label: 'Date',
    width: '160px',
    render: row => {
      return localizedTime(row.createdAt)
    }
  },
  {
    label: 'Category',
    prop: 'category',
    sortable: true
  },
  {
    label: 'Name',
    prop: 'name',
    sortable: true
  },
  {
    label: 'Enabled',
    render: ({ enabled }) => {
      if (enabled) return 'True'
      else return 'False'
    },
    sortable: true,
    sortMethod: ({ enabled }) => {
      return enabled
    }
  },
  {
    label: 'Operations',
    width: '400px',
    render: ({ _id }) => (
      <div>
        <Link to={`${urlextension}/add-content/${_id}`}>
          <Button type='info' size='small'>
            Add content
          </Button>
        </Link>
      </div>
    )
  }
]

let selectedSkills = []

const checkSkillsDeleteInfo = async (client, selectedSkills) => {
  const checks = []
  selectedSkills.forEach(skill => {
    checks.push(
      client.query({
        query: fetchSkillDeleteInfo,
        variables: { skillId: skill._id }
      })
    )
  })
  const checksReturned = await Promise.all(checks)
  checksReturned
    .map(item => item.data.fetchSkillDeleteInfo)
    .filter(item => !!item)
  if (checksReturned.length > 0) {
    return checksReturned.map(item => item.data.fetchSkillDeleteInfo)
  }
  return []
}

const deleteConfirm = async (
  selectedSkills,
  disableNeededSkillsForOrganization,
  organization,
  tableRef
) => {
  if (selectedSkills.length > 0) {
    try {
      await disableNeededSkillsForOrganization({
        variables: {
          skills: selectedSkills,
          organizationId: organization._id
        }
      })
      Message({
        type: 'success',
        message: 'Skills disabled'
      })
      tableRef.current.clearSelection()
    } catch (e) {
      Message({
        type: 'error',
        message: `${e}`
      })
    }
  }
}

const OrganizationNeededSkills = ({ organization, urlextension }) => {
  const [currentData, setCurrentData] = useState([])
  const tableRef = useRef(null)
  const handleSelection = selection => {
    const newSkills = selection.map(skill => ({
      _id: skill._id,
      name: skill.name
    }))
    selectedSkills = [...newSkills] // using state with table library blocks rows selection
  }

  return (
    <Query
      query={fetchOrganizationSkillsForAdmin}
      variables={{ organizationId: organization._id }}
    >
      {({ loading, error, data }) => {
        if (loading) return 'Loading...'
        if (error) return `Error! ${error.message}`
        const dataForTable =
          currentData.length !== 0
            ? currentData
            : transformedSkills(
                data.fetchOrganizationSkillsForAdmin,
                organization.disabledNeededSkills
              )
        return (
          <React.Fragment>
            <Layout.Row>
              <span
                style={{ display: 'flex', marginBottom: '20px', float: 'left' }}
              >
                <Mutation
                  mutation={disableNeededSkillsForOrganization}
                  onCompleted={mutationData => {
                    setCurrentData(
                      transformedSkills(
                        data.fetchOrganizationSkillsForAdmin,
                        mutationData.disableNeededSkillsForOrganization
                      )
                    )
                  }}
                >
                  {(disableNeededSkillsForOrganization, { loading }) => {
                    if (loading) return <Loading fullscreen />
                    return (
                      <ApolloConsumer>
                        {client => (
                          <Button
                            style={{
                              marginRight: '15px'
                            }}
                            type='primary'
                            onClick={async e => {
                              e.preventDefault()
                              const checkDeleted = await checkSkillsDeleteInfo(
                                client,
                                selectedSkills
                              )
                              if (checkDeleted.length > 0) {
                                MessageBox.confirm(
                                  `Some of the skills have users who will have this skill removed from profile. Are you sure?`,
                                  {
                                    title: '',
                                    confirmButtonText: 'OK',
                                    cancelButtonText: 'Cancel',
                                    type: 'warning'
                                  }
                                )
                                  .then(() => {
                                    deleteConfirm(
                                      selectedSkills,
                                      disableNeededSkillsForOrganization,
                                      organization,
                                      tableRef
                                    )
                                  })
                                  .catch(e => {
                                    console.log(e)
                                  })
                              }
                            }}
                          >
                            Disable Selected
                          </Button>
                        )}
                      </ApolloConsumer>
                    )
                  }}
                </Mutation>
                <Mutation mutation={enableNeededSkillsForOrganization}>
                  {(enableNeededSkillsForOrganization, { loading }) => {
                    if (loading) return <Loading fullscreen />
                    return (
                      <Button
                        style={{
                          marginRight: '15px'
                        }}
                        type='primary'
                        onClick={async e => {
                          e.preventDefault()
                          if (selectedSkills.length > 0) {
                            try {
                              await enableNeededSkillsForOrganization({
                                variables: {
                                  skills: selectedSkills,
                                  organizationId: organization._id
                                }
                              })
                              Message({
                                type: 'success',
                                message: 'Skills enabled'
                              })
                              tableRef.current.clearSelection()
                            } catch (e) {
                              Message({
                                type: 'error',
                                message: `${e}`
                              })
                            }
                          }
                        }}
                      >
                        Enable Selected
                      </Button>
                    )
                  }}
                </Mutation>
              </span>
            </Layout.Row>
            <Table
              ref={tableRef}
              style={{ width: '100%' }}
              columns={listColumns(urlextension)}
              data={dataForTable}
              stripe
              onSelectChange={selection => handleSelection(selection)}
              onSelectAll={selection => handleSelection(selection)}
            />
          </React.Fragment>
        )
      }}
    </Query>
  )
}

export default OrganizationNeededSkills
