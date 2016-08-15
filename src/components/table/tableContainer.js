import * as fromReducer from '../../reducers'
import Table from './table'
import {connect} from 'react-redux'
import * as actions from '../../actions.actionCreator'

const mapStateToProps = state => ({
  currencies: fromReducer.getCurrenciesForTable(state),
  currenciesForAdding: fromReducer.getCurrenciesForAdding(state),

  pastTerms: fromReducer.getPastTerms(state),
  futureTerms: fromReducer.getResultTerms(state),
  currentTerm: fromReducer.getCurrentTerm(state),
  userCurrency: fromReducer.getUserCurrency(state)
})

const mapDispatchToProps = dispatch => ({
  addCurrency: (currency, userCurrency, pastTerms, futureTerms, currentTerm) => dispatch(actions.addCurrency(
    currency,
    userCurrency,
    pastTerms,
    futureTerms,
    currentTerm
  )),
  changeAmount: (currencyId, newAmount) => dispatch(actions.changeCurrencyAmount(currencyId, newAmount)),
  changeInvestRate: (currencyId, newInvestRate) => dispatch(actions.changeInvestRate(currencyId, newInvestRate))
})

const mergeProps = (stateProps, dispatchProps, ownProps) => ({
  ...ownProps,
  currencies: stateProps.currencies,
  currenciesForAdding: stateProps.currenciesForAdding,
  changeAmount: dispatchProps.changeAmount,
  changeInvestRate: dispatchProps.changeInvestRate,
  addCurrency: currency => dispatchProps.addCurrency(
    currency,
    stateProps.userCurrency,
    stateProps.pastTerms,
    stateProps.futureTerms,
    stateProps.currentTerm
  )
})

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(Table)
