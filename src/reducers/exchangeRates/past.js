import * as actionTypes from '../../constants/actionTypes'
import {createSelector} from 'reselect'

const past = (state = {}, action) => {
  switch (action.type) {
    case actionTypes.SET_STATE:
      return action.state.exchangeRates.past || state
    default:
      return state
  }
}

export default past

/*
* Selectors
*/

export const getInitialRates = createSelector(
  state => state,
  state => {
    const result = {}
    Object.keys(state).forEach(key => {
      if (state[key].isInitial) {
        result[state[key].currencyId] = state[key].rate
      }
    })
    return result
  }
)
