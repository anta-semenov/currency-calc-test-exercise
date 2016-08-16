import React from 'react'
import TableRow from './tableRow/TableRow'
import AddCurrencyButton from './addCurrencyButton/AddCurrencyButton'
import './Table.less'

const Table = ({currencies, changeAmount, changeInvestRate, ...rest}) => (
  <div className='table-container'>
    <table className='table'>
      <thead>
        <tr>
          <td>Savings</td>
          <td>Savings in my currency</td>
          <td>Invest rate</td>
        </tr>
      </thead>
      <tbody>
        {currencies.map(item =>
          <TableRow
            key={item.currencyId}
            changeAmount={newAmount => changeAmount(item.currencyId, newAmount)}
            changeInvestRate={newInvestRate => changeInvestRate(item.currencyId, newInvestRate)}
            {...item}
          />
        )}
      </tbody>
    </table>
    <AddCurrencyButton {...rest} />
  </div>
)


Table.propTypes = {
  currencies: React.PropTypes.array.isRequired,
  currenciesForAdding: React.PropTypes.array.isRequired,

  changeAmount: React.PropTypes.func.isRequired,
  changeInvestRate: React.PropTypes.func.isRequired,
  addCurrency: React.PropTypes.func.isRequired
}

export default Table
