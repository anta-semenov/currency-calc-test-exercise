import {connect} from 'react-redux'
import ResultGraph from './ResultGraph'
import * as fromReducer from '../../reducers'

const getD3ResultGraphStackInput = state => {
  const temp = {}
  const currenciesIds = fromReducer.getCurrenciesIds(state)
  let maxValue = 0
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
    })
    maxValue = Math.max(maxValue, sumValue)
  })

  const result = []
  Object.keys(temp).forEach(key => result.push(temp[key]))
  return {maxValue, result}
}

const mapStateToProps = state => {
  const data = getD3ResultGraphStackInput(state)
  return({
    results: data.result,
    maxValue: data.maxValue,
    colors: fromReducer.getCurrenciesColors(state),
    currenciesIds: fromReducer.getCurrenciesIds(state)
  })
}

export default connect(mapStateToProps)(ResultGraph)
