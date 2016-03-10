import React, {Component} from 'react';
import {Provider} from 'react-redux';
import App from './App';
import DevTools from './DevTools';

export default class Root extends Component {
  render() {
    return(
      <Provider>
        <App />
        <DevTools />
      </Provider>
    );
  }
}
