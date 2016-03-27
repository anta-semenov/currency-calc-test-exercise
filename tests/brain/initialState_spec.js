import { getInitialState } from '../../src/brain/initialState'
import getTerms from '../../src/brain/termsHelper'
import { expect } from 'chai'

describe('intitialState', () => {
  it('should return correct initial state', () => {
     const promise = new Promise(resolve => {
       getInitialState(resolve)
     })
     return promise.then(state => {
       console.log(state);
       const startDate = new Date
       startDate.setHours(0)
       startDate.setMinutes(0)
       startDate.setSeconds(0)
       startDate.setMilliseconds(0)
       const futureTerms = getTerms(startDate, true)

       expect(state.get('currencies').size).to.equal(3)
       //state has correct termsHelper and current date
       expect(state.get('termsHelper').size).to.equal(4)
       expect(state.getIn(['termsHelper', futureTerms[0], 'investRateMult'])).to.equal(0.25)
       expect(state.getIn(['termsHelper', futureTerms[2], 'investRateMult'])).to.equal(0.75)
       expect(state.getIn(['termsHelper', futureTerms[3], 'investRateMult'])).to.equal(1.0)
       expect(state.get('currentDate')).to.equal(startDate.getTime())
       //every currency item is a correct map
       expect(state.getIn(['currencies', 'RUB']).size).to.equal(7)
       expect(state.getIn(['currencies', 'EUR']).size).to.equal(7)
       expect(state.getIn(['currencies', 'USD']).size).to.equal(7)
       //every currency item has correct exchangeRates map
       expect(state.getIn(['currencies', 'RUB', 'exchangeRates']).size).to.equal(28)
       expect(state.getIn(['currencies', 'RUB', 'exchangeRates']).maxBy((v,k) => k).size).to.equal(3)
       expect(state.getIn(['currencies', 'RUB', 'exchangeRates']).maxBy((v,k) => k).get('userCanChange')).to.equal(true)
       expect(state.getIn(['currencies', 'RUB', 'exchangeRates']).minBy((v,k) => k).size).to.equal(3)
       expect(state.getIn(['currencies', 'RUB', 'exchangeRates']).minBy((v,k) => k).get('userCanChange')).to.equal(false)
       expect(state.getIn(['currencies', 'EUR', 'exchangeRates']).size).to.equal(28)
       expect(state.getIn(['currencies', 'EUR', 'exchangeRates']).maxBy((v,k) => k).size).to.equal(3)
       expect(state.getIn(['currencies', 'EUR', 'exchangeRates']).maxBy((v,k) => k).get('userCanChange')).to.equal(true)
       expect(state.getIn(['currencies', 'EUR', 'exchangeRates']).minBy((v,k) => k).size).to.equal(3)
       expect(state.getIn(['currencies', 'EUR', 'exchangeRates']).minBy((v,k) => k).get('userCanChange')).to.equal(false)
       expect(state.getIn(['currencies', 'USD', 'exchangeRates']).size).to.equal(28)
       expect(state.getIn(['currencies', 'USD', 'exchangeRates']).maxBy((v,k) => k).size).to.equal(3)
       expect(state.getIn(['currencies', 'USD', 'exchangeRates']).maxBy((v,k) => k).get('userCanChange')).to.equal(true)
       expect(state.getIn(['currencies', 'USD', 'exchangeRates']).minBy((v,k) => k).size).to.equal(3)
       expect(state.getIn(['currencies', 'USD', 'exchangeRates']).minBy((v,k) => k).get('userCanChange')).to.equal(false)
       //every currency item has correct resultsMap
       expect(state.getIn(['currencies', 'RUB', 'exchangeRates']).size).to.equal(4)
       expect(state.getIn(['currencies', 'RUB', 'exchangeRates']).maxBy((v,k) => k).size).to.equal(4)
       expect(state.getIn(['currencies', 'RUB', 'exchangeRates']).maxBy((v,k) => k).get('result')).not.to.equal(0)
       expect(state.getIn(['currencies', 'RUB', 'exchangeRates']).minBy((v,k) => k).size).to.equal(4)
       expect(state.getIn(['currencies', 'EUR', 'exchangeRates']).size).to.equal(4)
       expect(state.getIn(['currencies', 'EUR', 'exchangeRates']).maxBy((v,k) => k).size).to.equal(4)
       expect(state.getIn(['currencies', 'EUR', 'exchangeRates']).maxBy((v,k) => k).get('result')).not.to.equal(0)
       expect(state.getIn(['currencies', 'EUR', 'exchangeRates']).minBy((v,k) => k).size).to.equal(4)
       expect(state.getIn(['currencies', 'USD', 'exchangeRates']).size).to.equal(4)
       expect(state.getIn(['currencies', 'USD', 'exchangeRates']).maxBy((v,k) => k).size).to.equal(4)
       expect(state.getIn(['currencies', 'USD', 'exchangeRates']).maxBy((v,k) => k).get('result')).not.to.equal(0)
       expect(state.getIn(['currencies', 'USD', 'exchangeRates']).minBy((v,k) => k).size).to.equal(4)
     })
  })
})
