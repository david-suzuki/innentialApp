import React, { useState } from 'react'
import { Button, Select, Dialog, Notification } from 'element-react'
import { captureFilteredError } from '../general'
import Autosuggest from 'react-autosuggest'
import { Mutation } from 'react-apollo'
import {
  addNewMember,
  fetchTeamDetails,
  fetchNonUserTeamsInOrganization
} from '../../api'
import BodyPortal from '../ui-components/BodyPortal'

export default ({ userTeams, allTeams, email, _id }) => {
  if (allTeams.length === userTeams.length || allTeams.length === 0 || !email) {
    return null
  }

  const [selectedTeam, setSelectedTeam] = useState('')
  const [isActive, setActive] = useState(false)
  const [inputValue, setInputValue] = useState('')
  const [suggestions, setSuggestions] = useState([])

  const filteredTeams = allTeams.filter(
    team => !userTeams.some(({ teamName }) => team.teamName === teamName)
  )

  const selectOptions = filteredTeams.map(team => (
    <Select.Option value={team._id} label={team.teamName} key={team._id} />
  ))

  const autosuggestProps = {
    suggestions,
    onSuggestionsFetchRequested: ({ value }) => {
      const newSuggestions = filteredTeams.filter(
        ({ teamName }) =>
          teamName && teamName.toLowerCase().indexOf(value.toLowerCase()) !== -1
      )
      setSuggestions(newSuggestions)
    },
    onSuggestionsClearRequested: () => setSuggestions([]),
    onSuggestionSelected: (e, { suggestion: { _id } }) => {
      setSelectedTeam(_id)
    },
    getSuggestionValue: ({ teamName }) => teamName,
    renderSuggestion: ({ teamName }) => <div>{teamName}</div>,
    inputProps: {
      value: inputValue,
      placeholder: `...or start typing to view suggestions`,
      onChange: (e, { newValue }) => setInputValue(newValue)
    }
  }

  return (
    <div>
      <Button type='primary' onClick={() => setActive(true)}>
        Add to team
      </Button>
      <BodyPortal>
        <Dialog
          visible={isActive}
          onCancel={() => {
            setSelectedTeam('')
            setActive(false)
            setInputValue('')
            setSuggestions([])
          }}
        >
          <Dialog.Body>
            <p className='share-content__title'>Add user to a team</p>
            <div className='select-autosuggest-in-modal'>
              <Select
                value={selectedTeam}
                onChange={value => setSelectedTeam(value)}
                placeholder='Pick a team...'
              >
                {selectOptions}
              </Select>
              <Autosuggest {...autosuggestProps} />
            </div>
          </Dialog.Body>
          <Dialog.Footer>
            <Mutation
              mutation={addNewMember}
              update={cache => {
                Object.keys(cache.data.data).forEach(
                  key => key.match(/^TeamMembers/) && cache.data.delete(key)
                )
              }}
              refetchQueries={[
                {
                  query: fetchTeamDetails,
                  variables: {
                    teamId: selectedTeam
                  }
                },
                {
                  query: fetchNonUserTeamsInOrganization,
                  variables: {
                    userId: _id
                  }
                },
                'fetchEvaluationInfo',
                'fetchLatestTeamEvaluation',
                'fetchStatsOverviewData',
                'fetchStatsTeamsData',
                'fetchStatsGrowthData',
                'fetchUsersProfile'
              ]}
            >
              {(mutation, { loading }) => (
                <Button
                  type='primary'
                  disabled={selectedTeam.length === 0}
                  loading={loading}
                  onClick={() => {
                    if (selectedTeam && email) {
                      mutation({
                        variables: {
                          MemberInput: {
                            teamId: selectedTeam,
                            email
                          }
                        }
                      })
                        .then(({ data: { addNewMember: response } }) => {
                          if (response) {
                            Notification({
                              type: 'success',
                              message: 'Member successfully added',
                              duration: 2500,
                              offset: 90
                            })
                          } else {
                            Notification({
                              type: 'warning',
                              message: 'Something went wrong',
                              duration: 2500,
                              offset: 90
                            })
                          }
                        })
                        .catch(err => {
                          captureFilteredError(err)
                          Notification({
                            type: 'warning',
                            message: 'Something went wrong',
                            duration: 2500,
                            offset: 90
                          })
                        })
                      setSelectedTeam('')
                      setActive(false)
                      setInputValue('')
                      setSuggestions([])
                    }
                  }}
                >
                  Add
                </Button>
              )}
            </Mutation>
          </Dialog.Footer>
        </Dialog>
      </BodyPortal>
    </div>
  )
}
