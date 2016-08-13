import * as fromReducer from '../../reducers'
import Table from './table'
import {connect} from 'react-redux'
import {openAddCurrencyDialog} from '../../actions.actionCreator'

const mapStateToProps = state => ({
  currencies: fromReducer.getCurrenciesForTable(state),
  currenciesForAdding: fromReducer.getCurrenciesForAdding(state)
})

const mapDispatchToProps = dispatch => ({
  addCurrency: () => dispatch(openAddCurrencyDialog())
})

export default connect(mapStateToProps, mapDispatchToProps)(Table)
