import * as actionTypes from '../constants/actionTypes'

const uiState = (state = {}, action) => {
  switch (action.type) {
    case actionTypes.REQUEST_RATES:
      return {loading: true}
    case actionTypes.RECIEVE_RATES:
      return {}
    case actionTypes.ERROR_RATES:
      return {error: action.error}
    default:
      return state
  }
}

export default uiState

/*
* Selectors
*/

export const getLoading = state => state.loading || false
export const getError = state => state.error
