import {combineReducers} from 'redux'
import currencies, * as fromCurrencies from './currencies'

const reducer = combineReducers(
  currencies
)

export default reducer

export const getD3ResultGraphStackInput = (state) => {
  const temp = {}
  const currenciesIds = fromCurrencies.currenciesIds(state.currencies)
  state.termsHelper.forEach(termItem => {
    const {termId, investRateMult} = termItem
    currenciesIds.forEach(currencyId => {
      if (!temp[termId]) {
        temp[termId] = {term: termId}
      }
      const {initialAmount, investRate} = state.currencies[currencyId]
      temp[termId][currencyId] = initialAmount*(state.useInvest ? 1+(investRateMult*investRate)/100 : 1)*state.exchangeRates[''+termId+currencyId]
    })
  })
}
