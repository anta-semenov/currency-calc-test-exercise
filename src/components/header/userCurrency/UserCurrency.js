import React from 'react'
import './UserCurrency.less'
import AppearingMenu from '../../appearingMenu/AppearingMenu'
import AddCurrencyButton from '../../table/addCurrencyButton/AddCurrencyButton'

const UserCurrency = ({userCurrency, availableCurrencies, changeUserCurrency}) => {
  const items = availableCurrencies.map(item => (
    <AddCurrencyButton {...item} addCurrency={changeUserCurrency} key={item.currencyId} />
  ))
  const labelComponent = <div className='user-currency-label'>{userCurrency.label}</div>
  return(
    <div className='user-currency-menu'>
      <div className='user-currency-title'>My currency</div>
      <AppearingMenu labelComponent={labelComponent} menuItems={items} direction='vertical'/>
    </div>
  )
}

UserCurrency.propTypes = {
  userCurrency: React.PropTypes.object.isRequired,
  availableCurrencies: React.PropTypes.array.isRequired,
  changeUserCurrency: React.PropTypes.func.isRequired
}

export default UserCurrency
