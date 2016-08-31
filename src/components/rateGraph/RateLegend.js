import React from 'react'
import './RateGraph.less'
import * as d3 from 'd3'

const yIntervalsCount = 5
const xIntervalsCount = 4

const RateNet = ({height, width, xStart, yStart, minRate, maxRate}) => {
  const horizontalLines = Array.from(new Array(yIntervalsCount+1), (item, index) =>
    <path d={`M${xStart},${yStart + (height/yIntervalsCount)*index} l${width},0`} key={`hl${index}`} className='rate-net-line'/>
  )
  const verticalLines = Array.from(new Array(xIntervalsCount+1), (item, index) =>
    <path d={`M${xStart + (width/xIntervalsCount)*index},${yStart} l0,${height}`} key={`vl${index}`} className='rate-net-line'/>
  )
  const yLegend = Array.from(new Array(yIntervalsCount), (item, index) =>
    <text x={xStart - 2} y={yStart + (height/yIntervalsCount)*index} dy='9' textAnchor='end' key={`yl${index}`} >{d3.format('d')(maxRate-(maxRate-minRate)/yIntervalsCount*index)}</text>
  )

  return(
      <g>
        {horizontalLines}
        {verticalLines}
        {yLegend}
        <text x={xStart} y={yStart + height + 14} >year ago</text>
        <text x={xStart + width/2} y={yStart + height + 14} textAnchor='middle' >today</text>
        <text x={xStart + width} y={yStart + height + 14} textAnchor='end' >in a year</text>
        <text x={xStart} y='4' dy='9' className='rate-graph-title'>Rate's history and forecasts</text>
        <text x={xStart} y='18' dy='9' className='rate-graph-subtitle'>Move points for changing forecast</text>
      </g>
  )
}

RateNet.propTypes = {

}

export default RateNet
