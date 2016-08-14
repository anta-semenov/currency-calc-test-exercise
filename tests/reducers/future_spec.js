import {expect} from 'chai'
import future from '../../src/reducers/exchangeRates/future'
import {addCurrencyResult, changeExchangeRate} from '../../src/actions/actionCreator'

describe('Future reducer', () => {
  it('Should handle ADD_CURRENCY', () => {
    const initialState = {
      ['' + new Date(2016,2,4).getTime() + 'EUR']: {
        currencyId: 'EUR',
        term: new Date(2016,2,4).getTime(),
        rate: 0.91
      },
      ['' + new Date(2016,3,4).getTime() + 'EUR']: {
        currencyId: 'EUR',
        term: new Date(2016,3,4).getTime(),
        rate: 0.87
      },
      ['' + new Date(2016,2,4).getTime() + 'GBP']: {
        currencyId: 'GBP',
        term: new Date(2016,2,4).getTime(),
        rate: 1.58
      },
      ['' + new Date(2016,3,4).getTime() + 'GBP']: {
        currencyId: 'GBP',
        term: new Date(2016,3,4).getTime(),
        rate: 1.78
      }
    }

    const action = addCurrencyResult({}, {}, {
      ['' + new Date(2016,2,4).getTime() + 'CHF']: {
        currencyId: 'CHF',
        term: new Date(2016,2,4).getTime(),
        rate: 1.02
      },
      ['' + new Date(2016,3,4).getTime() + 'CHF']: {
        currencyId: 'CHF',
        term: new Date(2016,3,4).getTime(),
        rate: 1.05
      }
    })

    const expectedState = {
      ['' + new Date(2016,2,4).getTime() + 'EUR']: {
        currencyId: 'EUR',
        term: new Date(2016,2,4).getTime(),
        rate: 0.91
      },
      ['' + new Date(2016,3,4).getTime() + 'EUR']: {
        currencyId: 'EUR',
        term: new Date(2016,3,4).getTime(),
        rate: 0.87
      },
      ['' + new Date(2016,2,4).getTime() + 'GBP']: {
        currencyId: 'GBP',
        term: new Date(2016,2,4).getTime(),
        rate: 1.58
      },
      ['' + new Date(2016,3,4).getTime() + 'GBP']: {
        currencyId: 'GBP',
        term: new Date(2016,3,4).getTime(),
        rate: 1.78
      },
      ['' + new Date(2016,2,4).getTime() + 'CHF']: {
        currencyId: 'CHF',
        term: new Date(2016,2,4).getTime(),
        rate: 1.02
      },
      ['' + new Date(2016,3,4).getTime() + 'CHF']: {
        currencyId: 'CHF',
        term: new Date(2016,3,4).getTime(),
        rate: 1.05
      }
    }

    expect(future(initialState, action)).to.deep.equal(expectedState)
  })

  it('Should handle ADD_CURRENCY with empty future argument', () => {
    const initialState = {
      ['' + new Date(2016,2,4).getTime() + 'EUR']: {
        currencyId: 'EUR',
        term: new Date(2016,2,4).getTime(),
        rate: 0.91
      },
      ['' + new Date(2016,3,4).getTime() + 'EUR']: {
        currencyId: 'EUR',
        term: new Date(2016,3,4).getTime(),
        rate: 0.87
      },
      ['' + new Date(2016,2,4).getTime() + 'GBP']: {
        currencyId: 'GBP',
        term: new Date(2016,2,4).getTime(),
        rate: 1.58
      },
      ['' + new Date(2016,3,4).getTime() + 'GBP']: {
        currencyId: 'GBP',
        term: new Date(2016,3,4).getTime(),
        rate: 1.78
      }
    }

    const action = addCurrencyResult({}, {}, {})

    const expectedState = {
      ['' + new Date(2016,2,4).getTime() + 'EUR']: {
        currencyId: 'EUR',
        term: new Date(2016,2,4).getTime(),
        rate: 0.91
      },
      ['' + new Date(2016,3,4).getTime() + 'EUR']: {
        currencyId: 'EUR',
        term: new Date(2016,3,4).getTime(),
        rate: 0.87
      },
      ['' + new Date(2016,2,4).getTime() + 'GBP']: {
        currencyId: 'GBP',
        term: new Date(2016,2,4).getTime(),
        rate: 1.58
      },
      ['' + new Date(2016,3,4).getTime() + 'GBP']: {
        currencyId: 'GBP',
        term: new Date(2016,3,4).getTime(),
        rate: 1.78
      }
    }

    expect(future(initialState, action)).to.deep.equal(expectedState)
  })

  it('Should handle CHANGE_CURRENCY_EXCHANGE_RATE', () => {
    const initialState = {
      ['' + new Date(2016,2,4).getTime() + 'EUR']: {
        currencyId: 'EUR',
        term: new Date(2016,2,4).getTime(),
        rate: 0.91
      },
      ['' + new Date(2016,3,4).getTime() + 'EUR']: {
        currencyId: 'EUR',
        term: new Date(2016,3,4).getTime(),
        rate: 0.87
      },
      ['' + new Date(2016,2,4).getTime() + 'GBP']: {
        currencyId: 'GBP',
        term: new Date(2016,2,4).getTime(),
        rate: 1.58
      },
      ['' + new Date(2016,3,4).getTime() + 'GBP']: {
        currencyId: 'GBP',
        term: new Date(2016,3,4).getTime(),
        rate: 1.78
      }
    }
    const action = changeExchangeRate('EUR', new Date(2016,2,4).getTime(), 0.86)

    const expectedState = {
      ['' + new Date(2016,2,4).getTime() + 'EUR']: {
        currencyId: 'EUR',
        term: new Date(2016,2,4).getTime(),
        rate: 0.86
      },
      ['' + new Date(2016,3,4).getTime() + 'EUR']: {
        currencyId: 'EUR',
        term: new Date(2016,3,4).getTime(),
        rate: 0.87
      },
      ['' + new Date(2016,2,4).getTime() + 'GBP']: {
        currencyId: 'GBP',
        term: new Date(2016,2,4).getTime(),
        rate: 1.58
      },
      ['' + new Date(2016,3,4).getTime() + 'GBP']: {
        currencyId: 'GBP',
        term: new Date(2016,3,4).getTime(),
        rate: 1.78
      }
    }

    expect(future(initialState, action)).to.deep.equal(expectedState)
  })
})
