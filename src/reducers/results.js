import actionTypes from '../constants/actionTypes'
import resultReducer from './result'

const results = (state = [], action) => {
  switch (action.type) {
    case actionTypes.CHANGE_USE_INVEST:
    case actionTypes.CHANGE_CURRENCY_AMOUNT:
    case actionTypes.CHANGE_CURRENCY_INVEST_RATE:
    case actionTypes.CHANGE_CURRENCY_EXCHANGE_RATE:
    case actionTypes.CHANGE_USER_CURRENCY:
      return state.map(result => resultReducer(result, action))
    default:
      state
  }
}

export default results

export const getD3StackInput = (state) => {
  const temp = {}
  state.forEach(item => {
    if (!temp[item.termId]) {
      temp[item.termId] = {term: item.termId}
    }
    temp[item.termId][item.currencyId]=item.resultInUserCurrency
  })
  const result = []
  Object.keys(temp).forEach(key => result.push(temp[key]))
  return result
}
