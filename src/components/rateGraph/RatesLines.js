import React from 'react'
import './RateGraph.less'
import * as d3 from 'd3'

const RatesLines = ({rates, colors, scaleX, scaleY}) => {
  const pathRateLines = Object.keys(rates).map(item => {
    const path = d3.path()
    let key = item
    rates[item].forEach((termRateItem, index) => {
      if (index === 0) {
        path.moveTo(scaleX(termRateItem.term), scaleY(termRateItem.rate))
        key += termRateItem.term
      } else {
        path.lineTo(scaleX(termRateItem.term), scaleY(termRateItem.rate))
      }
    })

    return(
      <path d={path.toString()} stroke={colors[item]} fill='transparent' key={key} />
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
  scaleX: React.PropTypes.func.isRequired,
  scaleY: React.PropTypes.func.isRequired
}

export default RatesLines
