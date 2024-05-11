'use client'
import React, { useEffect } from 'react'
import { toast } from 'react-toastify'

const Error = ({ errMsg }) => {

  useEffect(() => {
    if(errMsg)
      toast.error(errMsg)
  }, [errMsg])

  return (
    <h1 style={{
      textAlign: 'center',
      margin: '30px 0',
      textTransform: 'uppercase',
      color: 'red'
    }}>
      {errMsg}
    </h1>
  )
}

export default Error