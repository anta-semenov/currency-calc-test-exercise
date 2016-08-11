import {SET_STATE, CHANGE_CURRENCY_EXCHANGE_RATE} from '../../constants/actionTypes'

const future = (state = {}, action) => {
  switch (action.type) {
    case SET_STATE:
      return action.state.exchangeRates.future || state
    case CHANGE_CURRENCY_EXCHANGE_RATE:
      return changeExchangeRate(state, action)
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
