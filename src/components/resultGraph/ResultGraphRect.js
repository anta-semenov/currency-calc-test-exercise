import React from 'react'
import {Motion, spring} from 'react-motion'

const springConfig = {
  stiffness: 260,
  damping: 35,
  precision: 0.1
}

const ResultGraphRect = ({height, width, x, y, color}) => (
  <Motion style={{rectHeight: spring(height, springConfig), rectY: spring(y, springConfig)}}>
    {({rectHeight, rectY}) =>
      <rect
        fill={color}
        x={x}
        y={rectY}
        width={width}
        height={rectHeight}
      />
    }
  </Motion>
)

export default ResultGraphRect

ResultGraphRect.propTypes = {
  height: React.PropTypes.number.isRequired,
  width: React.PropTypes.string.isRequired,
  x: React.PropTypes.string.isRequired,
  y: React.PropTypes.number.isRequired,
  color: React.PropTypes.string.isRequired
}
