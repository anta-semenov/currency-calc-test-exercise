import React from 'react'
import Table from '../table/tableConnect'
import Header from '../header/headerConnect'
import Results from '../resultGraph/resultGraphConnect'
import Rates from '../rateGraph/rateGraphConnect'
import './App.less'

const App = () => (
  <div className='app'>
    <Header />
    <div className='app-content'>
      <Table />
      <Rates />
      <Results />
    </div>
  </div>
)

export default App
