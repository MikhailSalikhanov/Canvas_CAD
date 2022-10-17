import React from 'react'
import { useCanvas } from './CanvasContext'

export const ClearCanvasButton = () => {
  const { clearCanvas } = useCanvas()

  return <button className='button' onClick={clearCanvas}>Collapse lines</button>
}