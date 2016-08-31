import React from 'react'

export default class EndComponent extends React.Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.isHovering !== this.props.isHovering) {
      const bodyRect = this._ref.getBoundingClientRect()
      const position = nextProps.direction === 'vertical' ? bodyRect.top : bodyRect.left
      this.setState({
        prevMainPosition: position
      })
    }
  }

  componentDidUpdate() {
    if (this.state.prevMainPosition) {
      const bodyRect = this._ref.getBoundingClientRect()
      const position = this.props.direction === 'vertical' ? bodyRect.top : bodyRect.left
      
      const transform = this.props.direction === 'vertical' ?
        `translateY(${this.state.prevMainPosition - position}px)` :
        `translateX(${this.state.prevMainPosition - position}px)`

      this._ref.style.transform = transform
      this._ref.style.transition = 'transform 0s'

      this.setState({prevMainPosition: undefined})

      requestAnimationFrame(() => {
        this._ref.style.transform = ''
        this._ref.style.transition = 'transform 0.5s'
      })
    }
  }

  render() {
    const {styles, direction} = this.props
    const borderStyles = direction === 'vertical' ?
      {
        borderTopStyle: 'none',
        borderTopLeftRadius: '0',
        borderTopRightRadius: '0',
        height: '3px'
      } :
      {
        borderLeftStyle: 'none',
        borderTopLeftRadius: '0',
        borderBottomLeftRadius: '0',
        width: '3px'
      }

    return(
      <div className='am-menu-default-border' style={{...styles, ...borderStyles}} ref={ref => {this._ref = ref}} />
    )
  }
}

EndComponent.propTypes = {
  isHovering: React.PropTypes.bool,
  direction: React.PropTypes.oneOf(['horizontal','vertical']),
  styles: React.PropTypes.object
}
