import React from 'react'

export default class ItemsComponent extends React.Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.isHovering !== this.props.isHovering) {
      const rect = this._ref.getBoundingClientRect()
      const mainSize = nextProps.direction === 'vertical' ? rect.height : rect.width

      const endRect = this._endComponentNode.getBoundingClientRect()
      const position = nextProps.direction === 'vertical' ? endRect.top : endRect.left

      this.setState({prevMainSize: mainSize, prevEndPosition: position})
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

      const endRect = this._endComponentNode.getBoundingClientRect()
      const position = this.props.direction === 'vertical' ? endRect.top : endRect.left
      const endTransform = this.props.direction === 'vertical' ?
        `translateY(${this.state.prevEndPosition - position}px)` :
        `translateX(${this.state.prevEndPosition - position}px)`

      this._endComponentNode.style.transform = endTransform
      this._endComponentNode.style.transition = 'transform 0s'

      if (this.props.isHovering) {
        this._menuItemsNode.style.opacity = '0'
      }

      this.setState({
        prevMainSize: undefined,
        prevEndPosition: undefined
      })

      requestAnimationFrame(() => {
        this._ref.style.transform = ''
        this._ref.style.transition = 'transform 0.5s'

        this._endComponentNode.style.transform = ''
        this._endComponentNode.style.transition = 'transform 0.5s'

        if (this.props.isHovering) {
          this._menuItemsNode.style.opacity = '1'
          this._menuItemsNode.style.transition = 'opacity 0.5s ease-out 0.35s'
        }
      })
    }
  }

  render() {
    const {direction, styles, isHovering, menuItems, className} = this.props
    const middleStyles = direction === 'vertical' ?
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

    const startStyles = direction === 'vertical' ?
      {
        borderBottomStyle: 'none',
        borderBottomLeftRadius: '0',
        borderBottomRightRadius: '0',
        height: '3px',
        minHeight: '0'
      } :
      {
        borderRightStyle: 'none',
        borderTopRightRadius: '0',
        borderBottomRightRadius: '0',
        width: '3px',
        minWidth: '0'
      }

    const endStyles = direction === 'vertical' ?
      {
        borderTopStyle: 'none',
        borderTopLeftRadius: '0',
        borderTopRightRadius: '0',
        height: '3px',
        minHeight: '0'
      } :
      {
        borderLeftStyle: 'none',
        borderTopLeftRadius: '0',
        borderBottomLeftRadius: '0',
        width: '3px',
        minWidth: '0'
      }

    return(
      <div
        className='am-menu-body'
        style={{flexDirection: this.props.direction === 'vertical' ? 'column' : 'row'}}
      >
        <div className={className || 'am-menu-default-border'} style={{...styles, ...startStyles}} />
        <div className={`${className || 'am-menu-default-border'} am-menu-middle-component`}
          style={{...styles, ...middleStyles}}
          ref={ref => {this._ref = ref}}
        >
          <div style={
            direction === 'vertical' ?
            {
              height: (styles.minHeight || 6) - 6,
              width: styles.minWidth
            } :
            {
              height: styles.minHeight,
              width: (styles.minWidth || 6) - 6
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
        <div
          className={className || 'am-menu-default-border'}
          style={{...styles, ...endStyles}}
          ref={ref => {this._endComponentNode = ref}}
        />
      </div>
    )
  }
}

ItemsComponent.propTypes = {
  menuItems: React.PropTypes.arrayOf(React.PropTypes.element).isRequired,
  direction: React.PropTypes.oneOf(['horizontal','vertical']),
  isHovered: React.PropTypes.bool,
  styles: React.PropTypes.object,
  className: React.PropTypes.string
}
