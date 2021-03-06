import * as fromReducer from '../../reducers'
import Table from './Table'
import {connect} from 'react-redux'
import * as actions from '../../actions/actionCreator'

const mapStateToProps = state => ({
  currencies: fromReducer.getCurrenciesForTable(state),
  currenciesForAdding: fromReducer.getCurrenciesForAdding(state),
  useInvest: fromReducer.getUseInvest(state),
  userCurrencyLabel: fromReducer.getUserCurrencyLabel(state),

  pastTerms: fromReducer.getPastTerms(state),
  futureTerms: fromReducer.getFutureTermsArray(state),
  currentTerm: fromReducer.getCurrentTerm(state),
  userCurrency: fromReducer.getUserCurrency(state)
})

const mapDispatchToProps = dispatch => ({
  addCurrency: (currency, userCurrency, pastTerms, futureTerms, currentTerm) => {dispatch(actions.addCurrency(
    currency,
    userCurrency,
    pastTerms,
    futureTerms,
    currentTerm
  ))},
  changeAmount: (currencyId, newAmount) => dispatch(actions.changeCurrencyAmount(currencyId, newAmount)),
  changeInvestRate: (currencyId, newInvestRate) => dispatch(actions.changeInvestRate(currencyId, newInvestRate)),
  removeCurrency: currencyId => dispatch(actions.removeCurrency(currencyId))
})

const mergeProps = (stateProps, dispatchProps, ownProps) => ({
  ...ownProps,
  currencies: stateProps.currencies,
  currenciesForAdding: stateProps.currenciesForAdding,
  useInvest: stateProps.useInvest,
  userCurrencyLabel: stateProps.userCurrencyLabel,

  changeAmount: dispatchProps.changeAmount,
  changeInvestRate: dispatchProps.changeInvestRate,
  addCurrency: currency => dispatchProps.addCurrency(
    currency,
    stateProps.userCurrency,
    stateProps.pastTerms,
    stateProps.futureTerms,
    stateProps.currentTerm
  ),
  removeCurrency: dispatchProps.removeCurrency
})

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(Table)
