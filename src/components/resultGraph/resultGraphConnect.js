import {connect} from 'react-redux'
import ResultGraph from './ResultGraph'
import * as fromReducer from '../../reducers'

const getD3ResultGraphStackInput = state => {
  if (fromReducer.getLoading(state)) {
    return({
      results: [],
      maxValue: 1000,
      todayTotal: 0,
      yearTotal: 0
    })
  }
  const temp = {}
  const currenciesIds = fromReducer.getCurrenciesIds(state)
  let maxValue = 0
  let todayTotal = 0
  let yearTotal = 0
  const rates = fromReducer.getAllExchangeRates(state)
  fromReducer.getFutureTerms(state).forEach(termItem => {
    const {term, investRateMultiplicator} = termItem
    let sumValue = 0
    currenciesIds.forEach(currencyId => {
      if (!temp[term]) {
        temp[term] = {term}
      }
      const {initialAmount, investRate} = state.currencies[currencyId]
      const value = initialAmount*(fromReducer.getUseInvest(state) ? 1+(investRateMultiplicator*investRate)/100 : 1)*rates[''+term+currencyId].rate
      temp[term][currencyId] = value
      sumValue += value
      todayTotal += investRateMultiplicator === 0.25 ? initialAmount*rates[''+term+currencyId].rate : 0
      yearTotal += investRateMultiplicator === 1 ? value : 0
    })
    maxValue = Math.max(maxValue, sumValue)
  })
  maxValue = Math.max(maxValue, 1000)
  const results = []
  Object.keys(temp).forEach(key => results.push(temp[key]))
  return {maxValue, results, todayTotal, yearTotal}
}

const mapStateToProps = state => {
  const data = getD3ResultGraphStackInput(state)
  return({
    ...data,
    colors: fromReducer.getCurrenciesColors(state),
    currenciesIds: fromReducer.getCurrenciesIds(state),
    userCurrencyLabel: fromReducer.getUserCurrencyLabel(state),
    loading: fromReducer.getLoading(state)
  })
}

export default connect(mapStateToProps)(ResultGraph)
