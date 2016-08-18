import {connect} from 'react-redux'
import ResultGraph from './ResultGraph'
import * as fromReducer from '../../reducers'

const mapStateToProps = state => {
  const data = fromReducer.getD3ResultGraphStackInput(state)
  return({
    results: data.result,
    maxValue: data.maxValue,
    colors: fromReducer.getCurrenciesColors(state),
    currenciesIds: fromReducer.getCurrenciesIds(state)
  })
}

export default connect(mapStateToProps)(ResultGraph)
