import * as actionTypes from '../../constants/actionTypes'
import {changeUserCurrency} from './past'

const future = (state = {}, action) => {
  switch (action.type) {
    case actionTypes.SET_STATE:
      return action.state.exchangeRates ? action.state.exchangeRates.future || state : state
    case actionTypes.CHANGE_CURRENCY_EXCHANGE_RATE:
      return changeExchangeRate(state, action)
    case actionTypes.CHANGE_USER_CURRENCY:
        return changeUserCurrency(state, action)
    case actionTypes.ADD_CURRENCY:
      return {...state, ...action.futureExchangeRates}
    default:
      return state
  }
}

export default future

const changeExchangeRate = (state, {currencyId, term, newRate}) => {
  const nextState = {...state}
  nextState['' + term + currencyId].rate = newRate
  return nextState
}
