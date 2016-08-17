import React from 'react'
import Table from '../table/tableConnect'
import Header from '../header/headerConnect'
import './App.less' 

const App = () => (
  <div className='app'>
    <Header />
    <div className='app-content'>
      <Table />
    </div>
  </div>
)

export default App
