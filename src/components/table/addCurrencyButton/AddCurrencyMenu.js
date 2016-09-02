import React from 'react'
import './AddCurrencyButton.less'
import AppearingMenu from '../../appearingMenu/AppearingMenu'
import AddCurrencyButton from './AddCurrencyButton'

const AddCurrencyMenu = ({currenciesForAdding, addCurrency}) => {
  const items = currenciesForAdding.map(item => (
    <AddCurrencyButton {...item} addCurrency={addCurrency} key={item.currencyId}/>
  ))
  const labelComponent = <div className='add-currency-label' >+ Currency</div>
  return(
    <div className='add-currency-menu'>
      <AppearingMenu labelComponent={labelComponent} menuItems={items} className='add-currency-border-style'/>
    </div>
  )
}

AddCurrencyMenu.propTypes = {
  currenciesForAdding: React.PropTypes.array.isRequired,
  addCurrency: React.PropTypes.func.isRequired
}

export default AddCurrencyMenu
