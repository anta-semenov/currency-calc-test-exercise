import * as actionTypes from '../constants/actionTypes'

const reducer = (state = {}, action) => {
  switch (action.type) {
    case actionTypes.CHANGE_CURRENCY_AMOUNT:
      return changeAmount(state, action)
    default:
      state
  }
}

export default reducer

const changeAmount = (state, { currencyId, newAmount }) => {
  const nextState = {...state}
  nextState[currencyId].initialAmount = newAmount
  return nextState
}

export const currenciesIds = state => Object.keys(state)
export const currencies = state => state
