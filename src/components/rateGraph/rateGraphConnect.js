import {connect} from 'react-redux'
import RateGraph from './RateGraph'
import {changeExchangeRate} from '../../actions/actionCreator'
import * as fromReducer from '../../reducers'
import {createSelector} from 'reselect'
import mapValues from 'lodash/mapValues'
import values from 'lodash/values'
import maxBy from 'lodash/maxBy'
import minBy from 'lodash/minBy'

const ratesToDataForGraph = (rates, result) => {
  Object.keys(rates).forEach(key => {
    if (!result[rates[key].currencyId]) {
      result[rates[key].currencyId] = []
    }
    result[rates[key].currencyId].push({
      term: rates[key].term,
      rate: rates[key].rate
    })
  })
}

const pastRatesSelector = createSelector(
  fromReducer.getPastExchangeRates,
  fromReducer.getUserCurrency,
  (pastRates, userCurrency) => {
    const result = {}
    ratesToDataForGraph(pastRates, result)
    delete result[userCurrency.currencyId]
    return mapValues(result, value => value.sort((a,b) => a.term-b.term))
  }
)

const futureRatesSelector = createSelector(
  fromReducer.getCurrentRates,
  fromReducer.getCurrentTerm,
  fromReducer.getFutureExchangeRates,
  fromReducer.getUserCurrency,
  (currentRates, currentTerm, futureRates, userCurrency) => {
    const result = {}
    Object.keys(currentRates).forEach(currencyId => {
      if (!result[currencyId]) {
        result[currencyId] = []
      }
      result[currencyId].push({
        term: currentTerm,
        rate: currentRates[currencyId]
      })
    })

    ratesToDataForGraph(futureRates, result)
    delete result[userCurrency.currencyId]
    return mapValues(result, value => value.sort((a,b) => a.term-b.term))
  }
)

const minMaxRates = createSelector(
  fromReducer.getAllExchangeRates,
  fromReducer.getUserCurrency,
  (exchangeRates, {currencyId: userCurrencyId}) => {
    const ratesArray = values(exchangeRates).filter(item => item.currencyId !== userCurrencyId)
    return({
      minRate: minBy(ratesArray, value => value.rate),
      maxRate: maxBy(ratesArray, value => value.rate)
    })
  }
)

const minMaxTerms = createSelector(
  fromReducer.getTerms,
  terms => ({
    minTerm: minBy(terms, value => value.term),
    maxTerm: maxBy(terms, value => value.term)
  })
)

const mapStateToProps = state => {
  return({
    pastRates: pastRatesSelector(state),
    futureRates: futureRatesSelector(state),
    colors: fromReducer.getCurrenciesColors(state),
    minTerm: minMaxTerms(state).minTerm.term,
    maxTerm: minMaxTerms(state).maxTerm.term,
    minRate: minMaxRates(state).minRate.rate,
    maxRate: minMaxRates(state).maxRate.rate,
  })
}

const mapDispatchToProps = dispatch => ({
  changeRate: (...args) => dispatch(changeExchangeRate(...args))
})

export default connect(mapStateToProps, mapDispatchToProps)(RateGraph)
