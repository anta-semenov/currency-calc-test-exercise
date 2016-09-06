import React from 'react'
import './ResultGraph.less'
import * as d3 from 'd3'
import ResultGraphRect from './ResultGraphRect'
import ResultGraphLegend from './ResultGraphLegend'
import ceil from 'lodash/ceil'

const height = 205
const yStartOffset = 10
const yEndOffset = 35
const width = 270
const xStartOffset = 30
const xEndOffset = 50

const ResultGraph = ({results, maxValue, colors, currenciesIds, ...rest}) => {
  const maxResult = ceil(maxValue/4, -((maxValue/4).toFixed(0).length-1))*4
  const scaleY = d3.scaleLinear().domain([0, maxResult]).range([height - yEndOffset, yStartOffset])
  const scaleX = d3.scaleLinear().domain([0, 4]).range([xStartOffset, width - xEndOffset])
  const series = d3.stack().keys(currenciesIds)(results)
  const rects = []
  series.forEach((seria, index) => {
    seria.forEach((item, itemIndex) => {
      rects.push(
        <ResultGraphRect
          key={index*10+itemIndex}
          color={colors[currenciesIds[index]]}
          x={`${ceil(scaleX(itemIndex), 1)}`}
          y={ceil(scaleY(item[1]), 1)}
          width={`${ceil(scaleX(1) - xStartOffset, 1)-1}`}
          height={ceil(scaleY(item[0]) - scaleY(item[1]), 1)}
        />
      )
    })
  })

  return(
    <div className='result-container'>
      <svg className='result-svg' viewBox={`0 0 ${width} ${height}`} width={width} height={height} >
        <ResultGraphLegend
          height={height - yStartOffset - yEndOffset}
          width={width - xStartOffset - xEndOffset}
          yStart={yStartOffset}
          xStart={xStartOffset}
          maxResult={maxResult}
          ySignsCount={5}
          {...rest}
        />
        {rects}
      </svg>
    </div>
  )
}

ResultGraph.propTypes = {
  results: React.PropTypes.array.isRequired,
  colors: React.PropTypes.object.isRequired,
  maxValue: React.PropTypes.number.isRequired,
  currenciesIds: React.PropTypes.array.isRequired
}

export default ResultGraph
