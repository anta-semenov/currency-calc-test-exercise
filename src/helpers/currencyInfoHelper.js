import { Map } from 'immutable'
import getExchangeRate from './exchangeRatesApi'
import getTerms from './terms'

export default function getCurrencyInfo(state, currencyId, callback) {
  if (state.get('currencies').has(currencyId)) {
    callback(Map().set('initialExchangeRate', state.getIn(['currencies', currencyId, 'initialExchangeRate']))
    .set('exchangeRates', state.getIn(['currencies', currencyId, 'exchangeRates']).map(item => item.get('rate'))))
  } else {
    const terms = getTerms(state.get('currentDate'), false, true)
    const baseCurrency = state.get('userCurrency')
    const promises = terms.map(date => new Promise((resolve) => {
      getExchangeRate(
        date,
        currencyId,
        baseCurrency,
        resolve
      )
    }))

    promises.push(new Promise((resolve) => {
      getExchangeRate(
        state.get('currentDate'),
        currencyId,
        baseCurrency,
        resolve
      )
    }))

    Promise.all(promises).then(result => {
      let currencyInfo = Map().asMutable()

      result.forEach(exchangeRateResult => {
        exchangeRateResult.forEach(currencyRate => {
          if (currencyRate.currency === currencyId) {
            if (currencyRate.term === state.get('currentDate')) {
              currencyInfo = currencyInfo.set('initialExchangeRate', currencyRate.rate)
            } else {
              currencyInfo = currencyInfo.setIn(['exchangeRates', currencyRate.term], currencyRate.rate)
            }
          }
        })
      })

      getTerms(state.get('currentDate'), true).forEach(term => {
        currencyInfo = currencyInfo.setIn(['exchangeRates', term], currencyInfo.get('initialExchangeRate'))
      })

      callback(currencyInfo.asImmutable())
    })
  }
}
