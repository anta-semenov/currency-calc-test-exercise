import {expect} from 'chai'
import * as actions from '../../src/actions/actionCreator'
import configureStore from '../../src/store/configureStore.prod.js'

describe('Terms initialization', () => {
  it('Should init terms properly', () => {
    const startDate = new Date(2016,3,4).getTime()
    const store = configureStore({})
    const action = actions.initTerms(startDate)

    const expectedTerms = [
      {term: new Date(2014,3,4).getTime()},
      {term: new Date(2014,4,4).getTime()},
      {term: new Date(2014,5,4).getTime()},
      {term: new Date(2014,6,4).getTime()},
      {term: new Date(2014,7,4).getTime()},
      {term: new Date(2014,8,4).getTime()},
      {term: new Date(2014,9,4).getTime()},
      {term: new Date(2014,10,4).getTime()},
      {term: new Date(2014,11,4).getTime()},
      {term: new Date(2014,12,4).getTime()},
      {term: new Date(2015,1,4).getTime()},
      {term: new Date(2015,2,4).getTime()},
      {term: new Date(2015,3,4).getTime()},
      {term: new Date(2015,4,4).getTime()},
      {term: new Date(2015,5,4).getTime()},
      {term: new Date(2015,6,4).getTime()},
      {term: new Date(2015,7,4).getTime()},
      {term: new Date(2015,8,4).getTime()},
      {term: new Date(2015,9,4).getTime()},
      {term: new Date(2015,10,4).getTime()},
      {term: new Date(2015,11,4).getTime()},
      {term: new Date(2015,12,4).getTime()},
      {term: new Date(2016,1,4).getTime()},
      {term: new Date(2016,2,4).getTime()},
      {term: startDate, isInitial: true},
      {term: new Date(2016,6,4).getTime(), investRateMultiplicator: 0.25},
      {term: new Date(2016,9,4).getTime(), investRateMultiplicator: 0.5},
      {term: new Date(2016,12,4).getTime(), investRateMultiplicator: 0.75},
      {term: new Date(2017,3,4).getTime(), investRateMultiplicator: 1}
    ]

    store.dispatch(action)

    expect(store.getState().terms).to.deep.equal(expectedTerms)
  })
})
