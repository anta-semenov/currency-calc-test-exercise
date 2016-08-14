import * as actionTypes from '../constants/actionTypes'
import {createSelector} from 'reselect'
import mapValues from 'lodash/mapValues'

const initialState = {
  RUB: {
    id: 'RUB',
    label: '₽',
    initialAmount: 0,
    investRate: 0,
    isUserCurrency: true
  },
  USD: {
    id: 'USD',
    label: '$',
    initialAmount: 0,
    investRate: 0
  },
  EUR: {
    id: 'EUR',
    label: '€',
    initialAmount: 0,
    investRate: 0
  }
}

const currencies = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.CHANGE_CURRENCY_AMOUNT:
      return changeAmount(state, action)
    case actionTypes.CHANGE_CURRENCY_INVEST_RATE:
      return changeInvestRate(state, action)
    case actionTypes.ADD_CURRENCY:
      return {...state, [action.currencyInfo.id]: action.currencyInfo}
    case actionTypes.SET_STATE:
      return action.state.currencies || state
    case actionTypes.CHANGE_USER_CURRENCY:
      return changeUserCurrency(state, action.newUserCurrencyId)
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

const changeUserCurrency = (state, newUserCurrencyId) => mapValues(
  state,
  (item, key) => {
    const newItem = {...item}
    if (key === newUserCurrencyId) {
      newItem.isUserCurrency = true
    } else {
      delete newItem.isUserCurrency
    }
    return newItem
  }
)

export const getCurrenciesIds = state => Object.keys(state)
export const getCurrencies = state => state
export const getUserCurrency = createSelector(
  state => state,
  currencies => Object.keys(currencies).find(key => currencies[key].isUserCurrency)
)
