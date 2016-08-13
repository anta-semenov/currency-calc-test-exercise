/*global Promise*/
import * as actionTypes from '../constants/actionTypes'
import getTerms, {defaultFuture} from '../helpers/terms'
import {round} from '../helpers/core'
import getExchangeRate from '../helpers/exchangeRatesApi'

export const changeCircleCoord = (y) => ({type: actionTypes.CHANGE_CIRCLE_COORD, y:y})

export const startExRateChanging = (id, x) => ({type: actionTypes.START_EXCHANGE_RATE_CHANGING, id: id, x: x})

export const stopExRateChanging = () => ({type: actionTypes.STOP_EXCHANGE_RATE_CHANGING})

export const changeCurrencyAmount = (currencyId, newAmount) => ({type: actionTypes.CHANGE_CURRENCY_AMOUNT, currencyId, newAmount})

export const changeInvestRate = (currencyId, newInvestRate) => ({type: actionTypes.CHANGE_CURRENCY_INVEST_RATE, currencyId, newInvestRate})

export const addCurrency = (currencyInfo) => ({type: actionTypes.ADD_CURRENCY, currencyInfo})

export const changeExchangeRate = (currencyId, term, newRate) => ({type: actionTypes.CHANGE_CURRENCY_EXCHANGE_RATE, currencyId, term, newRate})

export const setState = state => ({type: actionTypes.SET_STATE, state})

export const initStart = () => ({type: actionTypes.REQUEST_RATES})
export const initSuccess = () => ({type: actionTypes.RECIEVE_RATES})
export const initError = (error) => ({type: actionTypes.ERROR_RATES, error})

/*
* Thunks
*/

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

//Initialize past exchange rates
export const initPastExchangeRates = (pastTerms, currentTerm, currencies, baseCurrency) => dispatch => {
  const pastRequest = pastTerms.map(term =>
    new Promise(resolve => {
      getExchangeRate(term, currencies, baseCurrency, resolve)
    })
  )

  const currentRequest = new Promise(resolve => getExchangeRate(currentTerm, currencies, baseCurrency, resolve))

  Promise.all([...pastRequest, currentRequest]).then(
    response => {
      const past = {}
      response.forEach(exchangeRateResult => {
        exchangeRateResult.forEach(currencyRate => {
          //fullfill past rates
          past['' + currencyRate.term + currencyRate.currency] = {
            term: currencyRate.term,
            currencyId: currencyRate.currency,
            rate: currencyRate.rate,
            isInitial: currencyRate.term === currentTerm ? true : undefined
          }
        })
      })
      dispatch(setState({exchangeRates: {past}}))
    },
    error => {
      dispatch(initError(error))
    }
  )
}

//Initialize future exchange rates
//We can have future rates from load state, so when we have it we need just change terms
export const initFutureExchangeRates = (futureTerms, currentRates) => dispatch => {
  const future = {}
  const currenciesIds = Object.keys(currentRates)
  futureTerms.forEach((term, index) => {
    currenciesIds.forEach(currencyId => {
      future['' + term + currencyId] = {
        term,
        currencyId,
        rate: round(currentRates[currencyId].rate*(1+0.05*(index+1)), 4)
      }
    })
  })
  dispatch(setState({exchangeRates: {future}}))
}
