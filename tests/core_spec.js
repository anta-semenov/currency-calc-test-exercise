import {changeExRateCoordinate, startExRateChanging, stopExRateChanging, changeExchangeRate, recalculateResult, changeCurrencyAmount} from './../src/reducers/core'
import {expect} from 'chai'
import {fromJS} from 'immutable'

const period1 = new Date(2015,12,1).getTime()
const period2 = new Date(2016,3,1).getTime()
const period3 = new Date(2016,6,1).getTime()

const initialStatePlainJS = fromJS({
  currencies: {
    'EUR': {
      id: 'EUR',
      initialAmount: 10000.0,
      investRate: 5.0,
      initialExchangeRate: 1.1,
      initialAmountInUserCurrency: 11000.0,
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

    const nextState = changeExRateCoordinate(initialState, 120);

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

    const nextState = startExRateChanging(initialState, 1, 30);

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

    const nextState = stopExRateChanging(initialState);

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
    //console.log(initialStatePlainJS)
    const initialState = initialStatePlainJS
    //console.log(initialState.getIn(['currencies', 'EUR', 'results', period2]))

    const nextState = recalculateResult(initialState, 'EUR', period2)

    expect(nextState.getIn(['currencies', 'EUR', 'results', period2, 'result'])).to.equal(10000.0)
    expect(nextState.getIn(['currencies', 'EUR', 'results', period2, 'resultInUserCurrency'])).to.equal(12000.0)
  })

  it('calculate new result when initial amount was changed', () => {
    const initialState = initialStatePlainJS.setIn(['currencies', 'EUR', 'initialAmount'], 11000.0)

    const nextState = recalculateResult(initialState, 'EUR', period2)

    expect(nextState.getIn(['currencies', 'EUR', 'results', period2, 'result'])).to.equal(11000.0)
    expect(nextState.getIn(['currencies', 'EUR', 'results', period2, 'resultInUserCurrency'])).to.equal(13200.0)
  })

  it('calculate new result when use invest was changed', () => {
    const initialState = initialStatePlainJS.set('useInvest', true)

    const nextState = recalculateResult(initialState, 'EUR', period2)

    expect(nextState.getIn(['currencies', 'EUR', 'results', period2, 'result'])).to.equal(10125.0)
    expect(nextState.getIn(['currencies', 'EUR', 'results', period2, 'resultInUserCurrency'])).to.equal(12150.0)
  })

  it('calculate new result when invest rate was changed and useInvest is true', () => {
    const initialState = initialStatePlainJS
      .set('useInvest', true)
      .setIn(['currencies', 'EUR', 'results', period2, 'investRate'], 2.0)

    const nextState = recalculateResult(initialState, 'EUR', period2)

    expect(nextState.getIn(['currencies', 'EUR', 'results', period2, 'result'])).to.equal(10200.0)
    expect(nextState.getIn(['currencies', 'EUR', 'results', period2, 'resultInUserCurrency'])).to.equal(12240.0)
  })
})

describe('changeExchangeRate', () => {
  it('do nithing when no changingCurrencyRate', () => {
    const initialState = fromJS(initialStatePlainJS)

    const nextState = changeExchangeRate(initialState, 1.0786)

    expect(nextState).to.equal(fromJS(initialStatePlainJS))
  })

  it('change ex rate and recalculate results for currency and term without invest rate', () => {
    const initialState = fromJS(initialStatePlainJS).set('changingCurrencyRate', fromJS({id:'EUR', term: period2}))

    const nextState = changeExchangeRate(initialState, 1.4)

    expect(nextState.getIn(['currencies', 'EUR', 'exchangeRates', period1, 'rate'])).to.equal(1.1)
    expect(nextState.getIn(['currencies', 'EUR', 'exchangeRates', period2, 'rate'])).to.equal(1.4)
    expect(nextState.getIn(['currencies', 'EUR', 'results', period2, 'resultInUserCurrency'])).to.equal(14000.0)
  })

  it('change ex rate and recalculate results for currency and term with invest rate', () => {
    const initialState = initialStatePlainJS.set('changingCurrencyRate', fromJS({id:'EUR', term: period2})).set('useInvest', true)
    const nextState = changeExchangeRate(initialState, 1.4)

    expect(nextState.getIn(['currencies', 'EUR', 'exchangeRates', period1, 'rate'])).to.equal(1.1)
    expect(nextState.getIn(['currencies', 'EUR', 'exchangeRates', period2, 'rate'])).to.equal(1.4)
    expect(nextState.getIn(['currencies', 'EUR', 'results', period2, 'resultInUserCurrency'])).to.equal(14175.0)
  })
})

describe('changeCurrencyAmount', () => {
  it('change amount and recalculate amount in user currency', () => {
    const nextState = changeCurrencyAmount(initialStatePlainJS, 'EUR', 15000.0)

    expect(nextState.getIn(['currencies', 'EUR', 'initialAmount'])).to.equal(15000.0)
    expect(nextState.getIn(['currencies', 'EUR', 'initialAmountInUserCurrency'])).to.equal()
  })

  it('recalculate results for all terms without invest when no useInvest', () => {
    const initialState = initialStatePlainJS.setIn(
      ['currencies', 'EUR', 'results', period3],
      fromJS({term: period2, result: 10000.0 , resultInUserCurrency: 13000.0, investRate: 1.25})
    ).setIn(
      ['currencies', 'EUR', 'exchangeRates', period3],
      fromJS({term: period2, rate: 1.3, userCanChange: true})
    )

    const nextState = changeCurrencyAmount(initialState, 'EUR', 15000.0)

    expect(nextState.getIn(['currencies', 'EUR', 'results', period2, 'result'])).to.equal(15000.0)
    expect(nextState.getIn(['currencies', 'EUR', 'results', period2, 'resultInUserCurrency'])).to.equal(18000.0)
    expect(nextState.getIn(['currencies', 'EUR', 'results', period3, 'result'])).to.equal(15000.0)
    expect(nextState.getIn(['currencies', 'EUR', 'results', period3, 'resultInUserCurrency'])).to.equal(19500.0)
  })
  it('recalculate results for all terms with invest when useInvest', () => {
    const initialState = initialStatePlainJS.setIn(
      ['currencies', 'EUR', 'results', period3],
      fromJS({term: period2, result: 10000.0 , resultInUserCurrency: 13000.0, investRate: 2.5})
    ).setIn(
      ['currencies', 'EUR', 'exchangeRates', period3],
      fromJS({term: period2, rate: 1.3, userCanChange: true})
    ).set('useInvest', true)

    const nextState = changeCurrencyAmount(initialState, 'EUR', 15000.0)

    expect(nextState.getIn(['currencies', 'EUR', 'results', period2, 'result'])).to.equal(15187.5)
    expect(nextState.getIn(['currencies', 'EUR', 'results', period2, 'resultInUserCurrency'])).to.equal(18225.0)
    expect(nextState.getIn(['currencies', 'EUR', 'results', period3, 'result'])).to.equal(15375.0)
    expect(nextState.getIn(['currencies', 'EUR', 'results', period3, 'resultInUserCurrency'])).to.equal(19987.5)
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
