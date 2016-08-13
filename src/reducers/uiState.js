import * as actionTypes from '../constants/actionTypes'

const uiState = (state = {}, action) => {
  switch (action.type) {
    case actionTypes.INIT_START:
      return {loading: true}
    case actionTypes.INIT_SUCCESS:
      return {}
    case actionTypes.INIT_ERROR:
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
