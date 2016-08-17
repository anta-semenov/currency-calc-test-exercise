import {CHANGE_USER_CURRENCY, SET_STATE} from '../constants/actionTypes'

const userCurrency = (state = 'RUB', action) => {
  switch (action.type) {
    case CHANGE_USER_CURRENCY:
      return action.newUserCurrency
    case SET_STATE:
      return action.state.userCurrency || state
    default:
      return state
  }
}

export default userCurrency
