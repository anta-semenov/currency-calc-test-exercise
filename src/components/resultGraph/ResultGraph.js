import React from 'react'
import './ResultGraph.less'
import * as d3 from 'd3'

const height=200
const width=250

const ResultGraph = ({results, maxValue, colors, currenciesIds}) => {
  const scaleY = d3.scaleLinear().domain([0, maxValue*1.5]).range([0, height-30])
  const scaleX = d3.scaleLinear().domain([0, 4]).range([0, width-30])
  const series = d3.stack().keys(currenciesIds)(results)
  const rects = []
  series.forEach((seria, index) => {
    seria.forEach((item, itemIndex) => {
      rects.push(
        <rect key={index*10+itemIndex} fill={colors[index]} x={`${scaleX(itemIndex)+10}`} y={`${height-scaleY(item[1])-20}`} width={`${scaleX(1)-1}`} height={`${scaleY(item[1]-item[0])}`} />
      )
    })
  })

  return(
    <div className='result'>
      <svg className='result-svg' viewBox={`0 0 ${width} ${height}`} width={width} height={height}>
        {rects}
      </svg>
    </div>
  )
}

ResultGraph.propTypes = {
  results: React.PropTypes.array.isRequired,
  colors: React.PropTypes.array.isRequired,
  maxValue: React.PropTypes.number.isRequired,
  currenciesIds: React.PropTypes.array.isRequired
}

export default ResultGraph
