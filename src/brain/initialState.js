import { Map, fromJS } from 'immutable'
import getTerms from './termsHelper'
import { defaultFuture } from '../constants/termsSettings'
import * as core from './core'
import getExchangeRate from './exchangeRatesAPIHelper'
import { changeUseInvest } from './core'

const defaultCurrencies = fromJS({
  currencies: {
    RUB: {
      id: 'RUB',
      initialAmount: 100000,
      investRate: 13
    },
    EUR: {
      id: 'EUR',
      initialAmount: 2000,
      investRate: 5
    },
    USD: {
      id: 'USD',
      initialAmount: 3200,
      investRate: 4.7
    }
  }
})
const currenciesString = 'RUB,EUR,USD'

export function getInitialState(callback, baseCurrency = 'RUB') {
  const state = defaultCurrencies.asMutable()

  //get terms
  const startDate = new Date
  startDate.setHours(0)
  startDate.setMinutes(0)
  startDate.setSeconds(0)
  startDate.setMilliseconds(0)
  const pastTerms = getTerms(startDate, false, true)
  const futureTerms = getTerms(startDate, defaultFuture)
  state.set('currentDate', startDate.getTime())

  //add time helpers to the state
  const rateMultDelta = core.round((1/12)*defaultFuture.monthInterval,2)
  futureTerms.forEach((item, index) => {
    state.setIn(['termsHelper', item, 'term'], item)
    .setIn(['termsHelper', item, 'investRateMult'], (index+1)*rateMultDelta)
  })

  //get rates
  //create promisies for past periods
  const promises = pastTerms.map(date =>
    new Promise(resolve => {
      return getExchangeRate(date, currenciesString, baseCurrency, resolve)
    })
  )

  //create promise for initial rates
  promises.push(new Promise(resolve => {
    return getExchangeRate(startDate, currenciesString, baseCurrency, resolve)
  }))

  //make request and fullfill exchangeRates in currencies
  Promise.all(promises).then(result => {
    result.forEach(exchangeRateResult => {
      exchangeRateResult.forEach(currencyRate => {
        if (currencyRate.term === startDate) {
          state.setIn(['currencies', currencyRate.currency, 'initialExchangeRate'], currencyRate.rate)
        } else {
          state.setIn(
            ['currencies', currencyRate.currency, 'exchangeRates', currencyRate.term],
            fromJS({
              term: currencyRate.term,
              rate: currencyRate.rate,
              userCanChange: false
            })
          )
        }
      })
    })
    //fullfill future exchangesRates
    state.get('currencies').keySeq().forEach(currencyID => {
      const currentRate = state.getIn(['currencies', currencyID, 'exchangeRates']).last().get('rate')
      futureTerms.forEach(term => {
        state.setIn(['currencies', currencyID, 'exchangeRates', term], fromJS({
          term: term,
          rate: currentRate,
          userCanChange: true
        }))
      })
    })

    callback(changeUseInvest(state.asImmutable()))
  })
}
