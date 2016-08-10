import * as actionTypes from '../constants/actionTypes'

const reducer = (state = {}, action) => {
  switch (action.type) {
    case actionTypes.CHANGE_CURRENCY_AMOUNT:
      return changeAmount(state, action)
    case actionTypes.CHANGE_CURRENCY_INVEST_RATE:
      return changeInvestRate(state, action)
    case actionTypes.ADD_CURRENCY:
      return {...state, [action.currencyInfo.id]: action.currencyInfo}
    case actionTypes.SET_STATE:
      return action.state.currencies || state 
    default:
      return state
  }
}

export default reducer

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

export const currenciesIds = state => Object.keys(state)
export const currencies = state => state
