import * as actionTypes from '../constants/actionTypes'
import {createSelector} from 'reselect'
import omit from 'lodash/omit'

const currencies = (state = {}, action) => {
  switch (action.type) {
    case actionTypes.CHANGE_CURRENCY_AMOUNT:
      return changeAmount(state, action)
    case actionTypes.CHANGE_CURRENCY_INVEST_RATE:
      return changeInvestRate(state, action)
    case actionTypes.ADD_CURRENCY:
      return {...state, [action.currencyInfo.currencyId]: action.currencyInfo}
    case actionTypes.SET_STATE:
      return action.state.currencies || state
    case actionTypes.REMOVE_CURRENCY:
      return omit(state, action.currencyId)
    default:
      return state
  }
}

export default currencies

const changeAmount = (state, {currencyId, newAmount}) => {
  const nextState = {...state}
  nextState[currencyId].initialAmount = newAmount
  return nextState
}

const changeInvestRate = (state, {currencyId, newInvestRate}) => {
  const nextState = {...state}
  nextState[currencyId].investRate = newInvestRate
  return nextState
}

export const getCurrenciesIds = state => Object.keys(state)
export const getCurrencies = state => state

export const getCollors = createSelector(
  state => state,
  currencies => Object.keys(currencies).map(key => currencies[key].color)
)
