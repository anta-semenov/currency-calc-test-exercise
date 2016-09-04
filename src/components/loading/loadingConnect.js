import {connect} from 'react-redux'
import Loading from './Loading'
import * as fromReducer from '../../reducers'

const mapStateToProps = state => ({
  isLoading: fromReducer.getLoading(state)
})

export default connect(mapStateToProps)(Loading)
