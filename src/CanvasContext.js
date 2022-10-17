import React, { useContext, useRef, useState } from "react";

const CanvasContext = React.createContext();

export const CanvasProvider = ({ children }) => {
  const [isDrawing, setIsDrawing] = useState(false)
  const [linesArray, setLinesArray] = useState([])
  const [x, setX] = useState(0)
  const [y, setY] = useState(0)
  const [dataURL, setDataURL] = useState([])

  const canvasRef = useRef(null);
  const contextRef = useRef(null);

  const prevCanvas = () => {
    dataURL.pop();
    const canvas = canvasRef.current
    contextRef.current.clearRect(0, 0, canvas.width, canvas.height);
    let image = new Image();
    image.src = dataURL[dataURL.length-1];
    setLinesArray(prevState=>[...prevState.slice(0, prevState.length-1)])
    image.onload = () => {contextRef.current.drawImage(image,0,0)}
  };

  const prepareCanvas = () => {
    const canvas = canvasRef.current
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
    const context = canvas.getContext("2d")
    contextRef.current = context
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current
    const context = canvas.getContext("2d")
    context.fillStyle = "white"
    context.fillRect(0, 0, canvas.width, canvas.height)
    setLinesArray([])
    setDataURL([])
  }

  const resetDrawing = () =>{
    setIsDrawing(false)
    contextRef.current.closePath()
    const canvas = canvasRef.current
    contextRef.current.clearRect(0, 0, canvas.width, canvas.height);
    let image = new Image();
    image.src = dataURL[dataURL.length-1];
    image.onload = () => {contextRef.current.drawImage(image,0,0)}
  }
  

  const startDrawing = ({ nativeEvent }) => {
    if(isDrawing){
        const canvas = canvasRef.current
        const { offsetX, offsetY } = nativeEvent;
        contextRef.current.lineTo(offsetX, offsetY);
        let newLine = [x, y, offsetX, offsetY]
        if (linesArray.length){checkCross (newLine)}     
        setLinesArray(prevState=>[...prevState, newLine])   
        contextRef.current.closePath();
        contextRef.current.stroke();
        setIsDrawing(false);
        setDataURL(prevState=>[...prevState, canvas.toDataURL()]);
    } else {
        setIsDrawing(true);
        const { offsetX, offsetY } = nativeEvent;
        setX(offsetX)
        setY(offsetY)
        contextRef.current.beginPath();
        contextRef.current.moveTo(offsetX, offsetY);
    }
  };

  const draw = ({ nativeEvent }) => {
    if (isDrawing) {
      let image = new Image();
      image.src = dataURL[dataURL.length-1];
      image.onload = () => {contextRef.current.drawImage(image,0,0)}

      const canvas = canvasRef.current
      contextRef.current.clearRect(0, 0, canvas.width, canvas.height);

      const { offsetX, offsetY } = nativeEvent;
      contextRef.current.beginPath();
      contextRef.current.moveTo(x, y)
      contextRef.current.lineTo(offsetX, offsetY)
      contextRef.current.stroke();
      checkCross ([x,y,offsetX,offsetY])
    }
  };


  const checkCross = ([x1, y1, x2, y2]) => {
    let n;
    linesArray.forEach(([x3, y3, x4, y4])=>{
      if (y2 - y1 != 0) {
          let q = (x2 - x1) / (y1 - y2);   
          let sn = (x3 - x4) + (y3 - y4) * q; 
          if (!sn) { return 0; } 
          let fn = (x3 - x1) + (y3 - y1) * q;  
          n = fn / sn;
      }
      else {
          if (!(y3 - y4)) { return 0; } 
          n = (y3 - y1) / (y3 - y4);
      }
      let dot = [];
      dot[0] = x3 + (x4 - x3) * n;
      dot[1] = y3 + (y4 - y3) * n;

      function compareNumbers(a, b) {
        if (a > b) return 1;
        if (a == b) return 0;
        if (a < b) return -1;
      }

      isDotOnTheLines (dot, [x1, x2].sort(compareNumbers),
                            [y1, y2].sort(compareNumbers), 
                            [x3, x4].sort(compareNumbers),
                            [y3, y4].sort(compareNumbers),
                      )

      return 1;
  })}

  const isDotOnTheLines = ([dotX, dotY], [x1,x2], [y1,y2], [x3,x4], [y3,y4]) => {
    if(dotX >= x1 && dotX <= x2 && dotY >= y1 && dotY <= y2 && dotX >= x3 && dotX <= x4 && dotY >= y3 && dotY <= y4){
      contextRef.current.fillStyle = "red"
      contextRef.current.fillRect(dotX-5, dotY-5, 10, 10)
    }
  }

  return (
    <CanvasContext.Provider
      value={{
        canvasRef,
        contextRef,
        prepareCanvas,
        startDrawing,
        resetDrawing,
        clearCanvas,
        prevCanvas,
        draw,
      }}
    >
      {children}
    </CanvasContext.Provider>
  );
};

export const useCanvas = () => useContext(CanvasContext);