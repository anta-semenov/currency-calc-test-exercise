import React from 'react'
import './TableRow.less'

const TableRow = (props) => (
  <tr className='table-row'>
    <td>
      <div>{props.label}</div>
      <div>{props.initialAmount}</div>
    </td>
    <td>{props.amountInUserCurrency}</td>
    <td>
      <input value={props.investRate} onChange={(e) => props.changeInvestRate(e.target.value)}/>
    </td>
  </tr>
)

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
