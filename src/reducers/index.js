import {combineReducers} from 'redux'
import currencies, * as fromCurrencies from './currencies'
import exchangeRates, * as fromExchangeRates from './exchangeRates'
import terms, * as fromTerms from './terms'
import uiState, * as fromUiState from './uiState'
import userCurrency from './userCurrency'
import {createSelector} from 'reselect'


const reducer = combineReducers({
  currencies,
  exchangeRates,
  terms,
  uiState,
  userCurrency
})

export default reducer

/*
* Selectors
*/

//Index selectors
export const getD3ResultGraphStackInput = state => {
  const temp = {}
  const currenciesIds = getCurrenciesIds(state)
  fromTerms.getTermsForResults(state.terms).forEach(termItem => {
    const {termId, investRateMultiplicator} = termItem
    currenciesIds.forEach(currencyId => {
      if (!temp[termId]) {
        temp[termId] = {term: termId}
      }
      const {initialAmount, investRate} = state.currencies[currencyId]
      temp[termId][currencyId] = initialAmount*(state.useInvest ? 1+(investRateMultiplicator*investRate)/100 : 1)*fromExchangeRates.getAllExchangeRates(state.exchangeRates)[''+termId+currencyId]
    })
  })

  const result = []
  Object.keys(temp).forEach(key => result.push(temp[key]))
  return result
}

//Terms
export const getResultTerms = state => fromTerms.getTermsForResults(state.terms)
export const getPastTerms = state => fromTerms.getPastTerms(state.terms)
export const getCurrentTerm = state => fromTerms.getCurrentTerm(state.terms)

//Currencies
const getCurrenciesIds = state => fromCurrencies.getCurrenciesIds(state.currencies)
const availableCurrencies = [
  {id: 'RUB', label: '₽', color: '#376be0'},
  {id: 'USD', label: '$', color: '#0d7c22'},
  {id: 'EUR', label: '€', color: '#d7da2d'},
  {id: 'JPY', label: '¥', color: '#ec1919'},
  {id: 'CHF', label: 'CHF', color: '#37e0e0'},
  {id: 'GBP', label: '£', color: '#8c37e0'},
  {id: 'ILS', label: '₪', color: '#b36526'},
  {id: 'CNY', label: 'CNY', color: '#ec510e'}
]
export const getCurrenciesForAdding = createSelector(
  getCurrenciesIds,
  currenciesInUse => availableCurrencies.filter(item => !(item.id in currenciesInUse))
)
export const getUserCurrency = state => state.userCurrency

//UiState
export const getLoading = state => fromUiState.getLoading(state.uiState)
export const getError = state => fromUiState.getError(state.uiState)
