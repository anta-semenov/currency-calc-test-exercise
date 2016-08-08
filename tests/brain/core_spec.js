import * as core from '../../src/brain/core'
import { expect } from 'chai'
import { fromJS } from 'immutable'

const period1 = new Date(2015,12,1).getTime()
const period2 = new Date(2016,3,1).getTime()
const period3 = new Date(2016,6,1).getTime()

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
  termsHelper: {}
}).setIn(['currencies', 'EUR', 'results', period2], fromJS({term: period2, result: 10000.0 , resultInUserCurrency: 12000.0, investRate: 1.25}))
  .setIn(['currencies', 'EUR', 'exchangeRates', period1], fromJS({term: period1, rate: 1.1, userCanChange: false}))
  .setIn(['currencies', 'EUR', 'exchangeRates', period2], fromJS({term: period2, rate: 1.2, userCanChange: true}))
  .setIn(['termsHelper', period2], fromJS({term: period2, investRateMult: 0.25}))
  .setIn(['currencies', 'GBP', 'results', period2], fromJS({term: period2, result: 10000.0 , resultInUserCurrency: 17200.0, investRate: 0.75}))
  .setIn(['currencies', 'GBP', 'exchangeRates', period1], fromJS({term: period1, rate: 1.68, userCanChange: false}))
  .setIn(['currencies', 'GBP', 'exchangeRates', period2], fromJS({term: period2, rate: 1.72, userCanChange: true}))

describe('changeExRateCoordinate', () => {
  it('changes y at current circle', () => {
    const initialState = fromJS({
      circles: [
        {
          id:1,
          rates: [
            {x:30, y:50},
            {x:60, y:100}
          ],
          color: 'rgb(235, 135, 72)'
        },
        {
          id: 2,
          rates: [
            {x:30, y:30},
            {x:60, y:150}
          ],
          color: 'rgb(139, 84, 228)'
        }
      ],
      currentCircle: {
        id:2,
        x: 60
      }
    });

    const nextState = core.changeExRateCoordinate(initialState, 120);

    expect(nextState).to.equal(fromJS({
      circles: [
        {
          id:1,
          rates: [
            {x:30, y:50},
            {x:60, y:100}
          ],
          color: 'rgb(235, 135, 72)'
        },
        {
          id: 2,
          rates: [
            {x:30, y:30},
            {x:60, y:120}
          ],
          color: 'rgb(139, 84, 228)'
        }
      ],
      currentCircle: {
        id:2,
        x: 60
      }
    }));
  });
});

describe('startExRateChanging', () => {
  it('set currentCircle property to state', () => {
    const initialState = fromJS({
      circles: [
        {
          id:1,
          rates: [
            {x:30, y:50},
            {x:60, y:100}
          ],
          color: 'rgb(235, 135, 72)'
        },
        {
          id: 2,
          rates: [
            {x:30, y:30},
            {x:60, y:150}
          ],
          color: 'rgb(139, 84, 228)'
        }
      ]
    });

    const nextState = core.startExRateChanging(initialState, 1, 30);

    expect(nextState).to.equal(fromJS({
      circles: [
        {
          id:1,
          rates: [
            {x:30, y:50},
            {x:60, y:100}
          ],
          color: 'rgb(235, 135, 72)'
        },
        {
          id: 2,
          rates: [
            {x:30, y:30},
            {x:60, y:150}
          ],
          color: 'rgb(139, 84, 228)'
        }
      ],
      currentCircle: {
        id:1,
        x:30
      }
    }));
  });
});

describe('stopExRateChanging', () => {
  it('remove currentCircle property from state', () => {
    const initialState = fromJS({
      circles: [
        {
          id:1,
          rates: [
            {x:30, y:50},
            {x:60, y:100}
          ],
          color: 'rgb(235, 135, 72)'
        },
        {
          id: 2,
          rates: [
            {x:30, y:30},
            {x:60, y:150}
          ],
          color: 'rgb(139, 84, 228)'
        }
      ],
      currentCircle: {
        id:1,
        x:30
      }
    });

    const nextState = core.stopExRateChanging(initialState);

    expect(nextState).to.equal(fromJS({
      circles: [
        {
          id:1,
          rates: [
            {x:30, y:50},
            {x:60, y:100}
          ],
          color: 'rgb(235, 135, 72)'
        },
        {
          id: 2,
          rates: [
            {x:30, y:30},
            {x:60, y:150}
          ],
          color: 'rgb(139, 84, 228)'
        }
      ]
    }));
  });
});

describe('recalculateResult', () => {
  it('get the same result if no changes', () => {
    const nextState = core.recalculateResult(commonInitialState, 'EUR', period2)

    expect(nextState.getIn(['currencies', 'EUR', 'results', period2, 'result'])).to.equal(10000.0)
    expect(nextState.getIn(['currencies', 'EUR', 'results', period2, 'resultInUserCurrency'])).to.equal(12000.0)
  })

  it('calculate new result when initial amount was changed', () => {
    const initialState = commonInitialState.setIn(['currencies', 'EUR', 'initialAmount'], 11000.0)

    const nextState = core.recalculateResult(initialState, 'EUR', period2)

    expect(nextState.getIn(['currencies', 'EUR', 'results', period2, 'result'])).to.equal(11000.0)
    expect(nextState.getIn(['currencies', 'EUR', 'results', period2, 'resultInUserCurrency'])).to.equal(13200.0)
  })

  it('calculate new result when use invest was changed', () => {
    const initialState = commonInitialState.set('useInvest', true)

    const nextState = core.recalculateResult(initialState, 'EUR', period2)

    expect(nextState.getIn(['currencies', 'EUR', 'results', period2, 'result'])).to.equal(10125.0)
    expect(nextState.getIn(['currencies', 'EUR', 'results', period2, 'resultInUserCurrency'])).to.equal(12150.0)
  })

  it('calculate new result when invest rate was changed and useInvest is true', () => {
    const initialState = commonInitialState
      .set('useInvest', true)
      .setIn(['currencies', 'EUR', 'results', period2, 'investRate'], 2.0)

    const nextState = core.recalculateResult(initialState, 'EUR', period2)

    expect(nextState.getIn(['currencies', 'EUR', 'results', period2, 'result'])).to.equal(10200.0)
    expect(nextState.getIn(['currencies', 'EUR', 'results', period2, 'resultInUserCurrency'])).to.equal(12240.0)
  })
})

describe('changeExchangeRate', () => {
  it('do nithing when no changingCurrencyRate', () => {
    const nextState = core.changeExchangeRate(commonInitialState, 1.0786)

    expect(nextState).to.equal(fromJS(commonInitialState))
  })

  it('change ex rate and recalculate results for currency and term without invest rate', () => {
    const initialState = fromJS(commonInitialState).set('changingCurrencyRate', fromJS({id:'EUR', term: period2}))

    const nextState = core.changeExchangeRate(initialState, 1.4)

    expect(nextState.getIn(['currencies', 'EUR', 'exchangeRates', period1, 'rate'])).to.equal(1.1)
    expect(nextState.getIn(['currencies', 'EUR', 'exchangeRates', period2, 'rate'])).to.equal(1.4)
    expect(nextState.getIn(['currencies', 'EUR', 'results', period2, 'resultInUserCurrency'])).to.equal(14000.0)
  })

  it('change ex rate and recalculate results for currency and term with invest rate', () => {
    const initialState = commonInitialState.set('changingCurrencyRate', fromJS({id:'EUR', term: period2})).set('useInvest', true)
    const nextState = core.changeExchangeRate(initialState, 1.4)

    expect(nextState.getIn(['currencies', 'EUR', 'exchangeRates', period1, 'rate'])).to.equal(1.1)
    expect(nextState.getIn(['currencies', 'EUR', 'exchangeRates', period2, 'rate'])).to.equal(1.4)
    expect(nextState.getIn(['currencies', 'EUR', 'results', period2, 'resultInUserCurrency'])).to.equal(14175.0)
  })
})

describe('changeCurrencyAmount', () => {
  it('change amount and recalculate amount in user currency', () => {
    const nextState = core.changeCurrencyAmount(commonInitialState, 'EUR', 15000.0)
    expect(nextState.getIn(['currencies', 'EUR', 'initialAmount'])).to.equal(15000.0)
    expect(nextState.getIn(['currencies', 'EUR', 'initialAmountInUserCurrency'])).to.equal(16500.0)
  })

  it('recalculate results for all terms without invest when no useInvest', () => {
    const initialState = commonInitialState.setIn(
      ['currencies', 'EUR', 'results', period3],
      fromJS({term: period3, result: 10000.0 , resultInUserCurrency: 13000.0, investRate: 2.5})
    ).setIn(
      ['currencies', 'EUR', 'exchangeRates', period3],
      fromJS({term: period3, rate: 1.3, userCanChange: true})
    )

    const nextState = core.changeCurrencyAmount(initialState, 'EUR', 15000.0)

    expect(nextState.getIn(['currencies', 'EUR', 'results', period2, 'result'])).to.equal(15000.0)
    expect(nextState.getIn(['currencies', 'EUR', 'results', period2, 'resultInUserCurrency'])).to.equal(18000.0)
    expect(nextState.getIn(['currencies', 'EUR', 'results', period3, 'result'])).to.equal(15000.0)
    expect(nextState.getIn(['currencies', 'EUR', 'results', period3, 'resultInUserCurrency'])).to.equal(19500.0)
  })

  it('recalculate results for all terms with invest when useInvest', () => {
    const initialState = commonInitialState.setIn(
      ['currencies', 'EUR', 'results', period3],
      fromJS({term: period3, result: 10000.0 , resultInUserCurrency: 13000.0, investRate: 2.5})
    ).setIn(
      ['currencies', 'EUR', 'exchangeRates', period3],
      fromJS({term: period3, rate: 1.3, userCanChange: true})
    ).set('useInvest', true)

    const nextState = core.changeCurrencyAmount(initialState, 'EUR', 15000.0)

    expect(nextState.getIn(['currencies', 'EUR', 'results', period2, 'result'])).to.equal(15187.5)
    expect(nextState.getIn(['currencies', 'EUR', 'results', period2, 'resultInUserCurrency'])).to.equal(18225.0)
    expect(nextState.getIn(['currencies', 'EUR', 'results', period3, 'result'])).to.equal(15375.0)
    expect(nextState.getIn(['currencies', 'EUR', 'results', period3, 'resultInUserCurrency'])).to.equal(19987.5)
  })
})

describe('changeCurrencyInvestRate', () => {
  const initialState = commonInitialState.setIn(
    ['currencies', 'EUR', 'results', period3],
    fromJS({term: period3, result: 10000.0 , resultInUserCurrency: 13000.0, investRate: 1.25})
  ).setIn(
    ['currencies', 'EUR', 'exchangeRates', period3],
    fromJS({term: period3, rate: 1.3, userCanChange: true})
  ).setIn(['termsHelper', period3], fromJS({term: period3, investRateMult: 0.5}))

  it('change invest rate in currency map', () => {
    const nextState = core.changeCurrencyInvestRate(commonInitialState, 'EUR', 7.0)

    expect(nextState.getIn(['currencies', 'EUR', 'investRate'])).to.equal(7.0)
  })

  it('change invest rates in currency results', () => {
    const nextState = core.changeCurrencyInvestRate(initialState, 'EUR', 7.0)

    expect(nextState.getIn(['currencies', 'EUR', 'results', period2, 'investRate'])).to.equal(1.75)
    expect(nextState.getIn(['currencies', 'EUR', 'results', period3, 'investRate'])).to.equal(3.5)
  })

  it('dont change results without useInvest', () => {
    const nextState = core.changeCurrencyInvestRate(initialState, 'EUR', 7.0)

    expect(nextState.getIn(['currencies', 'EUR', 'results', period2, 'result'])).to.equal(10000)
    expect(nextState.getIn(['currencies', 'EUR', 'results', period3, 'result'])).to.equal(10000)
  })

  it('change results with useInvest', () => {
    const state = initialState.set('useInvest', true)
    const nextState = core.changeCurrencyInvestRate(state, 'EUR', 7.0)

    expect(nextState.getIn(['currencies', 'EUR', 'results', period2, 'result'])).to.equal(10175)
    expect(nextState.getIn(['currencies', 'EUR', 'results', period3, 'result'])).to.equal(10350)
  })
})

describe('changeUserCurrency', () => {
  const currencyInfo = fromJS({
    initialExchangeRate: 1.7
  })
  .setIn(['exchangeRates', period1], 1.68)
  .setIn(['exchangeRates', period2], 1.72)

  it('change nothing when send the same currency', () => {
    const nextState = core.changeUserCurrency(commonInitialState, 'USD', currencyInfo)
    expect(nextState).to.equal(commonInitialState)
  })

  it('change user currency property', () => {
    const nextState = core.changeUserCurrency(commonInitialState, 'GBP', currencyInfo)

    expect(nextState.get('userCurrency')).to.equal('GBP')
  })

  it('change initialExchangeRate, initialAmountInUserCurrency, exchange rates and recalculate results in currencies', () => {
    const nextState = core.changeUserCurrency(commonInitialState, 'GBP', currencyInfo)

    expect(nextState.getIn(['currencies', 'EUR', 'initialExchangeRate'])).to.equal(0.6471)
    expect(nextState.getIn(['currencies', 'EUR', 'initialAmountInUserCurrency'])).to.equal(6471.0)
    expect(nextState.getIn(['currencies', 'GBP', 'initialExchangeRate'])).to.equal(1.0)
    expect(nextState.getIn(['currencies', 'GBP', 'initialAmountInUserCurrency'])).to.equal(10000)

    //exchangeRates
    expect(nextState.getIn(['currencies', 'EUR', 'exchangeRates', period1, 'rate'])).to.equal(0.6548)
    expect(nextState.getIn(['currencies', 'EUR', 'exchangeRates', period2, 'rate'])).to.equal(0.6977)
    expect(nextState.getIn(['currencies', 'GBP', 'exchangeRates', period1, 'rate'])).to.equal(1.0)
    expect(nextState.getIn(['currencies', 'GBP', 'exchangeRates', period2, 'rate'])).to.equal(1.0)

    //recalculate results
    expect(nextState.getIn(['currencies', 'EUR', 'results', period2, 'resultInUserCurrency'])).to.equal(6977.0)
    expect(nextState.getIn(['currencies', 'GBP', 'results', period2, 'resultInUserCurrency'])).to.equal(10000)
    expect(nextState.getIn(['currencies', 'EUR', 'results', period1])).not.exist
    expect(nextState.getIn(['currencies', 'GBP', 'results', period1])).not.exist
  })

  it('change initialExchangeRate, initialAmountInUserCurrency, exchange rates and recalculate results in currencies with useInvest', () => {
    const initialState = commonInitialState.set('useInvest', true)
    .setIn(['currencies', 'EUR', 'results', period2], fromJS({term: period2, result: 10125.0 , resultInUserCurrency: 12150.0, investRate: 1.25}))
    .setIn(['currencies', 'GBP', 'results', period2], fromJS({term: period2, result: 10075.0 , resultInUserCurrency: 17127.5, investRate: 0.75}))
    const nextState = core.changeUserCurrency(initialState, 'GBP', currencyInfo)

    expect(nextState.getIn(['currencies', 'EUR', 'initialExchangeRate'])).to.equal(0.6471)
    expect(nextState.getIn(['currencies', 'EUR', 'initialAmountInUserCurrency'])).to.equal(6471.0)
    expect(nextState.getIn(['currencies', 'GBP', 'initialExchangeRate'])).to.equal(1.0)
    expect(nextState.getIn(['currencies', 'GBP', 'initialAmountInUserCurrency'])).to.equal(10000)

    //exchangeRates
    expect(nextState.getIn(['currencies', 'EUR', 'exchangeRates', period1, 'rate'])).to.equal(0.6548)
    expect(nextState.getIn(['currencies', 'EUR', 'exchangeRates', period2, 'rate'])).to.equal(0.6977)
    expect(nextState.getIn(['currencies', 'GBP', 'exchangeRates', period1, 'rate'])).to.equal(1.0)
    expect(nextState.getIn(['currencies', 'GBP', 'exchangeRates', period2, 'rate'])).to.equal(1.0)

    //recalculate results
    expect(nextState.getIn(['currencies', 'EUR', 'results', period2, 'resultInUserCurrency'])).to.equal(7064.21)
    expect(nextState.getIn(['currencies', 'GBP', 'results', period2, 'resultInUserCurrency'])).to.equal(10075)
    expect(nextState.getIn(['currencies', 'EUR', 'results', period1])).not.exist
    expect(nextState.getIn(['currencies', 'GBP', 'results', period1])).not.exist
  })
})

describe('changeUseInvest', () => {
  it('Should set useInvest to true when initial value is false', () => {
    const nextState = core.changeUseInvest(commonInitialState)

    expect(nextState.get('useInvest')).to.equal(true)
  })
  it('Should set useInvest to false when initial value is true', () => {
    const initialState = commonInitialState.set('useInvest', true)
    const nextState = core.changeUseInvest(initialState)

    expect(nextState.get('useInvest')).to.equal(false)
  })
  it('Should set useInvest to true when initial value is undefined', () => {
    const initialState = commonInitialState.delete('useInvest')
    const nextState = core.changeUseInvest(initialState)

    expect(nextState.get('useInvest')).to.equal(true)
  })
  it('Should recalculate results for all currencies', () => {
    const nextState = core.changeUseInvest(commonInitialState)

    expect(nextState.getIn(['currencies', 'EUR', 'results', period2, 'result'])).to.equal(10125)
    expect(nextState.getIn(['currencies', 'GBP', 'results', period2, 'result'])).to.equal(10075)
    expect(nextState.getIn(['currencies', 'EUR', 'results', period2, 'resultInUserCurrency'])).to.equal(12150)
    expect(nextState.getIn(['currencies', 'GBP', 'results', period2, 'resultInUserCurrency'])).to.equal(17329.0)
  })
})

describe('addCurrency', () => {
  it('should do nothing when adding currency that already is in state', () => {
    const currencyInfo = fromJS({})
    const nextState = core.addCurrency(commonInitialState, 'EUR', currencyInfo)

    expect(nextState).to.equal(commonInitialState)
  })
  it('Add currency entry, set initial ammount, results and exchange rates', () => {
    const currencyInfo = fromJS({
      initialExchangeRate: 68.0
    })
    .setIn(['exchangeRates', period1], 82.4)
    .setIn(['exchangeRates', period2], 70.12)

    const nextState = core.addCurrency(commonInitialState, 'RUB', currencyInfo)

    expect(nextState.get('currencies').size).to.equal(3)
    expect(nextState.getIn(['currencies', 'RUB', 'initialAmount'])).to.equal(0)
    expect(nextState.getIn(['currencies', 'RUB', 'initialExchangeRate'])).to.equal(68.0)
    expect(nextState.getIn(['currencies', 'RUB', 'results']).size).to.equal(1)
    expect(nextState.getIn(['currencies', 'RUB', 'results', period2, 'term'])).to.equal(period2)
    expect(nextState.getIn(['currencies', 'RUB', 'exchangeRates', period2, 'rate'])).to.equal(70.12)
    expect(nextState.getIn(['currencies', 'RUB', 'exchangeRates', period2, 'userCanChange'])).to.equal(true)
    expect(nextState.getIn(['currencies', 'RUB', 'exchangeRates', period1, 'userCanChange'])).to.equal(false)
  })
})

/*describe('set state', () => {
  it('return immutable state', () => {
    const initialState = fromJS({
      currencies: [],
      exchangeRateForecast: [],
      calcResults: [],
      userCurrency: 'usd',
      useInvest: false,
      avialableCurrencies: [],
      terms: [],
      baseCurrency: 'usd'
    });

    const nextState = setState(initialState);

    expect(nextState).to.equal(fromJS({
      currencies: [],
      exchangeRateForecast: [],
      calcResults: [],
      userCurrency: 'usd',
      useInvest: false,
      avialableCurrencies: [],
      terms: [],
      baseCurrency: 'usd'
    }));
  });

  it('return immutable state from plain js object', () => {
    const initialState = {
      currencies: [],
      exchangeRateForecast: [],
      calcResults: [],
      userCurrency: 'usd',
      useInvest: false,
      avialableCurrencies: [],
      terms: [],
      baseCurrency: 'usd'
    };

    const nextState = setState(initialState);

    expect(nextState).to.equal(fromJS({
      currencies: [],
      exchangeRateForecast: [],
      calcResults: [],
      userCurrency: 'usd',
      useInvest: false,
      avialableCurrencies: [],
      terms: [],
      baseCurrency: 'usd'
    }));
  });

  it('return initial state when send undefine', () => {
    const nextState = setState(undefined);

    expect(nextState.get('currencies').size).to.equal(nextState.get('exchangeRateForecast').size);
    expect(nextState.get('currencies').size).to.equal(nextState.get('calcResults').size);
    expect(nextState.get('useInvest')).to.equal(true);
    expect(nextState.get('baseCurrency')).to.equal('usd');
  });

});

describe('addCurrency', () => {
  it('add new currency to 3 main arrays', () => {

  });
});*/
