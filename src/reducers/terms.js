import {createSelector} from 'reselect'
import {SET_STATE} from '../constants/actionTypes'

const terms = (state = [], action) => {
  switch (action.type) {
    case SET_STATE:
      return action.state.terms || state
    default:
      return state
  }
}

export default terms

export const getTermsForFuture = createSelector(
  state => state,
  state => state.filter(item => item.investRateMultiplicator !== undefined).map(item => item.term)
)

export const getTermsForResults = createSelector(
  state => state,
  state => state.filter(item => item.investRateMultiplicator !== undefined)
)

export const getPastTerms = createSelector(
  state => state,
  state => state.filter(item => item.investRateMultiplicator === undefined).map(item => item.term)
)

export const getCurrentTerm = createSelector(
  state => state,
  state => state.find(item => item.isInitial).term
)
