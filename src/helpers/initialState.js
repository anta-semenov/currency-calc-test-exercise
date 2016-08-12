import { Map, fromJS } from 'immutable'
import getTerms, {defaultFuture} from './terms'
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
    state.setIn(['terms', item, 'term'], item)
    .setIn(['terms', item, 'investRateMult'], (index+1)*rateMultDelta)
  })

  //fullfill base currency exchangerates with 1 if we have it in currencies
  if (state.getIn(['currencies', baseCurrency])) {
    state.setIn(['currencies', baseCurrency, 'initialExchangeRate'], 1)
    pastTerms.forEach(date =>
      state.setIn(['currencies', baseCurrency, 'exchangeRates', date], fromJS({term: date, rate: 1, userCanChange: false}))
    )
  }

  //get rates
  //create promisies for past periods
  const promises = pastTerms.map(date =>
    new Promise(resolve => {
      getExchangeRate(date, currenciesString, baseCurrency, resolve)
    })
  )

  //create promise for initial rates
  promises.push(new Promise(resolve => {
    getExchangeRate(startDate.getTime(), currenciesString, baseCurrency, resolve)
  }))

  //make request and fullfill exchangeRates in currencies
  Promise.all(promises).then(result => {
    result.forEach(exchangeRateResult => {
      exchangeRateResult.forEach(currencyRate => {
        if (currencyRate.term === startDate.getTime()) {
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
    //fullfill future exchangeRates
    state.get('currencies').keySeq().forEach(currencyID => {
      const currentRate = state.getIn(['currencies', currencyID, 'exchangeRates']).last().get('rate')
      state.setIn(['currencies', currencyID, 'initialAmountInUserCurrency'], core.round(
        state.getIn(['currencies', currencyID, 'initialAmount'])*state.getIn(['currencies', currencyID, 'initialExchangeRate']),
        2
      ))
      futureTerms.forEach(term => {
        state.setIn(['currencies', currencyID, 'exchangeRates', term], fromJS({
          term: term,
          rate: currentRate,
          userCanChange: true
        }))
        state.setIn(['currencies', currencyID, 'results', term], fromJS({
          term: term,
          initialAmount: state.getIn(['currencies', currencyID, 'initialAmount']),
          resultInUserCurrency: core.round(
            state.getIn(['currencies', currencyID, 'initialAmount'])*state.getIn(['currencies', currencyID, 'exchangeRates', term, 'rate']),
            2
          ),
          investRate: core.round(
            state.getIn(['currencies', currencyID, 'investRate'])*state.getIn(['terms', term, 'investRateMult']),
            2
          )
        }))
      })
    })

    callback(state.asImmutable())
  })
}
