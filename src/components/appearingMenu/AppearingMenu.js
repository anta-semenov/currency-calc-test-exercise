import React from 'react'
import './AppearingMenu.less'
import ItemsComponent from './ItemsComponent'

export default class AppearingMenu extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      isHovering: false,
      labelWidth: 0,
      labelHeight: 0
    }
  }

  componentDidMount() {
    const labelRect = this._labelNode.getBoundingClientRect()
    this.setState({
      labelWidth: labelRect.width,
      labelHeight: labelRect.height
    })
  }

  onMouseOver() {
    requestAnimationFrame(() => {
      this.setState({
        isHovering: true
      })
    })
  }

  onMouseOut() {
    requestAnimationFrame(() => {
      this.setState({
        isHovering: false
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
    const {menuItems, direction, className, labelComponent} = this.props
    const {labelHeight, labelWidth, isHovering} = this.state


    return(
      <div className='am-base-element'
        onClick={() => this.onClick()}
        onMouseEnter={() => this.onMouseOver()}
        onMouseLeave={() => this.onMouseOut()}
      >
        <div
          className='am-menu-label'
          ref={ref => {this._labelNode = ref}}
        >
          {labelComponent}
        </div>
        <ItemsComponent
          menuItems={menuItems}
          direction={direction}
          styles={{
            minHeight: labelHeight,
            minWidth: labelWidth
          }}
          isHovering={isHovering}
          className={className}
        />
      </div>
    )
  }
}

AppearingMenu.propTypes = {
  labelComponent: React.PropTypes.element.isRequired,
  menuItems: React.PropTypes.arrayOf(React.PropTypes.element).isRequired,
  className: React.PropTypes.string,
  direction: React.PropTypes.oneOf(['horizontal','vertical'])
}
