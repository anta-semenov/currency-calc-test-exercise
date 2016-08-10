import * as actionTypes from '../constants/actionTypes';

export function changeCircleCoord(y) {
  return {type: actionTypes.CHANGE_CIRCLE_COORD, y:y};
}

export function startExRateChanging(id, x) {
  return {type: actionTypes.START_EXCHANGE_RATE_CHANGING, id: id, x: x};
}

export function stopExRateChanging() {
  return {type: actionTypes.STOP_EXCHANGE_RATE_CHANGING};
}

export const changeCurrencyAmount = (currencyId, newAmount) => ({ type: actionTypes.CHANGE_CURRENCY_AMOUNT, currencyId, newAmount})
