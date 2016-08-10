import actionTypes from '../constants/actionTypes'
import { round } from '../brain/core'

const result = (state, action) => {
  const {currencyId, termId} = action
  if ((currencyId && currencyId !== state.currencyId) || (termId && termId !== state.termId)) {
    return state
  }

  switch (action.type) {
    case actionTypes.CHANGE_CURRENCY_AMOUNT:
      return changeCurrencyAmount(state, action)
    case actionTypes.CHANGE_CURRENCY_EXCHANGE_RATE:
      return changeCurrencyExchangeRate(state, action)
    case actionTypes.CHANGE_CURRENCY_INVEST_RATE:
      return changeInvestRate(state, action)
    case actionTypes.CHANGE_USE_INVEST:
      return changeUseInvest(state, action)
    default:
      state
  }
}

export default result

const calcResult = ({initialAmount, exchangeRate, investRate}, useInvest) => {
  return round(initialAmount*(useInvest ? 1+(investRate/100) : 1)*exchangeRate, 2)
}

const changeCurrencyAmount = (state, {newAmount, useInvest = false}) => {
  const nextState = {...state}
  nextState.initialAmount = newAmount
  nextState.resultInUserCurrency = calcResult(nextState, useInvest)
  return nextState
}

const changeCurrencyExchangeRate = (state, {newRate, useInvest = false}) => {
  const nextState = {...state}
  nextState.exchangeRate = newRate
  nextState.resultInUserCurrency = calcResult(nextState, useInvest)
  return nextState
}

const changeInvestRate = (state, {newInvestRate, rateMultMap, useInvest}) => {
  const nextState = {...state}
  nextState.investRate = round(newInvestRate*rateMultMap[nextState.termId],2)
  nextState.resultInUserCurrency = calcResult(nextState, useInvest)
  return nextState
}

const changeUseInvest = (state, {useInvest}) => {
  const nextState = {...state}
  nextState.resultInUserCurrency = calcResult(nextState, useInvest)
  return nextState
}
