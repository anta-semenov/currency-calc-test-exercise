import React from 'react'
import './ResultGraph.less'
import * as d3 from 'd3'
import ResultGraphRect from './ResultGraphRect'
import ceil from 'lodash/ceil'

const height = 200
const width = 250

const ResultGraph = ({results, maxValue, colors, currenciesIds}) => {
  const maxResult = ceil(maxValue/4, -((maxValue/4).toFixed(0).length-1))*4
  const scaleY = d3.scaleLinear().domain([0, maxResult]).range([0, height-30])
  const scaleX = d3.scaleLinear().domain([0, 4]).range([0, width-40])
  const series = d3.stack().keys(currenciesIds)(results)
  const rects = []
  series.forEach((seria, index) => {
    seria.forEach((item, itemIndex) => {
      rects.push(
        <ResultGraphRect key={index*10+itemIndex} color={colors[currenciesIds[index]]} x={`${ceil(scaleX(itemIndex), 1)+40}`} y={height-ceil(scaleY(item[1]), 1)-20} width={`${ceil(scaleX(1), 1)-1}`} height={ceil(scaleY(item[1]-item[0]), 1)} />
      )
    })
  })
  const axisY = d3.axisLeft(d3.scaleLinear().domain([maxResult, 0]).range([0, height-30])).ticks(4, 's')

  const drawAxis = context => {
    d3.select(context)
      .attr('transform', 'translate(38,10)')
      .call(axisY)
  }

  return(
    <div className='result'>
      <svg className='result-svg' viewBox={`0 0 ${width} ${height}`} width={width} height={height} >
        <g x='0' y='0' width='20' height={`${height}`} ref={ref => {drawAxis(ref)}}/>
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
