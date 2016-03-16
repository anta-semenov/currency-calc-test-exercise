import React, {Component} from 'react';
import {findDOMNode} from 'react-dom';
import {createChart, updateChart} from '../charts/svg-test';

export default class ExchangeRateChart extends Component {
  componentDidMount() {
    var el = findDOMNode(this);
    createChart(el, this.props);
  }
  componentDidUpdate() {
    var el = findDOMNode(this);
    updateChart(el, this.props);
  }
  render() {
    return(
      <svg></svg>
    );
  }
}
