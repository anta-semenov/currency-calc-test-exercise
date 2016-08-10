import { expect } from 'chai'
import reducer from '../../src/reducers/currencies'
import * as actions from '../../src/actions/actionCreator'

describe('currencies', () => {
  it('Should change initial amount of currency', () => {
    const initialState = {
      EUR: {id: 'EUR', initialAmount: 1000},
      USD: {id: 'USD', initialAmount: 2500}
    }

    const action = actions.changeCurrencyAmount('EUR', 2000)
    
    const nextState = {
      EUR: {id: 'EUR', initialAmount: 2000},
      USD: {id: 'USD', initialAmount: 2500}
    }

    expect(reducer(initialState, action)).to.deep.equal(nextState)
  })
})
