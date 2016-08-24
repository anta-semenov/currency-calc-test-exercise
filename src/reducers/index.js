import {combineReducers} from 'redux'
import currencies, * as fromCurrencies from './currencies'
import exchangeRates, * as fromExchangeRates from './exchangeRates'
import terms, * as fromTerms from './terms'
import uiState, * as fromUiState from './uiState'
import userCurrency from './userCurrency'
import useInvest from './useInvest'
import {createSelector} from 'reselect'
import round from 'lodash/round'

const reducer = combineReducers({
  currencies,
  exchangeRates,
  terms,
  uiState,
  userCurrency,
  useInvest
})

export default reducer

/*
* Selectors
*/

//Index selectors
export const getD3ResultGraphStackInput = state => {
  const temp = {}
  const currenciesIds = getCurrenciesIds(state)
  let maxValue = 0
  fromTerms.getTermsForResults(state.terms).forEach(termItem => {
    const {term, investRateMultiplicator} = termItem
    let sumValue = 0
    currenciesIds.forEach(currencyId => {
      if (!temp[term]) {
        temp[term] = {term}
      }
      const {initialAmount, investRate} = state.currencies[currencyId]
      const value = initialAmount*(getUseInvest(state) ? 1+(investRateMultiplicator*investRate)/100 : 1)*fromExchangeRates.getAllExchangeRates(state.exchangeRates)[''+term+currencyId].rate
      temp[term][currencyId] = value
      sumValue += value
    })
    maxValue = Math.max(maxValue, sumValue)
  })

  const result = []
  Object.keys(temp).forEach(key => result.push(temp[key]))
  return {maxValue, result}
}

//Use invest
export const getUseInvest = state => state.useInvest || false

//Terms
export const getResultTerms = state => fromTerms.getTermsForFuture(state.terms)
export const getPastTerms = state => fromTerms.getPastTerms(state.terms)
export const getCurrentTerm = state => fromTerms.getCurrentTerm(state.terms)
export const getTerms = state => state.terms

//Exchange rates
export const getCurrentRates = state => fromExchangeRates.getInitialRates(state.exchangeRates)
export const getFutureExchangeRates = state => fromExchangeRates.getFutureExchangeRates(state.exchangeRates)
export const getPastExchangeRates = state => fromExchangeRates.getPastExchangeRates(state.exchangeRates)
export const getAllExchangeRates = state => fromExchangeRates.getAllExchangeRates(state.exchangeRates)

//Currencies
export const getCurrenciesIds = state => fromCurrencies.getCurrenciesIds(state.currencies)
export const availableCurrencies = [
  {currencyId: 'RUB', label: '₽', color: '#376be0'},
  {currencyId: 'USD', label: '$', color: '#0d7c22'},
  {currencyId: 'EUR', label: '€', color: '#FE9927'},
  {currencyId: 'JPY', label: '¥', color: '#ec1919'},
  {currencyId: 'CHF', label: 'CHF', color: '#70adad'},
  {currencyId: 'GBP', label: '£', color: '#8c37e0'},
  {currencyId: 'ILS', label: '₪', color: '#b36526'},
  {currencyId: 'CNY', label: 'CNY', color: '#4478a3'}
]
export const getCurrenciesForAdding = createSelector(
  getCurrenciesIds,
  currenciesInUse => availableCurrencies.filter(item => currenciesInUse.indexOf(item.currencyId) === -1)
)
export const getCurrenciesForTable = createSelector(
  state => state.currencies,
  getCurrentRates,
  (currencies, rates) => Object.keys(currencies).map(key => {
    const result = {...currencies[key]}
    result.amountInUserCurrency = round(result.initialAmount*(rates[key] || 1))
    return result
  })
)
export const getUserCurrency = state => state.userCurrency
export const getCurrenciesColors = state => fromCurrencies.getCollors(state.currencies)

//UiState
export const getLoading = state => fromUiState.getLoading(state.uiState)
export const getError = state => fromUiState.getError(state.uiState)
