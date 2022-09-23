import { initialFilterState } from '.'

const reducer = (state, action) => {
  switch (action.type) {
    case 'ADD_FILTER':
      return {
        ...state,
        [action.key]: [...state[action.key], action.value]
      }
    case 'REMOVE_FILTER':
      return {
        ...state,
        [action.key]: state[action.key].filter(value =>
          action.value._id
            ? value._id !== action.value._id
            : value !== action.value
        )
      }
    case 'SET_FILTER':
      return {
        ...state,
        [action.key]: action.value
      }
    case 'CLEAR_FILTER':
      return {
        ...state,
        [action.key]: []
      }
    case 'CHANGE_LIMITS':
      return {
        ...state,
        priceRange: {
          ...action.value
        }
      }
    case 'CLEAR_FILTERS':
      return {
        ...initialFilterState
      }
    default:
      return state
  }
}

export default reducer
