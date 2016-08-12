import {fromJS} from 'immutable';

export function changeExRateCoordinate(state, newExRate) {
  if (state.get('currentCircle')) {
    const currentId = state.get('currentCircle').get('id');
    const currentX = state.get('currentCircle').get('x');
    const idIndex = state.get('circles').findIndex((circle) => {return (circle.get('id') === currentId);});
    const xIndex = state.get('circles').get(idIndex).get('rates').findIndex((xy) => {return (xy.get('x') === currentX);});
    return state.setIn(['circles', idIndex, 'rates', xIndex, 'y'], newExRate);
  } else {
    return state;
  }
}

export function startExRateChanging(state, id, x) {
  const circle = fromJS({id:id, x:x});
  return state.set('currentCircle', circle);
}

export function stopExRateChanging(state) {
  if (state.get('currentCircle')) {
    return state.delete('currentCircle');
  } else {
    return state;
  }
}

export function round(amount, precision) {
  return Math.round(amount*(10**precision))/(10**precision)
}

export function recalculateResult(state, currencyID, term) {
  const useInvest = state.get('useInvest')
  const exchangeRate = state.getIn(['currencies', currencyID, 'exchangeRates', term, 'rate'])
  const initialAmount = state.getIn(['currencies', currencyID, 'initialAmount'])
  const currentResult = state.getIn(['currencies', currencyID, 'results', term])
  return state.setIn(
    ['currencies', currencyID, 'results', term],
    currentResult.withMutations(map => {
      map.set('result', useInvest ? round(initialAmount*(1+map.get('investRate')/100), 2): initialAmount)
      .set('resultInUserCurrency', round(map.get('result')*exchangeRate, 2))
    })
  )
}

export function changeExchangeRate(state, newRate) {
  if (state.get('changingCurrencyRate')) {
    const currency = state.getIn(['changingCurrencyRate', 'id'])
    const term = state.getIn(['changingCurrencyRate', 'term'])
    const temp = state.setIn(['currencies', currency, 'exchangeRates', term, 'rate'], newRate)
    return recalculateResult(temp, currency, term)
  } else {
    return state
  }
}

export function changeCurrencyAmount(state, currencyID, newAmount) {
  const tempCurrency = state.getIn(['currencies', currencyID]).withMutations(map => {
    map.set('initialAmount', round(newAmount,2))
    .set('initialAmountInUserCurrency', round(newAmount*map.get('initialExchangeRate'), 2))
  })
  return recalculateResults(
    state.setIn(['currencies', currencyID], tempCurrency),
    currencyID
  )
}

function recalculateResults(state, currencyID) {
  const useInvest = state.get('useInvest')
  const initialAmount = state.getIn(['currencies', currencyID, 'initialAmount'])
  return state.updateIn(['currencies', currencyID, 'results'], val => val.map(item => {
    return item.withMutations(map => {
      const exchangeRate = state.getIn(['currencies', currencyID, 'exchangeRates', map.get('term'), 'rate'])
      map.set('result', useInvest ? round(initialAmount*(1+ map.get('investRate')/100),2) : initialAmount)
      .set('resultInUserCurrency', round(map.get('result')*exchangeRate,2))
    })
  }))

}

export function changeCurrencyInvestRate(state, currencyID, investRate) {
  const temp = state.setIn(['currencies', currencyID, 'investRate'], investRate)
  .updateIn(['currencies', currencyID, 'results'], val => val.map(item => {
    const investMult = state.getIn(['terms', item.get('term'), 'investRateMult'])
    return item.set('investRate', round(investRate*investMult, 3))
  }))

  return recalculateResults(temp, currencyID)
}

export function changeUserCurrency(state, currencyID, currencyInfo) {
  if (state.get('userCurrency') === currencyID) {
    return state
  } else {
    return state.set('userCurrency', currencyID).updateIn(['currencies'], val => val.map(item => {
      return item.withMutations(map => {
        map.set('initialExchangeRate', round(map.get('initialExchangeRate')/currencyInfo.get('initialExchangeRate'), 4))
        .set('initialAmountInUserCurrency', round(map.get('initialExchangeRate')*map.get('initialAmount'),2))
        .set('exchangeRates', map.get('exchangeRates').withMutations(rates => {
          rates.mergeWith((prev, next) => prev.set('rate', round(prev.get('rate')/next,4)), currencyInfo.get('exchangeRates'))
        }))
        .set('results', map.get('results').withMutations(results => {
          results.mergeWith(
            (prev, next) => prev.set('resultInUserCurrency', round(prev.get('result')*next.get('rate'),2)),
            map.get('exchangeRates').filter((rate, term) => results.has(term)))
        }))
      })
    }))
  }
}

export function changeUseInvest(state) {
  const useInvest = !state.get('useInvest', false)
  return state.set('useInvest', useInvest).updateIn(['currencies'], val => val.map(item => {
    return item.set('results', item.get('results').mergeWith(
      (prev, next) => prev.withMutations(map =>
        map.set('result', useInvest ? round(item.get('initialAmount')*(1+map.get('investRate')/100),2) : item.get('initialAmount'))
        .set('resultInUserCurrency', round(map.get('result')*next.get('rate'),2))
      ),
      item.get('exchangeRates').filter((rate, term) => item.get('results').has(term))
    ))
  }))
}

export function addCurrency(state, currencyID, currencyInfo) {
  if (state.get('currencies').has(currencyID)) {
    return state
  } else {
    return state.setIn(['currencies', currencyID], currencyInfo.withMutations(currency =>
      currency.set('initialAmount', 0).set('initialAmountInUserCurrency', 0).set('investRate', 0).set('id', currencyID)
      .setIn(['results'], state.get('terms').map((value, key) =>
        fromJS({
          term: key,
          result: 0,
          resultInUserCurrency: 0,
          investRate: 0
        })
      ))
      .setIn(['exchangeRates'], currency.get('exchangeRates').map((value, key) => {
        const terms = state.get('terms')
        return fromJS({
          term: key,
          rate: value,
          userCanChange: terms.has(key)
        })
      }))
    ))
  }
}
