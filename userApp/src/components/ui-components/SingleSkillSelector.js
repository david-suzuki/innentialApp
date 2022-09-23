import React, { useState } from 'react'
import { Query } from 'react-apollo'
import { LoadingSpinner, captureFilteredError } from '../general'
import { fetchOrganizationSpecificSkills } from '../../api'
import { Statement } from './'
import listStyleSelectorStyle from '../../styles/listStyleSelectorStyle'
import Autosuggest from 'react-autosuggest'

const autoSuggestTheme = {
  container: 'react-autosuggest__container',
  containerOpen: 'react-autosuggest__container--open',
  input: 'react-autosuggest__input',
  inputOpen: 'react-autosuggest__input--open',
  inputFocused: 'react-autosuggest__input--focused',
  suggestionsContainer: 'react-autosuggest__suggestions-container',
  suggestionsContainerOpen: 'react-autosuggest__suggestions-container--open',
  suggestionsList:
    'list-skill-selector__results__skills list-skill-selector__results__skills--autosuggest',
  suggestion: 'list-skill-selector__results__skills__item',
  suggestionFirst: 'list-skill-selector__results__skills__item',
  suggestionHighlighted:
    'list-skill-selector__results__skills__item--highlighted',
  sectionContainer: 'react-autosuggest__section-container',
  sectionContainerFirst: 'react-autosuggest__section-container--first',
  sectionTitle: 'react-autosuggest__section-title'
}

const Suggestion = ({ name, category }) => {
  return (
    <>
      <span>
        <strong>{name}</strong>
        <span className='skill-name-category'>({category})</span>
      </span>
      <span>
        <i className='icon icon-small-add' />
      </span>
    </>
  )
}

export default ({ value, onChange, onSuggestionSelected }) => {
  const [suggestions, setSuggestions] = useState([])

  return (
    <>
      <Query query={fetchOrganizationSpecificSkills}>
        {({ data, loading, error }) => {
          if (loading) return <LoadingSpinner />
          if (error) {
            captureFilteredError(error)
            return <Statement content='Oops! Something went wrong' />
          }
          if (data) {
            const skillData = data.fetchOrganizationSpecificSkills

            return (
              <Autosuggest
                suggestions={suggestions}
                onSuggestionsFetchRequested={({ value }) => {
                  const filteredResults = skillData.filter(({ name }) => {
                    const regex = new RegExp(
                      `^${value.replace(/\W/g, '')}`,
                      'i'
                    )
                    if (regex.toString().split('/')[1] === '^') {
                      return false
                    } else return regex.test(name)
                  })
                  setSuggestions(filteredResults)
                }}
                onSuggestionsClearRequested={() => setSuggestions([])}
                onSuggestionSelected={onSuggestionSelected}
                getSuggestionValue={({ name }) => name}
                renderSuggestion={Suggestion}
                inputProps={{
                  value,
                  placeholder: `Start typing to view suggestions`,
                  onChange
                }}
                theme={{
                  ...autoSuggestTheme
                }}
              />
            )
          }
        }}
      </Query>
      <style jsx>{listStyleSelectorStyle}</style>
    </>
  )
}
