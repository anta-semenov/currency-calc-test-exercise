import {combineReducers} from 'redux'
import currencies, * as fromCurrencies from './currencies'
import exchangeRates, * as fromExchangeRates from './exchangeRates'
import terms, * as fromTerms from './terms'


const reducer = combineReducers(
  currencies,
  exchangeRates,
  terms
)

export default reducer

export const getD3ResultGraphStackInput = (state) => {
  const temp = {}
  const currenciesIds = fromCurrencies.getCurrenciesIds(state.currencies)
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
