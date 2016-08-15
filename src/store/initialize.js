import {loadState, saveState} from './localStorage'
import * as actions from './actions/actionCreator'
import * as fromReducer from '../reducers'

export const initializeState = (store) => {
  store.subscribe(saveState(store))

  const savedState = loadState()

  //Init or reinit state
  const currentDate = +new Date()
  const stateCurrentDate = savedState ? fromReducer.getCurrentTerm(savedState) : undefined
  if (!stateCurrentDate || currentDate - stateCurrentDate > 5*86400000) {
    let startDate = new Date
    startDate.setHours(0)
    startDate.setMinutes(0)
    startDate.setSeconds(0)
    startDate.setMilliseconds(0)
    startDate = startDate.getTime()

    store.dispatch(actions.initStart())
    store.dispatch(actions.initTerms(startDate))
    store.dispatch(actions.changeUserCurrencyEnd('RUB'))

    //add first three cyrrencies it can be changed for more intelect way latter
    const currenciesForAdd = fromReducer.getCurrenciesForAdding(store.getState())
    store.dispatch(actions.addCurrencyResult({
      ...currenciesForAdd[0],
      initialAmount: 0,
      investRate: 0
    }, {}, {}))
    store.dispatch(actions.addCurrencyResult({
      ...currenciesForAdd[1],
      initialAmount: 0,
      investRate: 0
    }, {}, {}))
    store.dispatch(actions.addCurrencyResult({
      ...currenciesForAdd[2],
      initialAmount: 0,
      investRate: 0
    }, {}, {}))

    store.dispatch(actions.initPastExchangeRates(
      fromReducer.getPastTerms(store.getState()),
      fromReducer.getCurrentTerm(store.getState()),
      fromReducer.getCurrenciesIds(store.getState()),
      fromReducer.getUserCurrency(store.getState())
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
