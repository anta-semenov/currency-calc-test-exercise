import * as actionTypes from '../constants/actionTypes';

export const changeCircleCoord = (y) => ({type: actionTypes.CHANGE_CIRCLE_COORD, y:y})

export const startExRateChanging = (id, x) => ({type: actionTypes.START_EXCHANGE_RATE_CHANGING, id: id, x: x})

export const stopExRateChanging = () => ({type: actionTypes.STOP_EXCHANGE_RATE_CHANGING})

export const changeCurrencyAmount = (currencyId, newAmount) => ({type: actionTypes.CHANGE_CURRENCY_AMOUNT, currencyId, newAmount})

export const changeInvestRate = (currencyId, newInvestRate) => ({type: actionTypes.CHANGE_CURRENCY_INVEST_RATE, currencyId, newInvestRate})

export const addCurrency = (currencyInfo) => ({type: actionTypes.ADD_CURRENCY, currencyInfo})
