'use client'
import React, { useState } from 'react'
import './NextPrev.css'

const NextPrev = ({ setPIndex, currentIndex, latestIndex, next, handleLoadMore }) => {
  const [loading, setLoading] = useState(false);

  async function handleNextPhoto(){
    if(currentIndex + 1 <= latestIndex){
      setPIndex(prev => prev + 1)
    }else if(next !== 'stop'){
      setLoading(true)
      const photos = await handleLoadMore();
      setLoading(false)

      if(currentIndex < photos?.length - 1){
        setPIndex(prev => prev + 1)
      }
    }
  }

  return (
    <div className='next_prev'>
      <button onClick={() => setPIndex(prev => Math.max(0, prev - 1))}
      style={{display: currentIndex <= 0 ? 'none' : 'block'}}>
        <i className='material-icons'>chevron_left</i>
      </button>

      <button onClick={handleNextPhoto} disabled={loading}
      style={{display: (currentIndex >= latestIndex && next === 'stop') ? 'none' : 'block'}}>
        <i className='material-icons'>chevron_right</i>
      </button>
    </div>
  )
}

export default NextPrev