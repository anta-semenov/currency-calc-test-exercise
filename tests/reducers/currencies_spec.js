import { expect } from 'chai'
import reducer from '../../src/reducers/currencies'
import * as actions from '../../src/actions/actionCreator'

describe('currencies', () => {
  it('Should change initial amount', () => {
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

  it('Should change investRate', () => {
    const initialState = {
      EUR: {id: 'EUR', investRate: 5.5},
      USD: {id: 'USD', investRate: 5.5}
    }

    const action = actions.changeInvestRate('EUR', 6.0)

    const nextState = {
      EUR: {id: 'EUR', investRate: 6.0},
      USD: {id: 'USD', investRate: 5.5}
    }
    expect(reducer(initialState, action)).to.deep.equal(nextState)
  })

  it('Should add currency', () => {
    const initialState = {
      EUR: {currencyId: 'EUR', investRate: 5.5},
      USD: {currencyId: 'USD', investRate: 5.5}
    }

    const action = actions.addCurrencyResult({
      currencyId: 'GBP',
      initialAmount: 3000,
      investRate: 4.0
    })

    const nextState = {
      EUR: {currencyId: 'EUR', investRate: 5.5},
      USD: {currencyId: 'USD', investRate: 5.5},
      GBP: {currencyId: 'GBP', initialAmount: 3000, investRate: 4.0}
    }

    expect(reducer(initialState, action)).to.deep.equal(nextState)
  })
})
