import React from 'react'
import './ResultGraph.less'
import * as d3 from 'd3'

const ResultGraphLegend = ({height, width, yStart, xStart, maxResult, ySignsCount, userCurrencyLabel, todayTotal, yearTotal}) => {
  const numberOfThousandGroups = Math.floor((maxResult.toFixed().length - 1)/3)
  const commonBasis = 1000**numberOfThousandGroups

  const yLegend = Array.from(new Array(ySignsCount), (item, index) =>
    <text
      x={xStart - 2}
      y={yStart + height/(ySignsCount-1)*index}
      textAnchor='end'
      key={`rvl${index}`}
    >{((maxResult - maxResult/(ySignsCount-1)*index)/commonBasis)}</text>
  )

  const maxResultText = (numberOfThousandGroups) => {
    switch (numberOfThousandGroups) {
      case 1:
        return(
          <text x={xStart} y={yStart} >{`${'th.'.toLocaleString()} ${userCurrencyLabel}`}</text>
        )
      case 2:
        return(
          <text x={xStart} y={yStart} >{`${'bln.'.toLocaleString()} ${userCurrencyLabel}`}</text>
        )
      case 3:
        return(
          <text x={xStart} y={yStart} >{`${'blr.'.toLocaleString()} ${userCurrencyLabel}`}</text>
        )
      default:
        return null
    }
  }

  const totalFormate = d3.formatLocale({
    decimal: '.',
    thousands: ' ',
    grouping: [3],
    currency: [userCurrencyLabel]
  }).format(',.0f')

  const yearTitleOffset = 55

  return(
    <g>
      {yLegend}
      {maxResultText(numberOfThousandGroups)}
      <text x={xStart} y={yStart + height + 14} >{'today'.toLocaleString()}</text>
      <text x={xStart + width} y={yStart + height + 14} textAnchor='end' textLength={yearTitleOffset} >{'in a year'.toLocaleString()}</text>
      <text x={xStart} y={yStart + height + 30} className='result-total-label'>{`${totalFormate(todayTotal)} ${userCurrencyLabel}`}</text>
      <text x={xStart + width - yearTitleOffset} y={yStart + height + 30} className='result-total-label'>{`${totalFormate(yearTotal)} ${userCurrencyLabel}`}</text>
    </g>
  )
}

ResultGraphLegend.propTypes = {

}

export default ResultGraphLegend
