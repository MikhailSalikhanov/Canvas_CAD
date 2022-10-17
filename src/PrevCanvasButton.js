import React from 'react'
import { useCanvas } from './CanvasContext'

export const PrevCanvasButton = () => {
  const { prevCanvas } = useCanvas()

  return <button className='button' onClick={prevCanvas}>Undo</button>
}