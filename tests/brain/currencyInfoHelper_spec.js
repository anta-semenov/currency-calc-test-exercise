import getCurrencyInfo from '../../src/helpers/currencyInfoHelper'
import chai, { expect } from 'chai'
import chaiAsPromeses from 'chai-as-promised'
import { fromJS } from 'immutable'
import getExchangeRate from '../../src/helpers/exchangeRatesAPIHelper'
//import Promise from 'promise'

chai.use(chaiAsPromeses)

const period1 = new Date(2015,12,1).getTime()
const period2 = new Date(2016,3,1).getTime()

const commonInitialState = fromJS({
  currencies: {
    'EUR': {
      id: 'EUR',
      initialAmount: 10000.0,
      investRate: 5.0,
      initialExchangeRate: 1.1,
      initialAmountInUserCurrency: 11000.0,
      exchangeRates: {},
      results: {}
    },
    'GBP': {
      id: 'GBP',
      initialAmount: 10000.0,
      investRate: 3.0,
      initialExchangeRate: 1.7,
      initialAmountInUserCurrency: 17000.0,
      exchangeRates: {},
      results: {}
    }
  },
  useInvest: false,
  userCurrency: 'USD',
  terms: {},
  currentDate: new Date(2016,0,1).getTime()
}).setIn(['currencies', 'EUR', 'results', period2], fromJS({term: period2, result: 10000.0 , resultInUserCurrency: 12000.0, investRate: 1.25}))
  .setIn(['currencies', 'EUR', 'exchangeRates', period1], fromJS({term: period1, rate: 1.1, userCanChange: false}))
  .setIn(['currencies', 'EUR', 'exchangeRates', period2], fromJS({term: period2, rate: 1.2, userCanChange: true}))
  .setIn(['terms', period2], fromJS({term: period2, investRateMult: 0.25}))
  .setIn(['currencies', 'GBP', 'results', period2], fromJS({term: period2, result: 10000.0 , resultInUserCurrency: 17200.0, investRate: 0.75}))
  .setIn(['currencies', 'GBP', 'exchangeRates', period1], fromJS({term: period1, rate: 1.68, userCanChange: false}))
  .setIn(['currencies', 'GBP', 'exchangeRates', period2], fromJS({term: period2, rate: 1.72, userCanChange: true}))

describe('getCurrencyInfo', () => {
  it('Should return currencyInfo when state has currency without making request', () => {
    let currencyInfo
    const callback = (result) => currencyInfo = result

    getCurrencyInfo(commonInitialState, 'GBP', callback)

    expect(currencyInfo.get('initialExchangeRate')).to.equal(1.7)
    expect(currencyInfo.getIn(['exchangeRates', period2])).to.equal(1.72)
  })

  it('Should return currency info', () => {
    const promise = new Promise(resolve => getCurrencyInfo(commonInitialState, 'CHF', resolve))
    return promise.then(result => {
      expect(result.get('initialExchangeRate')).to.equal(0.99522)
      expect(result.get('exchangeRates').size).to.equal(28)
      expect(result.getIn(['exchangeRates', new Date(2015,11,1).getTime()])).to.equal(1.0291)
      expect(result.getIn(['exchangeRates', new Date(2016,1,1).getTime()])).to.equal(undefined)
    })
  })
})
