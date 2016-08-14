import {expect} from 'chai'
import past, * as fromPast from '../../src/reducers/exchangeRates/past'
import {addCurrencyResult, changeUserCurrencyEnd} from '../../src/actions/actionCreator'

describe('Past reducer & selectors', () => {
  it('Should return correct currentRates', () => {
    const testPastState = {
      ['' + new Date(2016,2,4).getTime() + 'EUR']: {
        currencyId: 'EUR',
        term: new Date(2016,2,4).getTime(),
        rate: 0.91,
        isInitial: undefined
      },
      ['' + new Date(2016,3,4).getTime() + 'EUR']: {
        currencyId: 'EUR',
        term: new Date(2016,3,4).getTime(),
        rate: 0.87,
        isInitial: true
      },
      ['' + new Date(2016,2,4).getTime() + 'GBP']: {
        currencyId: 'GBP',
        term: new Date(2016,2,4).getTime(),
        rate: 1.58,
        isInitial: undefined
      },
      ['' + new Date(2016,3,4).getTime() + 'GBP']: {
        currencyId: 'GBP',
        term: new Date(2016,3,4).getTime(),
        rate: 1.78,
        isInitial: true
      }
    }
    const expectedCurrentRates = {
      'EUR': 0.87,
      'GBP': 1.78
    }
    expect(fromPast.getInitialRates(testPastState)).to.deep.equal(expectedCurrentRates)
  })

  it('Should handle ADD_CURRENCY', () => {
    const initialState = {
      ['' + new Date(2016,2,4).getTime() + 'EUR']: {
        currencyId: 'EUR',
        term: new Date(2016,2,4).getTime(),
        rate: 0.91,
        isInitial: undefined
      },
      ['' + new Date(2016,3,4).getTime() + 'EUR']: {
        currencyId: 'EUR',
        term: new Date(2016,3,4).getTime(),
        rate: 0.87,
        isInitial: true
      },
      ['' + new Date(2016,2,4).getTime() + 'GBP']: {
        currencyId: 'GBP',
        term: new Date(2016,2,4).getTime(),
        rate: 1.58,
        isInitial: undefined
      },
      ['' + new Date(2016,3,4).getTime() + 'GBP']: {
        currencyId: 'GBP',
        term: new Date(2016,3,4).getTime(),
        rate: 1.78,
        isInitial: true
      }
    }

    const action = addCurrencyResult({}, {
      ['' + new Date(2016,2,4).getTime() + 'CHF']: {
        currencyId: 'CHF',
        term: new Date(2016,2,4).getTime(),
        rate: 1.02,
        isInitial: undefined
      },
      ['' + new Date(2016,3,4).getTime() + 'CHF']: {
        currencyId: 'CHF',
        term: new Date(2016,3,4).getTime(),
        rate: 1.05,
        isInitial: true
      }
    }, {})

    const expectedState = {
      ['' + new Date(2016,2,4).getTime() + 'EUR']: {
        currencyId: 'EUR',
        term: new Date(2016,2,4).getTime(),
        rate: 0.91,
        isInitial: undefined
      },
      ['' + new Date(2016,3,4).getTime() + 'EUR']: {
        currencyId: 'EUR',
        term: new Date(2016,3,4).getTime(),
        rate: 0.87,
        isInitial: true
      },
      ['' + new Date(2016,2,4).getTime() + 'GBP']: {
        currencyId: 'GBP',
        term: new Date(2016,2,4).getTime(),
        rate: 1.58,
        isInitial: undefined
      },
      ['' + new Date(2016,3,4).getTime() + 'GBP']: {
        currencyId: 'GBP',
        term: new Date(2016,3,4).getTime(),
        rate: 1.78,
        isInitial: true
      },
      ['' + new Date(2016,2,4).getTime() + 'CHF']: {
        currencyId: 'CHF',
        term: new Date(2016,2,4).getTime(),
        rate: 1.02,
        isInitial: undefined
      },
      ['' + new Date(2016,3,4).getTime() + 'CHF']: {
        currencyId: 'CHF',
        term: new Date(2016,3,4).getTime(),
        rate: 1.05,
        isInitial: true
      }
    }

    expect(past(initialState, action)).to.deep.equal(expectedState)
  })

  it('Should handle ADD_CURRENCY with emty past argument', () => {
    const initialState = {
      ['' + new Date(2016,2,4).getTime() + 'EUR']: {
        currencyId: 'EUR',
        term: new Date(2016,2,4).getTime(),
        rate: 0.91,
        isInitial: undefined
      },
      ['' + new Date(2016,3,4).getTime() + 'EUR']: {
        currencyId: 'EUR',
        term: new Date(2016,3,4).getTime(),
        rate: 0.87,
        isInitial: true
      },
      ['' + new Date(2016,2,4).getTime() + 'GBP']: {
        currencyId: 'GBP',
        term: new Date(2016,2,4).getTime(),
        rate: 1.58,
        isInitial: undefined
      },
      ['' + new Date(2016,3,4).getTime() + 'GBP']: {
        currencyId: 'GBP',
        term: new Date(2016,3,4).getTime(),
        rate: 1.78,
        isInitial: true
      }
    }

    const action = addCurrencyResult({}, {}, {})

    const expectedState = {
      ['' + new Date(2016,2,4).getTime() + 'EUR']: {
        currencyId: 'EUR',
        term: new Date(2016,2,4).getTime(),
        rate: 0.91,
        isInitial: undefined
      },
      ['' + new Date(2016,3,4).getTime() + 'EUR']: {
        currencyId: 'EUR',
        term: new Date(2016,3,4).getTime(),
        rate: 0.87,
        isInitial: true
      },
      ['' + new Date(2016,2,4).getTime() + 'GBP']: {
        currencyId: 'GBP',
        term: new Date(2016,2,4).getTime(),
        rate: 1.58,
        isInitial: undefined
      },
      ['' + new Date(2016,3,4).getTime() + 'GBP']: {
        currencyId: 'GBP',
        term: new Date(2016,3,4).getTime(),
        rate: 1.78,
        isInitial: true
      }
    }

    expect(past(initialState, action)).to.deep.equal(expectedState)
  })

  it('Should handle CHANGE_USER_CURRENCY', () => {
    const initialState = {
      ['' + new Date(2016,2,4).getTime() + 'EUR']: {
        currencyId: 'EUR',
        term: new Date(2016,2,4).getTime(),
        rate: 0.91,
        isInitial: undefined
      },
      ['' + new Date(2016,3,4).getTime() + 'EUR']: {
        currencyId: 'EUR',
        term: new Date(2016,3,4).getTime(),
        rate: 0.87,
        isInitial: true
      },
      ['' + new Date(2016,2,4).getTime() + 'GBP']: {
        currencyId: 'GBP',
        term: new Date(2016,2,4).getTime(),
        rate: 1.58,
        isInitial: undefined
      },
      ['' + new Date(2016,3,4).getTime() + 'GBP']: {
        currencyId: 'GBP',
        term: new Date(2016,3,4).getTime(),
        rate: 1.78,
        isInitial: true
      }
    }

    const action = changeUserCurrencyEnd('EUR', {
      [new Date(2016,2,4).getTime()]: 1.0989,
      [new Date(2016,3,4).getTime()]: 1.2821
    })

    const expectedState = {
      ['' + new Date(2016,2,4).getTime() + 'EUR']: {
        currencyId: 'EUR',
        term: new Date(2016,2,4).getTime(),
        rate: 1.0,
        isInitial: undefined
      },
      ['' + new Date(2016,3,4).getTime() + 'EUR']: {
        currencyId: 'EUR',
        term: new Date(2016,3,4).getTime(),
        rate: 1.0,
        isInitial: true
      },
      ['' + new Date(2016,2,4).getTime() + 'GBP']: {
        currencyId: 'GBP',
        term: new Date(2016,2,4).getTime(),
        rate: 1.7363,
        isInitial: undefined
      },
      ['' + new Date(2016,3,4).getTime() + 'GBP']: {
        currencyId: 'GBP',
        term: new Date(2016,3,4).getTime(),
        rate: 2.2821,
        isInitial: true
      }
    }

    expect(past(initialState, action)).to.deep.equal(expectedState)
  })
})
