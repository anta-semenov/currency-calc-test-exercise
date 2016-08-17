import React from 'react'
import './AppearingMenu.less'

export default class AppearingMenu extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      isHovering: false
    }
  }

  componentDidUpdate() {
    if (this.state.prevMainSize) {
      const currentBodyRect = this._menuBodyNode.getBoundingClientRect()
      const currentMainSize = this.props.direction === 'vertical' ? currentBodyRect.height : currentBodyRect.width
      const scaleFactor = this.state.prevMainSize/currentMainSize

      const transform = this.props.direction === 'vertical' ? `scaleY(${scaleFactor})` : `scaleX(${scaleFactor})`
      this._menuBodyNode.style.transform = transform
      this._menuBodyNode.style.transition = 'transform 0s'

      if (this.state.isHovering) {
        this._menuItemsNode.style.opacity = '0'
      }

      requestAnimationFrame(() => {
        this._menuBodyNode.style.transform = ''
        this._menuBodyNode.style.transition = 'transform 0.5s'
        if (this.state.isHovering) {
          this._menuItemsNode.style.opacity = '1'
          this._menuItemsNode.style.transition = 'opacity 0.5s ease-out 0.5s'
        }
      })
    }
  }

  onMouseOver() {
    const currentBodyRect = this._menuBodyNode.getBoundingClientRect()
    const currentMainSize = this.props.direction === 'vertical' ? currentBodyRect.height : currentBodyRect.width
    this.setState({
      isHovering: true,
      prevMainSize: currentMainSize
    })
  }

  onMouseOut() {
    requestAnimationFrame(() => {
      this._menuItemsNode.style.opacity = '0'
      this._menuBodyNode.style.transition = 'opacity 500ms'
      const currentBodyRect = this._menuBodyNode.getBoundingClientRect()
      const currentMainSize = this.props.direction === 'vertical' ? currentBodyRect.height : currentBodyRect.width
      this.setState({
        isHovering: false,
        prevMainSize: currentMainSize
      })
    })

  }

  onClick() {
    if (this.state.isHovering) {
      this.onMouseOut()
    } else {
      this.onMouseOver()
    }
  }

  render() {
    return(
      <div className='am-base-element'>
        <div
          className='am-menu-label'
          onClick={() => this.onClick()}
        >
          {this.props.labelComponent}
        </div>
        <div
          className='am-menu-body'
          ref={ref => {this._menuBodyNode = ref}}
          style={{flexDirection: this.props.direction === 'vertical' ? 'column' : 'row'}}
          onClick={() => this.onClick()}
        >
          <div style={{opacity:0, padding: '2px'}}>
            {this.props.labelComponent}
          </div>
          {this.state.isHovering ?
          <div
            className='am-menu-items'
            style={{flexDirection: this.props.direction === 'vertical' ? 'column' : 'row'}}
            ref={ref => {this._menuItemsNode = ref}}
          >{this.props.menuItems}</div> :
           null}
        </div>
      </div>
    )
  }
}

AppearingMenu.propTypes = {
  labelComponent: React.PropTypes.element.isRequired,
  menuItems: React.PropTypes.arrayOf(React.PropTypes.element).isRequired,
  styles: React.PropTypes.object,
  direction: React.PropTypes.oneOf(['horizontal','vertical']),
  baseMainDirectionSize: React.PropTypes.number,
  baseCrossDirectionSize: React.PropTypes.number
}
