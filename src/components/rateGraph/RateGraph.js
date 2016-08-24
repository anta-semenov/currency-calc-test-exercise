import React from 'react'
import './RateGraph.less'
import RatesLines from './RatesLines'
import * as d3 from 'd3'

const height = 200
const width = 250

const getScales = props => ({
  scaleY: d3.scaleLinear().domain([props.minRate, props.maxRate]).range([height-30, 30]),
  scaleX: d3.scaleLinear().domain([props.minTerm, props.maxTerm]).range([0, width-30])
})

const drawCurrencyCircles = (svg, futureRates, scaleX, scaleY, currencyId, changeRateAction, color) => {
  const circles = d3.select(svg).selectAll(`.rate-circle-${currencyId}`).data(futureRates, d => d.term)
  circles.enter().append('circle')
    .attr('class', `rate-circle-${currencyId}`)
    .attr('r', 3)
    .attr('fill', color)
    .style('cursor', 'ns-resize')
    .call(d3.drag().on('drag', d => changeRateAction(currencyId, d.term, scaleY.invert(d3.event.y))))
  .merge(circles).attr('cx', d => scaleX(d.term))
    .attr('cy', d => scaleY(d.rate))

  circles.exit()
    .remove()
}

class RateGraph extends React.Component {
  constructor(props) {
    super(props)

    this.state = getScales(props)
  }

  componentDidMount() {
    this.drawCircles()
  }

  componentWillReceiveProps(nextProps) {
    this.setState(getScales(nextProps))
    this.setState({prevCurrencies: Object.keys(this.props.futureRates)})
  }

  componentDidUpdate() {
    this.drawCircles()
  }

  drawCircles() {
    const {scaleX, scaleY} = this.state
    const {futureRates, colors, changeRate} = this.props
    Object.keys(futureRates).forEach(currencyId => {
      drawCurrencyCircles(
        this._svg,
        futureRates[currencyId].slice(1),
        scaleX,
        scaleY,
        currencyId,
        changeRate,
        colors[currencyId]
      )
    })

    //also delete circles for currencies that were left
    if (this.state.prevCurrencies) {
      this.state.prevCurrencies.forEach(currencyId => {
        if (!(currencyId in futureRates)) {
          //this means that this currency Id no longer use, so we need to delete it circles
          d3.select(this._svg).selectAll(`.rate-circle-${currencyId}`).remove()
        }
      })
    }
  }

  render() {
    return(
      <div>
        <svg viewBox={`0 0 ${width} ${height}`} width={width} height={height} ref={ref => {this._svg = ref}} >
          <RatesLines rates={this.props.pastRates} colors={this.props.colors} scaleX={this.state.scaleX} scaleY={this.state.scaleY}/>
          <RatesLines rates={this.props.futureRates} colors={this.props.colors} scaleX={this.state.scaleX} scaleY={this.state.scaleY}/>
        </svg>
      </div>
    )
  }
}

RateGraph.propTypes = {
  pastRates: React.PropTypes.array.isRequired,
  futureRates: React.PropTypes.array.isRequired,
  colors: React.PropTypes.array.isRequired,
  minRate: React.PropTypes.number.isRequired,
  maxRate: React.PropTypes.number.isRequired,
  minTerm: React.PropTypes.number.isRequired,
  maxTerm: React.PropTypes.number.isRequired,

  changeRate: React.PropTypes.func.isRequired
}

export default RateGraph
