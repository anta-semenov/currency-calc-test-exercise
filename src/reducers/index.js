import {CHANGE_CIRCLE_COORD, START_EXCHANGE_RATE_CHANGING, STOP_EXCHANGE_RATE_CHANGING} from '../constants/actionTypes';
import {fromJS} from 'immutable';
import {changeExRateCoordinate, startExRateChanging, stopExRateChanging} from './core';

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

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case CHANGE_CIRCLE_COORD:
      return changeExRateCoordinate(state, action.y);
    case START_EXCHANGE_RATE_CHANGING:
      return startExRateChanging(state, action.id, action.x);
    case STOP_EXCHANGE_RATE_CHANGING:
      return stopExRateChanging(state);
    default:
      return state;
  }
}
