import React from 'react'
import Table from '../table/tableConnect'
import Header from '../header/headerConnect'
import Results from '../resultGraph/resultGraphConnect'
import Rates from '../rateGraph/rateGraphConnect'
import Loading from '../loading/loadingConnect'
import './App.less'

const App = () => (
  <div className='app'>
    <Header />
    <div className='app-content'>
      <Table />
      <div className='app-graphs'>
        <Rates />
        <Results />
      </div>
    </div>
    <Loading />
  </div>
)

export default App
