import {connect} from 'react-redux'
import Header from './Header'
import * as fromReducer from '../../reducers'
import * as actions from '../../actions/actionCreator'

const mapStateToProps = state => ({
  useInvest: fromReducer.getUseInvest(state),
  userCurrency: fromReducer.getUserCurrency(state),
  availableCurrencies: fromReducer.availableCurrencies,

  pastTerms: fromReducer.getPastTerms(state),
  futureTerms: fromReducer.getResultTerms(state),
  currentTerm: fromReducer.getCurrentTerm(state)
})

const mapDispatchToProps = dispatch => ({
  changeUserCurrency: (...args) =>
    dispatch(actions.changeUserCurrency(...args)),
  changeUseInvest: () => dispatch(actions.changeUseInvest())
})

const mergeProps = (stateProps, dispatchProps, ownProps) => ({
  ...ownProps,
  useInvest: stateProps.useInvest,
  userCurrency: stateProps.userCurrency,
  availableCurrencies: stateProps.availableCurrencies,

  changeUseInvest: dispatchProps.changeUseInvest,
  changeUserCurrency: newCurrency => dispatchProps.changeUserCurrency(
    newCurrency,
    stateProps.userCurrency,
    stateProps.pastTerms,
    stateProps.futureTerms,
    stateProps.currentTerm
  )
})

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(Header)
