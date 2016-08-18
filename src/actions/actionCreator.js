import * as actionTypes from '../constants/actionTypes'
import getTerms, {defaultFuture} from '../helpers/terms'
import round from 'lodash/round'
import values from 'lodash/values'
import {getPastExchangeRates, getFutureExchangeRates} from '../helpers/exchangeRatesApi'

export const setState = state => ({type: actionTypes.SET_STATE, state})

export const changeCircleCoord = (y) => ({type: actionTypes.CHANGE_CIRCLE_COORD, y:y})
export const startExRateChanging = (id, x) => ({type: actionTypes.START_EXCHANGE_RATE_CHANGING, id: id, x: x})
export const stopExRateChanging = () => ({type: actionTypes.STOP_EXCHANGE_RATE_CHANGING})

export const changeCurrencyAmount = (currencyId, newAmount) => ({type: actionTypes.CHANGE_CURRENCY_AMOUNT, currencyId, newAmount})
export const changeInvestRate = (currencyId, newInvestRate) => ({type: actionTypes.CHANGE_CURRENCY_INVEST_RATE, currencyId, newInvestRate})
export const changeExchangeRate = (currencyId, term, newRate) => ({type: actionTypes.CHANGE_CURRENCY_EXCHANGE_RATE, currencyId, term, newRate})

export const requestRates = () => ({type: actionTypes.REQUEST_RATES})
export const recieveRates = () => ({type: actionTypes.RECIEVE_RATES})
export const errorRates = (error) => ({type: actionTypes.ERROR_RATES, error})

export const changeUseInvest = () => ({type: actionTypes.CHANGE_USE_INVEST})

//Initialize terms, calc invest rate multiplicators
export const initTerms = startDate => dispatch => {
  const pastTerms = getTerms(startDate, false, true).map(item => ({term: item}))

  const rateMultiplicatorDelta = round((1/12)*defaultFuture.monthInterval,2)
  const futureTerms = getTerms(startDate, defaultFuture).map((item, index) => ({
    term: item,
    investRateMultiplicator: (index+1)*rateMultiplicatorDelta
  }))

  dispatch(setState({terms: [
    ...pastTerms,
    {term: startDate, isInitial: true},
    ...futureTerms
  ]}))
}

//Initialize future exchange rates
//We can have future rates from load state, so when we have it we need just change terms
export const initFutureExchangeRates = (futureTerms, currentRates) => dispatch => {
  dispatch(setState({exchangeRates: {future: getFutureExchangeRates(futureTerms, currentRates)}}))
}

//Add currency
export const addCurrencyResult = (currencyInfo, pastExchangeRates, futureExchangeRates) => ({type: actionTypes.ADD_CURRENCY, currencyInfo, pastExchangeRates, futureExchangeRates})
export const addCurrency = (currency, baseCurrency, pastTerms, futureTerms, currentTerm) => dispatch => {
  const currencyInfo = {...currency, initialAmount: 0, investRate:0}
  getPastExchangeRates(pastTerms, currentTerm, [currency.currencyId], baseCurrency.currencyId).then(
    response => {
      dispatch(recieveRates())
      const currentRates = {
        [response[''+currentTerm+currency.currencyId].currencyId]: response[''+currentTerm+currency.currencyId].rate
      }
      dispatch(addCurrencyResult(
        currencyInfo,
        response,
        getFutureExchangeRates(futureTerms, currentRates)
      ))
    },
    error => {
      dispatch(errorRates(error))
      dispatch(addCurrencyResult(currencyInfo, {}, {}))
    }
  )
}

//Change user currency
export const changeUserCurrencyEnd = (newUserCurrency, termsRatesRatio) => ({type: actionTypes.CHANGE_USER_CURRENCY, newUserCurrency, termsRatesRatio})
export const changeUserCurrency = (newUserCurrency, userCurrency, pastTerms, futureTerms, currentTerm) => dispatch => {
  getPastExchangeRates(pastTerms, currentTerm, [userCurrency.currencyId], newUserCurrency.currencyId).then(
    response => {
      dispatch(recieveRates())
      const termsRatesRatio = {}
      values(response).forEach(item => {
        termsRatesRatio[item.term] = item.rate
        if (item.term === currentTerm) {
          futureTerms.forEach(term => {
            termsRatesRatio[term] = item.rate
          })
        }
      })
      dispatch(changeUserCurrencyEnd(newUserCurrency, termsRatesRatio))
    },
    error => {
      dispatch(error)
    }
  )
}
