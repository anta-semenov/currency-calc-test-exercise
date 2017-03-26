import React from 'react'
import './UserCurrency.less'
import AppearingMenu from '../../appearingMenu/AppearingMenu'
import AddCurrencyButton from '../../table/addCurrencyButton/AddCurrencyButton'

const UserCurrency = ({userCurrency, availableCurrencies, changeUserCurrency}) => {
  const items = availableCurrencies.map(item => (
    <AddCurrencyButton {...item} addCurrency={changeUserCurrency} key={item.currencyId} />
  ))
  const labelComponent = (
    <div className='user-currency-label'>
      {userCurrency.label}
      <svg
        className='user-currency-triangle-svg'
        viewBox="0 0 16 16"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path className="user-currency-triangle" d="M5 6h10l-5 9-5-9z"></path>
      </svg>
    </div>
  )

  return(
    <div className='user-currency-menu'>
      <div className='user-currency-title'>{'My currency'.toLocaleString()}</div>
      <AppearingMenu
        labelComponent={labelComponent}
        menuItems={items}
        direction='vertical'
        className='user-currency-border-style'
      />
    </div>
  )
}

UserCurrency.propTypes = {
  userCurrency: React.PropTypes.object.isRequired,
  availableCurrencies: React.PropTypes.array.isRequired,
  changeUserCurrency: React.PropTypes.func.isRequired
}

export default UserCurrency
