import {expect} from 'chai'
import {getPastExchangeRates, getFutureExchangeRates} from '../../src/helpers/exchangeRatesApi'

describe('exchange rates api', () => {
  it('Should return correct past exchange rates dictionary', () => {
    const pastTerms = [
      new Date(2016,0,4).getTime(),
      new Date(2016,1,4).getTime(),
      new Date(2016,2,4).getTime()
    ]
    const currentTerm = new Date(2016,3,4).getTime()

    const expectedResponse = {
      ['' + new Date(2016,0,4).getTime() + 'EUR']: {
        currencyId: 'EUR',
        term: new Date(2016,0,4).getTime(),
        rate: 1.0898,
        isInitial: undefined
      },
      ['' + new Date(2016,1,4).getTime() + 'EUR']: {
        currencyId: 'EUR',
        term: new Date(2016,1,4).getTime(),
        rate: 1.1206,
        isInitial: undefined
      },
      ['' + new Date(2016,2,4).getTime() + 'EUR']: {
        currencyId: 'EUR',
        term: new Date(2016,2,4).getTime(),
        rate: 1.0970,
        isInitial: undefined
      },
      ['' + new Date(2016,3,4).getTime() + 'EUR']: {
        currencyId: 'EUR',
        term: new Date(2016,3,4).getTime(),
        rate: 1.1380,
        isInitial: true
      }
    }

    return getPastExchangeRates(pastTerms, currentTerm, ['EUR'], 'USD').then(
      response => {
        expect(response).to.deep.equal(expectedResponse)
      }
    )
  })

  it('Should return correct future rates', () => {
    const futureTerms = [
      new Date(2016,9,4).getTime(),
      new Date(2016,10,4).getTime(),
      new Date(2016,11,4).getTime()
    ]
    const currentRates = {
      EUR: 0.8787
    }
    const expectedFutureRates = {
      ['' + new Date(2016,9,4).getTime() + 'EUR']: {
        term: new Date(2016,9,4).getTime(),
        currencyId: 'EUR',
        rate: 0.9226
      },
      ['' + new Date(2016,10,4).getTime() + 'EUR']: {
        term: new Date(2016,10,4).getTime(),
        currencyId: 'EUR',
        rate: 0.9666
      },
      ['' + new Date(2016,11,4).getTime() + 'EUR']: {
        term: new Date(2016,11,4).getTime(),
        currencyId: 'EUR',
        rate: 1.0105
      }
    }
    expect(getFutureExchangeRates(futureTerms, currentRates)).to.deep.equal(expectedFutureRates)
  })
})
