import React, { Component } from 'react'
import { Statement } from './'
import { Mutation, Query } from 'react-apollo'
import { fetchRoles, addRoleSuggestion, fetchRoleSuggestions } from '../../api'
import { captureFilteredError, LoadingSpinner } from '../general'
import Autosuggest from 'react-autosuggest'
import { removeDuplicates } from '../../utils'

class RoleSelector extends Component {
  state = {
    suggestions: [],
    suggestedRole: false
  }

  // AUTOSUGGEST METHODS

  handleRoleChange = (e, value) => {
    if (value === undefined) {
      captureFilteredError(`Undefined value in autosuggest component`)
    } else {
      const { newValue } = value
      this.props.onChange(newValue)
    }
  }

  onSuggestionsFetchRequested = ({ value }) => {
    const filteredResults = this.props.roleData.filter(
      this.filterResults(value)
    )
    if (
      filteredResults.length === 0 &&
      this.props.canSuggest &&
      !this.state.suggestedRole
    )
      filteredResults.push({
        title: value,
        label: '+ Add new role suggestion',
        handleClick: () => this.props.onRoleSuggest(value)
      })
    this.setState({
      suggestions: filteredResults
    })
  }

  onSuggestionsClearRequested = () => {
    this.setState({
      suggestions: []
    })
  }

  onSuggestionSelected = (event, { suggestion }) => {
    if (typeof suggestion.handleClick === 'function') {
      this.setState({ suggestedRole: true })
      suggestion.handleClick()
    } else {
      this.props.onRoleSelect({
        ...suggestion,
        coreSkills: suggestion.coreSkills.map(({ level, fullSkill }) => ({
          ...fullSkill,
          level
        })),
        secondarySkills: suggestion.secondarySkills.map(({ fullSkill }) => ({
          ...fullSkill
        }))
      })
    }
  }

  getSuggestionValue = ({ title }) => title

  renderSuggestion = ({ title, label }) => {
    return (
      <span>
        <strong>{label || title}</strong>
      </span>
    )
  }

  filterResults = queryString => {
    if (!queryString) return () => true
    const regex = new RegExp(
      `^${queryString.replace(/[!@#$%^&*(),.?":{}|<>\[\]]/g, '')}`,
      'i'
    )
    return ({ title }) => {
      if (regex.toString().split('/')[1] === '^') {
        return false
      } else return regex.test(title)
    }
  }

  render() {
    const { suggestions } = this.state
    const { value, placeholder } = this.props
    return (
      <Autosuggest
        suggestions={suggestions}
        onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
        onSuggestionsClearRequested={this.onSuggestionsClearRequested}
        onSuggestionSelected={this.onSuggestionSelected}
        getSuggestionValue={this.getSuggestionValue}
        renderSuggestion={this.renderSuggestion}
        alwaysRenderSuggestions
        inputProps={{
          value,
          placeholder: placeholder,
          onChange: this.handleRoleChange
        }}
      />
    )
  }
}

export default ({
  // organizationOnly = false,
  canSuggest = true,
  handleRoleChange,
  handleRoleSelect,
  handleRoleSuggest,
  value,
  placeholder = 'Type your role here to view suggestions',
  currentUserId,
  filterRoles = ({ userId, suggestion }) => {
    return !suggestion || userId === currentUserId
  }
}) => (
  <Query
    query={fetchRoles}
    // variables={{
    //   organizationOnly
    // }}
  >
    {({ data, loading, error }) => {
      if (loading) return <LoadingSpinner />
      if (error) {
        captureFilteredError(error)
        return <Statement content='Oops! Something went wrong' />
      }

      const roleData = data && data.fetchRoles
      return (
        <Mutation
          mutation={addRoleSuggestion}
          update={(cache, { data: { addRoleSuggestion: result } }) => {
            try {
              const { fetchRoleSuggestions: suggestions } = cache.readQuery({
                query: fetchRoleSuggestions
              })
              cache.writeQuery({
                query: fetchRoleSuggestions,
                data: {
                  fetchRoleSuggestions: removeDuplicates(
                    [...suggestions, result],
                    '_id'
                  )
                }
              })
            } catch (e) {}
          }}
        >
          {addRoleSuggestion => (
            <RoleSelector
              roleData={roleData.filter(filterRoles)}
              onChange={handleRoleChange}
              value={value}
              canSuggest={canSuggest}
              onRoleSuggest={title =>
                handleRoleSuggest(title, addRoleSuggestion)
              }
              onRoleSelect={handleRoleSelect}
              mutation={addRoleSuggestion}
              placeholder={placeholder}
            />
          )}
        </Mutation>
      )
    }}
  </Query>
)
