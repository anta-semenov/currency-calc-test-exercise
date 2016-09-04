import React from 'react'
import './AddCurrencyButton.less'
import AppearingMenu from '../../appearingMenu/AppearingMenu'
import AddCurrencyButton from './AddCurrencyButton'

export default class AddCurrencyMenu extends React.Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

  componentWillReceiveProps() {
    if (this.state.prevTopRecorded) {
      return
    }
    this.setState({prevTop: this._ref.getBoundingClientRect().top})
  }

  componentDidUpdate() {
    if (this.state.prevTop) {
      const top = this._ref.getBoundingClientRect().top
      const diff = this.state.prevTop - top
      if (diff === 0) {
        return
      }

      const transform = `translateY(${diff}px)`
      this._ref.style.transform = transform
      this._ref.style.transition = 'transform 0s'

      this.setState({prevTop: undefined, prevTopRecorded: undefined})

      requestAnimationFrame(() => {
        this._ref.style.transform = ''
        this._ref.style.transition = `transform 300ms ${diff > 0 ? '150ms' : ''}`
      })
    }
  }

  addCurrencyWithAnimation(...args) {
    this.setState({prevTop: this._ref.getBoundingClientRect().top, prevTopRecorded: true})
    this.props.addCurrency(...args)
  }

  render() {
    const {currenciesForAdding} = this.props
    const items = currenciesForAdding.map(item => (
      <AddCurrencyButton {...item} addCurrency={(...args) => this.addCurrencyWithAnimation(...args)} key={item.currencyId}/>
    ))
    const labelComponent = <div className='add-currency-label' >+ Currency</div>
    return(
      <div className='add-currency-menu' ref={ref => {this._ref = ref}}>
        <AppearingMenu labelComponent={labelComponent} menuItems={items} className='add-currency-border-style'/>
      </div>
    )
  }
}

AddCurrencyMenu.propTypes = {
  currenciesForAdding: React.PropTypes.array.isRequired,
  addCurrency: React.PropTypes.func.isRequired
}
