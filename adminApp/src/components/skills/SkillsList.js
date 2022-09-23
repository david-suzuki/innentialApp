import React, { Component } from 'react'
import {
  Layout,
  Table,
  Button,
  Loading,
  Message,
  MessageBox
} from 'element-react'
import { localizedTime } from '../general/utilities'
import {
  fetchAllSkills as SkillQuery,
  disableSelectedSkills,
  enableSelectedSkills,
  fetchSkillDeleteInfo,
  removeSkill
  // getUdemyCoursesForIDs
} from '../../api'
import { Query, Mutation } from 'react-apollo'
import { Link } from 'react-router-dom'
import { SkillsAdd } from './'
import { AddSkillsFramework } from '../frameworks'

const handleDeletingSkill = (mutation, client, skillId) => {
  client
    .query({
      query: fetchSkillDeleteInfo,
      variables: { skillId }
    })
    .then(res => {
      const msg = res.data.fetchSkillDeleteInfo
      if (msg === '') {
        // during the check nothing else contained this skill
        MessageBox.confirm(
          'Skill is not being used anywhere else, press ok to continue with deletion',
          'Warning',
          {
            confirmButtonText: 'OK',
            cancelButtonText: 'Cancel',
            type: 'warning'
          }
        )
          .then(() => {
            mutation()
              .then(res => {
                Message({
                  type: 'success',
                  message: `Skill ${res.data.removeSkill} was removed`
                })
              })
              .catch(e => {
                Message({
                  type: 'error',
                  message: 'Something went wrong'
                })
              })
          })
          .catch(() => {
            Message({
              type: 'info',
              message: 'Delete canceled'
            })
          })
      } else {
        MessageBox.confirm(msg, 'Warning', {
          confirmButtonText: 'OK',
          cancelButtonText: 'Cancel',
          type: 'warning'
        })
      }
    })
    .catch(e => console.log(e))
}

const listColumns = [
  {
    type: 'selection'
  },
  {
    label: 'Last updated',
    render: ({ updatedAt }) => {
      return localizedTime(updatedAt)
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
    label: 'Organization specific?',
    render: ({ organizationSpecific }) => {
      if (organizationSpecific) return 'Yes'
      else return 'No'
    }
  },
  {
    label: 'Operations',
    width: 300,
    render: ({ _id, frameworkId }) => (
      <div>
        {frameworkId && (
          <Link
            to={{
              pathname: `/frameworks/${frameworkId}/edit`
            }}
          >
            <Button type='info' size='small' style={{ marginRight: 10 }}>
              Edit Framework
            </Button>
          </Link>
        )}
        <Link to={`skills/${_id}/edit`}>
          <Button type='primary' size='small'>
            Edit
          </Button>
        </Link>
        <Mutation
          mutation={removeSkill}
          variables={{ skillId: _id }}
          refetchQueries={[
            'fetchAllSkills',
            'fetchOrganizationSpecificSkills',
            'fetchOrganizationSkillsForAdmin'
          ]}
        >
          {(removeSkill, { client }) => {
            return (
              <Button
                type='danger'
                size='small'
                onClick={e => {
                  e.preventDefault()
                  handleDeletingSkill(removeSkill, client, _id)
                }}
                style={{ marginLeft: 10 }}
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

export default class SkillsList extends Component {
  state = {
    coursesDownloading: false,
    skillIDs: []
  }

  table = React.createRef()

  handleSelection = selection => {
    const newSkillIDs = selection.map(skill => skill._id)
    this.setState({
      skillIDs: newSkillIDs
    })
  }

  render() {
    return (
      <React.Fragment>
        <Layout.Row>
          <span
            style={{ display: 'flex', marginBottom: '20px', float: 'left' }}
          >
            {/* <Mutation mutation={getUdemyCoursesForIDs}>
              {getUdemyCoursesForIDs => {
                return (
                  <Button
                    style={{
                      marginRight: '15px'
                    }}
                    type="primary"
                    onClick={async e => {
                      const { skillIDs } = this.state
                      e.preventDefault()
                      if (skillIDs.length > 0) {
                        try {
                          Message({
                            type: 'success',
                            message: 'Udemy download started'
                          })
                          getUdemyCoursesForIDs({
                            variables: { skillIds: skillIDs }
                          })
                          this.table.current.clearSelection()
                        } catch (e) {
                          Message({
                            type: 'error',
                            message: `${e.graphQLErrors[0].message}`
                          })
                        }
                      }
                    }}
                  >
                    Get Udemy courses for selected skills
                  </Button>
                )
              }}
            </Mutation> */}
            <Mutation
              mutation={disableSelectedSkills}
              refetchQueries={[
                'fetchRegularSkills',
                'fetchOrganizationSpecificSkills',
                'fetchOrganizationSkillsForAdmin'
              ]}
            >
              {(disableSelectedSkills, { loading }) => {
                if (loading) return <Loading fullscreen />
                return (
                  <Button
                    style={{
                      marginLeft: '0px',
                      marginRight: '15px'
                    }}
                    type='primary'
                    onClick={async e => {
                      const { skillIDs } = this.state
                      e.preventDefault()
                      if (skillIDs.length > 0) {
                        try {
                          await disableSelectedSkills({
                            variables: { skillIDs }
                          })
                          Message({
                            type: 'success',
                            message: 'Skills disabled'
                          })
                          this.table.current.clearSelection()
                        } catch (e) {
                          Message({
                            type: 'error',
                            message: `${e.graphQLErrors[0].message}`
                          })
                        }
                      }
                    }}
                  >
                    Disable Selected
                  </Button>
                )
              }}
            </Mutation>
            <Mutation
              mutation={enableSelectedSkills}
              refetchQueries={[
                'fetchRegularSkills',
                'fetchOrganizationSpecificSkills',
                'fetchOrganizationSkillsForAdmin'
              ]}
            >
              {(enableSelectedSkills, { loading }) => {
                if (loading) return <Loading fullscreen />
                return (
                  <Button
                    style={{
                      marginLeft: '0px',
                      marginRight: '15px'
                    }}
                    type='primary'
                    onClick={async e => {
                      const { skillIDs } = this.state
                      e.preventDefault()
                      if (skillIDs.length > 0) {
                        try {
                          await enableSelectedSkills({
                            variables: { skillIDs }
                          })
                          Message({
                            type: 'success',
                            message: 'Skills enabled'
                          })
                          this.table.current.clearSelection()
                        } catch (e) {
                          Message({
                            type: 'error',
                            message: `${e.graphQLErrors[0].message}`
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
            <SkillsAdd />
            <AddSkillsFramework forSkills />
          </span>
        </Layout.Row>
        <Layout.Row>
          <Layout.Col span='24'>
            <Query query={SkillQuery}>
              {({ loading, error, data }) => {
                if (loading) return 'Loading...'
                if (error) return `Error! ${error.message}`
                return (
                  <Table
                    ref={this.table}
                    labelWidth='120'
                    style={{ width: '100%' }}
                    columns={listColumns}
                    data={data.fetchAllSkills}
                    stripe
                    onSelectChange={selection =>
                      this.handleSelection(selection)
                    }
                    onSelectAll={selection => this.handleSelection(selection)}
                  />
                )
              }}
            </Query>
          </Layout.Col>
        </Layout.Row>
      </React.Fragment>
    )
  }
}
