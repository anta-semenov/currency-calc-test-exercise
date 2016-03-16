import {CHANGE_CIRCLE_COORD, START_EXCHANGE_RATE_CHANGING, STOP_EXCHANGE_RATE_CHANGING} from '../constants/actionTypes';

export function changeCircleCoord(y) {
  return {type:CHANGE_CIRCLE_COORD, y:y};
}

export function startExRateChanging(id, x) {
  return {type:START_EXCHANGE_RATE_CHANGING, id: id, x: x};
}

export function stopExRateChanging() {
  return {type: STOP_EXCHANGE_RATE_CHANGING};
}
