import React from 'react'
import ReactDOM from 'react-dom'
import Root from './components/root/Root'
import configureStore from './store/configureStore'
import initializeState from './store/initializeState'

const store = configureStore()
initializeState(store)


ReactDOM.render(<Root store={store} />, document.getElementById('root'))
