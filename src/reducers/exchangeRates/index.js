import {combineReducers} from 'redux'
import past, * as fromPast from './past'
import future from './future'

const reducer = combineReducers(
  past,
  future
)

export default reducer

/*
* Selectors
*/

export const getPastExchangeRates = state => state.past
export const getFutureExchangeRates = state => state.futurre
export const getAllExchangeRates = state => ({...state.past, ...state.future})

export const getInitialRates = state => fromPast.getInitialRates(state.past)
