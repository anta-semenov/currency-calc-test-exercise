import React, {Component} from 'react';
import {connect} from 'react-redux';
import * as actionCreator from '../actions/actionCreator';
import ExchangeRateChart from '../charts/ExchangeRateChart';

export class App extends Component {
  render() {
    return(
      <div>
        <ExchangeRateChart {...this.props} />
      </div>
    );
  }
}

function mapState(state) {
  return {
    data: state
  };
}

export const AppConnected = connect(mapState, actionCreator)(App);
