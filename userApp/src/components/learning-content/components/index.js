import Container from '../../../globalState'

export { default as ContentEditRoute, ContentEdit } from './ContentEdit'
export { default as ContentUpload } from './ContentUpload'
export { default as UploadManager } from './UploadManager'
export { default as FileContentUpload } from './FileContentUpload'
export { Filters, FiltersMobile } from './filters'

export const HandleGlobalState = ({ children }) => {
  const { setFrameworkState } = Container.useContainer()
  return children(setFrameworkState)
}

export const autoSuggestTheme = {
  container: 'react-autosuggest__container',
  containerOpen: 'react-autosuggest__container--open',
  input: 'react-autosuggest__input',
  inputOpen: 'react-autosuggest__input--open',
  inputFocused: 'react-autosuggest__input--focused',
  suggestionsContainer: 'react-autosuggest__suggestions-container',
  suggestionsContainerOpen: 'react-autosuggest__suggestions-container--open',
  suggestionsList: 'list-skill-selector__results__skills',
  suggestion: 'list-skill-selector__results__skills__item',
  suggestionFirst: 'list-skill-selector__results__skills__item',
  suggestionHighlighted:
    'list-skill-selector__results__skills__item--highlighted',
  sectionContainer: 'react-autosuggest__section-container',
  sectionContainerFirst: 'react-autosuggest__section-container--first',
  sectionTitle: 'react-autosuggest__section-title'
}
