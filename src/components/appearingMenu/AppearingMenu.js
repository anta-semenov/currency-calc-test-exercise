import React from 'react'
import './AppearingMenu.less'
import StartComponent from './StartComponent'
import EndComponent from './EndComponent'
import MiddleComponent from './MiddleComponent'

export default class AppearingMenu extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      isHovering: false,
      labelWidth: 0,
      labeHeight: 0
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
    this.setState({
      isHovering: true
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
    return(
      <div className='am-base-element'>
        <div
          className='am-menu-label'
          onClick={() => this.onClick()}
          ref={ref => {this._labelNode = ref}}
        >
          {this.props.labelComponent}
        </div>
        <div
          className='am-menu-body'
          style={{flexDirection: this.props.direction === 'vertical' ? 'column' : 'row'}}
          onClick={() => this.onClick()}
        >
          <StartComponent
            direction={this.props.direction}
            styles={{
              ...this.props.styles,
              height: this.state.labelHeight,
              width: this.state.labelWidth
            }}
          />
          <MiddleComponent
            menuItems={this.props.menuItems}
            direction={this.props.direction}
            styles={{
              ...this.props.styles,
              minHeight: this.state.labelHeight,
              minWidth: this.state.labelWidth
            }}
            isHovering={this.state.isHovering}
          />
          <EndComponent
            direction={this.props.direction}
            styles={{
              ...this.props.styles,
              height: this.state.labelHeight,
              width: this.state.labelWidth
            }}
            isHovering={this.state.isHovering}
          />
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
