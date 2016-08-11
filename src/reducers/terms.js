import {createSelector} from 'reselect'

const terms = (state = [], action) => action.state.terms || state

export default terms

export const getTermsForResults = createSelector(
  state => state,
  state => state.filter(item => item.investRateMultiplicator !== undefined)
)

export const getPastTerms = createSelector(
  state => state,
  state => state.filter(item => item.investRateMultiplicator === undefined)
)
