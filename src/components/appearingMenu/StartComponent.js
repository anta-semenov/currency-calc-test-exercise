import React from 'react'

const StartComponent = ({direction, styles}) => {
  const borderStyles = direction === 'vertical' ?
    {
      borderBottomStyle: 'none',
      borderBottomLeftRadius: '0',
      borderBottomRightRadius: '0',
      height: '3px'
    } :
    {
      borderRightStyle: 'none',
      borderTopRightRadius: '0',
      borderBottomRightRadius: '0',
      width: '3px'
    }

  return(
    <div className='am-menu-default-border' style={{...styles, ...borderStyles}} />
  )
}

StartComponent.propTypes = {
  direction: React.PropTypes.oneOf(['horizontal','vertical']),
  styles: React.PropTypes.object
}

export default StartComponent
