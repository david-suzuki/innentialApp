import React, { Component } from 'react'
import {
  Input,
  Form,
  Button,
  Notification /*, AutoComplete */
} from 'element-react'
import { FormDescription } from '../ui-components'
import { Mutation } from 'react-apollo'
import { renameTeam } from '../../api'
import { withRouter, Redirect } from 'react-router-dom'
import createTeamStyle from '../../styles/createTeamStyle'
import '../../styles/theme/notification.css'
import { captureFilteredError, LoadingSpinner } from '../general'

class RenameTeam extends Component {
  state = {
    teamName: ''
  }

  form = React.createRef()

  onChangeTeamName = value => {
    this.setState({ teamName: value })
  }

  goBack = () => {
    this.props.history.goBack()
  }

  render() {
    const { teamName } = this.state
    const state = this.props.location && this.props.location.state
    if (!state) {
      return <Redirect to={{ pathname: `/teams` }} />
    } else {
      const { teamId, oldName } = state
      return (
        <div className='component-block create-team'>
          <div className='create-team__heading'>
            <i
              className='icon icon-small-right'
              // nativetype="submit" THROWS ERRORS FOR WHATEVER REASON
              type='signin'
              size='large'
              onClick={e => {
                e.preventDefault()
                this.goBack()
              }}
            />
            <FormDescription label='Choose a new name for your team' />
          </div>
          <Form
            ref={this.form}
            model={this.state}
            onSubmit={e => e.preventDefault()}
          >
            <Form.Item label='Old name' prop='oldName'>
              <Input value={oldName} disabled />
            </Form.Item>
            <Form.Item
              label='New Name'
              prop='teamName'
              rules={{
                required: true,
                message: 'Please provide name of team',
                trigger: 'blur'
              }}
              className='component-block'
            >
              <Input
                value={teamName}
                onChange={value => this.onChangeTeamName(value)}
              />
            </Form.Item>
            <Mutation
              mutation={renameTeam}
              refetchQueries={[
                'fetchOpenAssessmentsForUser',
                'fetchEvaluationInfo',
                'fetchStatsOverviewData',
                'fetchOnboardedTeamsInOrganization'
              ]}
            >
              {(renameTeam, { loading }) => (
                <Button
                  // nativeType="submit"
                  loading={loading}
                  type='signin'
                  size='large'
                  className='el-button--green'
                  onClick={e => {
                    e.preventDefault()
                    this.form.current.validate(async valid => {
                      if (valid) {
                        renameTeam({
                          variables: {
                            teamId,
                            teamName
                          }
                        })
                          .then(() => {
                            Notification({
                              type: 'success',
                              message: 'Name change complete',
                              duration: 2500,
                              offset: 90
                            })

                            this.props.history.push(
                              this.props.isAdmin
                                ? '/organization/teams'
                                : '/teams'
                            )
                          })
                          .catch(e => {
                            captureFilteredError(e)
                            if (e.graphQLErrors && e.graphQLErrors[0]) {
                              Notification({
                                type: 'error',
                                message: `${e.graphQLErrors[0].message}`,
                                duration: 2500,
                                offset: 90,
                                iconClass: 'el-icon-error'
                              })
                            } else {
                              Notification({
                                type: 'error',
                                message: 'Something went wrong',
                                duration: 2500,
                                offset: 90,
                                iconClass: 'el-icon-error'
                              })
                            }
                          })
                      }
                    })
                  }}
                >
                  Rename
                </Button>
              )}
            </Mutation>
          </Form>
          <style jsx global>
            {createTeamStyle}
          </style>
        </div>
      )
    }
  }
}

export default withRouter(RenameTeam)
