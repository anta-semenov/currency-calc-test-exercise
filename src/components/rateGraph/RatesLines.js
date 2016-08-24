import React from 'react'
import './RateGraph.less'
import * as d3 from 'd3'

const RatesLines = ({rates, colors, scaleX, scaleY}) => {
  const pathRateLines = Object.keys(rates).map(item => {
    const path = d3.path()
    rates[item].forEach((termRateItem, index) => {
      if (index === 0) {
        path.moveTo(scaleX(termRateItem.term), scaleY(termRateItem.rate))
      } else {
        path.lineTo(scaleX(termRateItem.term), scaleY(termRateItem.rate))
      }
    })

    return(
      <path d={path.toString()} stroke={colors[item]} fill='transparent' />
    )
  })

  return (
    <g>
      {pathRateLines}
    </g>
  )
}

RatesLines.propTypes = {
  rates: React.PropTypes.object.isRequired,
  colors: React.PropTypes.object.isRequired,
  scaleX: React.PropTypes.object.isRequired,
  scaleY: React.PropTypes.object.isRequired
}

export default RatesLines
