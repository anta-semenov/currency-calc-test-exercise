/*global Promise*/
import {loadState, saveState} from './localStorage'
import * as actions from '../actions/actionCreator'
import * as fromReducer from '../reducers'
import {getPastExchangeRates} from '../helpers/exchangeRatesApi'
import XMLHttpRequest from 'xhr2'

const userCurrencyRequest = () => new Promise((resolve) => {
  const request = new XMLHttpRequest()
  request.onreadystatechange = () => {
    if (request.readyState === XMLHttpRequest.DONE) {
      if (request.status === 200) {
        const response = JSON.parse(request.responseText)
        resolve(getCurrencyForCountry(response.country))
      } else if (request.status === 429) {
        resolve('USD')
      } else {
        resolve('USD')
      }
    }
  }
  request.open('GET', 'http://ipinfo.io/geo', true)
  request.send(null)
})

const getCurrencyForCountry = countryCode => {
  switch (countryCode.toLowerCase()) {
    case 'ru':
      return 'RUB'
    case 'ch':
      return 'CHF'
    case 'jp':
      return 'JPY'
    case 'il':
      return 'ILS'
    case 'cn':
      return 'CNY'
    case 'gb':
      return 'GBP'
    case 'at':
    case 'be':
    case 'cy':
    case 'ee':
    case 'fi':
    case 'fr':
    case 'de':
    case 'gr':
    case 'ie':
    case 'it':
    case 'lv':
    case 'lt':
    case 'lu':
    case 'mt':
    case 'nl':
    case 'pt':
    case 'sk':
    case 'si':
    case 'es':
      return 'EUR'
    default:
      return 'USD'
  }
}

export const initializeState = (store) => {
  store.subscribe(saveState(store))

  const savedState = loadState()

  //Init or reinit state
  const currentDate = +new Date()
  const stateCurrentDate = savedState ? fromReducer.getCurrentTerm(savedState) : undefined
  if (!stateCurrentDate || currentDate - stateCurrentDate > 1.5*86400000 || fromReducer.getError !== undefined) {
    let startDate = new Date
    startDate.setHours(0)
    startDate.setMinutes(0)
    startDate.setSeconds(0)
    startDate.setMilliseconds(0)
    startDate = startDate.getTime()

    store.dispatch(actions.initTerms(startDate))
    store.dispatch(actions.requestRates())

    userCurrencyRequest().then(currencyCode => {
      const userCurrency = fromReducer.availableCurrencies.find(item => item.currencyId === currencyCode)
      store.dispatch(actions.changeUserCurrencyEnd(userCurrency))

      //add Currencies
      //will add EUR, USD and user currency
      store.dispatch(actions.addCurrencyResult({
        ...userCurrency,
        initialAmount: 0,
        investRate: 0
      }, {}, {}))
      if (currencyCode !== 'USD') {
        store.dispatch(actions.addCurrencyResult({
          ...fromReducer.availableCurrencies[1],
          initialAmount: 0,
          investRate: 0
        }, {}, {}))
      }
      if (currencyCode !== 'EUR') {
        store.dispatch(actions.addCurrencyResult({
          ...fromReducer.availableCurrencies[2],
          initialAmount: 0,
          investRate: 0
        }, {}, {}))
      }
      //contuine initialisation
      return getPastExchangeRates(
        fromReducer.getPastTerms(store.getState()),
        fromReducer.getCurrentTerm(store.getState()),
        fromReducer.getCurrenciesIds(store.getState()),
        fromReducer.getUserCurrency(store.getState()).currencyId
      )
    }).then(
      response => {
        store.dispatch(actions.setState({exchangeRates: {past: response}}))
        store.dispatch(actions.initFutureExchangeRates(
          fromReducer.getFutureTermsArray(store.getState()),
          fromReducer.getCurrentRates(store.getState()),
          fromReducer.getUserCurrency(store.getState())
        ))
        store.dispatch(actions.recieveRates())
      },
      error => {store.dispatch(actions.errorRates(error))}
    )
  } else {
    store.dispatch(actions.setState(savedState))
  }
}
