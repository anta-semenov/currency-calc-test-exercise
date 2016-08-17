import {CHANGE_USE_INVEST, SET_STATE} from '../constants/actionTypes'

const useInvest = (state = false, action) => {
  switch (action.type) {
    case CHANGE_USE_INVEST:
      return !state
    case SET_STATE:
      return action.state.useInvest || state
    default:
      return state
  }
}

export default useInvest
