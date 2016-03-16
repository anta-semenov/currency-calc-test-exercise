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

export function recalculateResult(state, currencyID, term) {
  const useInvest = state.get('useInvest')
  const exchangeRate = state.getIn(['currencies', currencyID, 'exchangeRates', term, 'rate'])
  const initialAmount = state.getIn(['currencies', currencyID, 'initialAmount'])
  const currentResult = state.getIn(['currencies', currencyID, 'results', term])
  return state.setIn(
    ['currencies', currencyID, 'results', term],
    currentResult.withMutations(map => {
      map.set('result', useInvest ? initialAmount*(1+map.get('investRate')/100) : initialAmount)
      .set('resultInUserCurrency', map.get('result')*exchangeRate)
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
