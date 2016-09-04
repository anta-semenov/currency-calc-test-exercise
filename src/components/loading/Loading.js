import React from 'react'
import './Loading.less'

const Loading = ({isLoading}) => (
  isLoading ?
  <div className='loading' >
    <div className='loader__title'>Loading</div>
    <div className='loader__indicator'/>
    <div className='loader__indicator'/>
    <div className='loader__indicator'/>
  </div> :
  null
)

Loading.propTypes = {
  isLoading: React.PropTypes.bool.isRequired
}

export default Loading
