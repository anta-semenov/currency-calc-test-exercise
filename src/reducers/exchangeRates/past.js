import * as actionTypes from '../../constants/actionTypes'
import {createSelector} from 'reselect'
import round from 'lodash/round'
import mapValues from 'lodash/mapValues'
import omitBy from 'lodash/omitBy'

const past = (state = {}, action) => {
  switch (action.type) {
    case actionTypes.SET_STATE:
      return action.state.exchangeRates ? action.state.exchangeRates.past || state : state
    case actionTypes.ADD_CURRENCY:
      return {...state, ...action.pastExchangeRates}
    case actionTypes.CHANGE_USER_CURRENCY:
      return changeUserCurrency(state, action)
    case actionTypes.REMOVE_CURRENCY:
      return omitBy(state, value => value.currencyId === action.currencyId)
    default:
      return state
  }
}

export default past

export const changeUserCurrency = (state, {newUserCurrency, termsRatesRatio}) => mapValues(
  state,
  value => {
    const newItem = {...value}
    newItem.rate = newItem.currencyId === newUserCurrency.currencyId ? 1 : round(termsRatesRatio[newItem.term]*newItem.rate, 4)
    return newItem
  }
)

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
