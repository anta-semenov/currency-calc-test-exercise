import React from 'react'
import './AddCurrencyButton.less'

const AddCurrencyButton = ({label, currencyId, addCurrency, ...rest}) => (
  <div className='add-currency-button' onClick={() => addCurrency({label, currencyId, ...rest})}>
    {label}
  </div>
)

AddCurrencyButton.propTypes = {
  label: React.PropTypes.string.isRequired,
  currencyId: React.PropTypes.string.isRequired,

  addCurrency: React.PropTypes.func.isRequired
}

export default AddCurrencyButton
