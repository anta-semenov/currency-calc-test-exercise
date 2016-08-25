/*global Promise*/
import XMLHttpRequest from 'xhr2'
import round from 'lodash/round'

const baseURL = 'http://api.fixer.io/'

const getExchangeRate = (date, currencies, baseCurrency = 'USD') => new Promise((resolve, reject) => {
  let url = baseURL
  let tempDate = date
  if (date instanceof Date) {
    tempDate = date
  } else {
    const offset = new Date().getTimezoneOffset()
    tempDate = new Date(date - offset*60000)
  }
  url += tempDate.toISOString().substring(0, 10)

  url += '?symbols=' + currencies.toString() + '&base=' + baseCurrency
  //send request
  const request = new XMLHttpRequest()
  request.onreadystatechange = () => {
    if (request.readyState === XMLHttpRequest.DONE) {
      if (request.status === 200) {
        const response = JSON.parse(request.responseText)['rates']
        const result = currencies.map((key) => {
          return {
            currency: key,
            term: date instanceof Date ? date.getTime() : date,
            rate: round(1/(response[key] || 1),4)
          }
        })
        resolve(result)
      } else {
        reject({})
      }
    }
  }
  request.open('GET', url, true)
  request.send(null)
})

export const getPastExchangeRates = (pastTerms, currentTerm, currencies, baseCurrency) => {
  const pastRequest = pastTerms.map(term =>
    getExchangeRate(term, currencies, baseCurrency)
  )

  const currentRequest = getExchangeRate(currentTerm, currencies, baseCurrency)
  return Promise.all([...pastRequest, currentRequest]).then(
    response => {
      const past = {}
      response.forEach(exchangeRateResult => {
        exchangeRateResult.forEach(currencyRate => {
          //fullfill past rates
          past['' + currencyRate.term + currencyRate.currency] = {
            term: currencyRate.term,
            currencyId: currencyRate.currency,
            rate: currencyRate.rate,
            isInitial: currencyRate.term === currentTerm ? true : undefined
          }
        })
      })
      return past
    },
    error => {
      return error
    }
  )
}

export const getFutureExchangeRates = (futureTerms, currentRates, userCurrencyId = 'USD') => {
  const future = {}
  const currenciesIds = Object.keys(currentRates)
  futureTerms.forEach((term, index) => {
    currenciesIds.forEach(currencyId => {
      future['' + term + currencyId] = {
        term,
        currencyId,
        rate: currencyId === userCurrencyId ? 1 : round(currentRates[currencyId]*(1+0.05*(index+1)), 4)
      }
    })
  })
  return future
}
