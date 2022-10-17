import React from 'react'
import './App.css'
import { Canvas } from './Canvas'
import { ClearCanvasButton } from './ClearCanvasButton';
import { PrevCanvasButton } from './PrevCanvasButton';

function App() {
  return (
    <>
      <ClearCanvasButton/>
      <PrevCanvasButton/>
      <Canvas/>
    </>
  );
}

export default App;