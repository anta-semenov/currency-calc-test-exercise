import React from 'react'
import './TableRow.less'
import classnames from 'classnames'

const numberInput = (e, action, decimal) => {
  const numberString = e.target.value.replace(/( )/g, '').replace(',','.')
  const regExpString = '[^0-9' + (decimal ? '\.,' : '') + ']'
  if (!new RegExp(regExpString).test(numberString)) {
    action(numberString)
  }
}

const formatNumber = number => number.toString(10).replace(/(\d)(?=(?:\d{3})+($|\.))/g, '$1 ')

const TableRow = (props) => {
  const investStyle = classnames({
    'table-row--invest': true,
    hidden: !props.useInvest
  })
  return(
    <div className='table-row'>
      <div className='table-row--label-amount-cell'>
        <div className='table-row--label' style={{backgroundColor: props.color}}>{props.label}</div>
        <input
          className='table-row--amount'
          placeholder='0'
          value={props.initialAmount === 0 ? undefined : formatNumber(props.initialAmount)}
          onChange={(e) => numberInput(e, props.changeAmount)}
        />
      </div>
      <div className='table-row-user--currency-amount'>{formatNumber(props.amountInUserCurrency)}</div>
      <input
        className={investStyle}
        disabled={!props.useInvest}
        placeholder='0'
        value={props.investRate === 0 && props.useInvest ? undefined : props.investRate}
        onChange={(e) => numberInput(e, props.changeInvestRate, true)}
      />
    </div>
  )
}

TableRow.propTypes = {
  label: React.PropTypes.string.isRequired,
  color: React.PropTypes.string.isRequired,
  initialAmount: React.PropTypes.number.isRequired,
  amountInUserCurrency: React.PropTypes.number.isRequired,
  investRate: React.PropTypes.number.isRequired,
  useInvest: React.PropTypes.bool,

  changeAmount: React.PropTypes.func.isRequired,
  changeInvestRate: React.PropTypes.func.isRequired
}

export default TableRow
