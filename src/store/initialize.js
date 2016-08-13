import {loadState, saveState} from './localStorage'
import * as actions from './actions/actionCreator'
import * as fromReducer from '../reducers'

export const initializeState = (store) => {
  store.subscribe(saveState(store))

  const savedState = loadState()

  //Init or reinit state
  const currentDate = +new Date()
  if (!savedState || !savedState.currentDate || currentDate - savedState.currentDate > 5*86400000) {
    let startDate = new Date
    startDate.setHours(0)
    startDate.setMinutes(0)
    startDate.setSeconds(0)
    startDate.setMilliseconds(0)
    startDate = startDate.getTime()

    store.dispatch(actions.initStart())
    store.dispatch(actions.initTerms(startDate))

    store.dispatch(actions.initPastExchangeRates(
      fromReducer.getPastTerms(store.getState()),
      fromReducer.getCurrentTerm(store.getState()),
      fromReducer.getCurrenciesIds(store.getState()),
      fromReducer.getBaseCurrency(store.getState())
    ))

    store.dispatch(actions.initFutureExchangeRates(
      fromReducer.getFutureTerms(store.getState()),
      fromReducer.getCurrentRates(store.getState())
    ))

    if (!fromReducer.getInitErrors(store.getState())) {
      store.dispatch(actions.initSuccess())
    }
  } else {
    store.dispatch(actions.setState(savedState))
  }
}
