import React from 'react'
import TableRow from './tableRow/TableRow'
import AddCurrencyButton from './addCurrencyButton/AddCurrencyButton'
import classnames from 'classnames'
import './Table.less'

const Table = ({currencies, changeAmount, changeInvestRate, useInvest, ...rest}) => {
  const investStyle = classnames({
    'table-header--third-column': true,
    hidden: !useInvest
  })
  return(
    <div className='table-container'>
      <div className='table'>
        <div className='table-header'>
          <div className='table-header--first-column'>Savings</div>
          <div className='table-header--second-column'>In my currency</div>
          <div className={investStyle}>Invest rate, %</div>
        </div>
        {currencies.map(item =>
          <TableRow
            key={item.currencyId}
            changeAmount={newAmount => changeAmount(item.currencyId, newAmount)}
            changeInvestRate={newInvestRate => changeInvestRate(item.currencyId, newInvestRate)}
            useInvest={useInvest}
            {...item}
          />
        )}
      </div>
      <AddCurrencyButton {...rest} />
    </div>
  )
}


Table.propTypes = {
  currencies: React.PropTypes.array.isRequired,
  currenciesForAdding: React.PropTypes.array.isRequired,

  changeAmount: React.PropTypes.func.isRequired,
  changeInvestRate: React.PropTypes.func.isRequired,
  addCurrency: React.PropTypes.func.isRequired
}

export default Table
