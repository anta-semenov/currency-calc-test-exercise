import React from 'react'

export default class MiddleComponent extends React.Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.isHovering !== this.props.isHovering) {
      const rect = this._ref.getBoundingClientRect()
      const mainSize = nextProps.direction === 'vertical' ? rect.height : rect.width
      this.setState({prevMainSize: mainSize})
    }
  }

  componentDidUpdate() {
    if (this.state.prevMainSize) {
      const rect = this._ref.getBoundingClientRect()
      const mainSize = this.props.direction === 'vertical' ? rect.height : rect.width
      const scaleFactor = this.state.prevMainSize/mainSize

      const transform = this.props.direction === 'vertical' ? `scaleY(${scaleFactor})` : `scaleX(${scaleFactor})`
      this._ref.style.transform = transform
      this._ref.style.transition = 'transform 0s'

      if (this.props.isHovering) {
        this._menuItemsNode.style.opacity = '0'
      }

      requestAnimationFrame(() => {
        this._ref.style.transform = ''
        this._ref.style.transition = 'transform 0.5s'

        if (this.props.isHovering) {
          this._menuItemsNode.style.opacity = '1'
          this._menuItemsNode.style.transition = 'opacity 0.5s ease-out 0.5s'
        }
      })


    }
  }

  render() {
    const {direction, styles, isHovering, menuItems} = this.props
    const directionStyles = direction === 'vertical' ?
      {
        borderRadius: '0',
        borderTopStyle: 'none',
        borderBottomStyle: 'none',
        flexDirection: 'column',
        minHeight: '0',
      } :
      {
        borderRadius: '0',
        borderLeftStyle: 'none',
        borderRightStyle: 'none',
        flexDirection: 'row',
        minWidth: '0'
      }

    return(
      <div className='am-menu-default-border am-menu-middle-component'
        style={{...styles, ...directionStyles}}
        ref={ref => {this._ref = ref}}
      >
        <div style={
          direction === 'vertical' ?
          {
            height: styles.minHeight - 6,
            width: styles.minWidth
          } :
          {
            height: styles.minHeight,
            width: styles.minWidth - 6
          }
        }/>
        {isHovering ?
        <div
          className='am-menu-items'
          style={{flexDirection: direction === 'vertical' ? 'column' : 'row'}}
          ref={ref => {this._menuItemsNode = ref}}
        >{menuItems}</div> :
         null}
      </div>
    )
  }
}

MiddleComponent.propTypes = {
  menuItems: React.PropTypes.arrayOf(React.PropTypes.element).isRequired,
  direction: React.PropTypes.oneOf(['horizontal','vertical']),
  isHovered: React.PropTypes.bool
}
