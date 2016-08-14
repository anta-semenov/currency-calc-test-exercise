import {SET_STATE, CHANGE_CURRENCY_EXCHANGE_RATE, ADD_CURRENCY} from '../../constants/actionTypes'

const future = (state = {}, action) => {
  switch (action.type) {
    case SET_STATE:
      return action.state.exchangeRates ? action.state.exchangeRates.future || state : state
    case CHANGE_CURRENCY_EXCHANGE_RATE:
      return changeExchangeRate(state, action)
    case ADD_CURRENCY:
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
