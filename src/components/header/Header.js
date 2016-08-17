import React from 'react'
import './Header.less'
import UserCurrency from './userCurrency/UserCurrency'

const Header = ({useInvest, changeUseInvest, ...rest}) => (
  <div className='header'>
    <div className='header-left-container'>
      <div className='banner'>Savings Forecast</div>
      <input type='checkbox' checked={useInvest} onChange={changeUseInvest}/>
      <div className='use-invest-label'>Count on Deposits</div>
    </div>
    <UserCurrency {...rest}/>
  </div>
)

Header.propTypes = {
  useInvest: React.PropTypes.bool.isRequired,
  userCurrency: React.PropTypes.object.isRequired,
  availableCurrencies: React.PropTypes.array.isRequired,

  changeUseInvest: React.PropTypes.func.isRequired,
  changeUserCurrency: React.PropTypes.func.isRequired
}

export default Header
