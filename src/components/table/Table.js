import React from 'react'
import TableRow from './tableRow/TableRow'
import AddCurrencyMenu from './addCurrencyButton/AddCurrencyMenu'
import FlipMove from 'react-flip-move'
import classnames from 'classnames'
import './Table.less'

const Table = ({currencies, changeAmount, changeInvestRate, useInvest, removeCurrency, userCurrencyLabel, ...rest}) => {
  const investStyle = classnames({
    'table-header--third-column': true,
    hidden: !useInvest
  })
  return(
    <div className='table-container'>
      <div className='table'>
        <div className='table-header'>
          <div className='table-header--first-column'>{'Savings'.toLocaleString()}</div>
          <div className='table-header--second-column'>{`${'In my currency'.toLocaleString()}, ${userCurrencyLabel || ''}`}</div>
          <div className={investStyle}>{`${'Invest rate'.toLocaleString()}, %`}</div>
        </div>
        <FlipMove enterAnimation="fade" leaveAnimation="fade">
          {currencies.map(item =>
            <TableRow
              key={item.currencyId}
              changeAmount={newAmount => changeAmount(item.currencyId, newAmount)}
              changeInvestRate={newInvestRate => changeInvestRate(item.currencyId, newInvestRate)}
              useInvest={useInvest}
              removeCurrency={() => removeCurrency(item.currencyId)}
              {...item}
            />
          )}
        </FlipMove>
      </div>
      {rest.currenciesForAdding.length > 0 ? <AddCurrencyMenu {...rest} /> : null}
    </div>
  )
}


Table.propTypes = {
  currencies: React.PropTypes.array.isRequired,
  currenciesForAdding: React.PropTypes.array.isRequired,
  userCurrencyLabel: React.PropTypes.string,

  changeAmount: React.PropTypes.func.isRequired,
  changeInvestRate: React.PropTypes.func.isRequired,
  addCurrency: React.PropTypes.func.isRequired,
  removeCurrency: React.PropTypes.func.isRequired
}

export default Table
