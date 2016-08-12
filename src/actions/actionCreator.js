import * as actionTypes from '../constants/actionTypes'
import getTerms, {defaultFuture} from '../helpers/terms'
import {round} from '../helpers/core'

export const changeCircleCoord = (y) => ({type: actionTypes.CHANGE_CIRCLE_COORD, y:y})

export const startExRateChanging = (id, x) => ({type: actionTypes.START_EXCHANGE_RATE_CHANGING, id: id, x: x})

export const stopExRateChanging = () => ({type: actionTypes.STOP_EXCHANGE_RATE_CHANGING})

export const changeCurrencyAmount = (currencyId, newAmount) => ({type: actionTypes.CHANGE_CURRENCY_AMOUNT, currencyId, newAmount})

export const changeInvestRate = (currencyId, newInvestRate) => ({type: actionTypes.CHANGE_CURRENCY_INVEST_RATE, currencyId, newInvestRate})

export const addCurrency = (currencyInfo) => ({type: actionTypes.ADD_CURRENCY, currencyInfo})

export const changeExchangeRate = (currencyId, term, newRate) => ({type: actionTypes.CHANGE_CURRENCY_EXCHANGE_RATE, currencyId, term, newRate})

export const setState = state => ({type: actionTypes.SET_STATE, state})

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
