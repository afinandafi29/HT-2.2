import React, { useState, useRef, useEffect } from 'react';

const WhiteboardScreen = () => {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [context, setContext] = useState(null);
  const [color, setColor] = useState('#60a5fa');
  const [brushSize, setBrushSize] = useState(4);
  const [tool, setTool] = useState('pen'); // pen, eraser

  // Initialize canvas context
  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      const ctx = canvas.getContext('2d');
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.strokeStyle = color;
      ctx.lineWidth = brushSize;
      setContext(ctx);

      // Fill with dark background
      ctx.fillStyle = '#111827'; // Darker gray bg
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
  }, []);

  // Update brush properties when they change
  useEffect(() => {
    if (context) {
      context.strokeStyle = tool === 'eraser' ? '#111827' : color;
      context.lineWidth = tool === 'eraser' ? brushSize * 3 : brushSize;
    }
  }, [color, brushSize, tool, context]);

  const startDrawing = (e) => {
    if (!context) return;
    const { offsetX, offsetY } = getCoordinates(e);
    context.beginPath();
    context.moveTo(offsetX, offsetY);
    setIsDrawing(true);
  };

  const draw = (e) => {
    if (!isDrawing || !context) return;
    const { offsetX, offsetY } = getCoordinates(e);
    context.lineTo(offsetX, offsetY);
    context.stroke();
  };

  const stopDrawing = () => {
    if (!context) return;
    context.closePath();
    setIsDrawing(false);
  };

  const getCoordinates = (e) => {
    let offsetX, offsetY;
    if (e.type.includes('touch')) {
      const rect = canvasRef.current.getBoundingClientRect();
      offsetX = e.touches[0].clientX - rect.left;
      offsetY = e.touches[0].clientY - rect.top;
    } else {
      offsetX = e.nativeEvent.offsetX;
      offsetY = e.nativeEvent.offsetY;
    }
    return { offsetX, offsetY };
  };

  const clearCanvas = () => {
    if (!context) return;
    const canvas = canvasRef.current;
    context.fillStyle = '#111827';
    context.fillRect(0, 0, canvas.width, canvas.height);
    // Reset brush
    context.strokeStyle = tool === 'eraser' ? '#111827' : color;
  };

  const colors = [
    '#ffffff', // White
    '#ef4444', // Red
    '#f59e0b', // Orange
    '#10b981', // Green
    '#3b82f6', // Blue
    '#8b5cf6', // Purple
    '#ec4899', // Pink
  ];

  return (
    <div className="h-full bg-gray-900 text-white flex flex-col relative overflow-hidden font-sans">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 p-4 z-10 flex justify-between items-center pointer-events-none">
        <h2 className="text-xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400 drop-shadow-sm">
          Canvas
        </h2>
        <div className="flex gap-2 pointer-events-auto">
          <button
            onClick={clearCanvas}
            className="bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-full text-xs font-semibold hover:bg-white/20 transition-all border border-white/10"
          >
            Clear
          </button>
        </div>
      </div>

      {/* Canvas Area */}
      <div className="flex-1 w-full h-full">
        <canvas
          ref={canvasRef}
          className="w-full h-full touch-none cursor-crosshair"
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
        />
      </div>

      {/* Floating Toolbar */}
      <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 w-[90%] max-w-sm bg-gray-800/90 backdrop-blur-xl border border-white/10 rounded-2xl p-4 shadow-2xl z-20 transition-all">
        {/* Tools & Colors */}
        <div className="flex flex-col gap-4">
          {/* Top Row: Colors */}
          <div className="flex justify-between items-center px-1">
            {colors.map(c => (
              <button
                key={c}
                className={`w-6 h-6 rounded-full transition-transform hover:scale-110 ${color === c && tool !== 'eraser' ? 'ring-2 ring-white scale-110' : 'ring-1 ring-white/10'}`}
                style={{ backgroundColor: c }}
                onClick={() => { setColor(c); setTool('pen'); }}
              />
            ))}
          </div>

          {/* Bottom Row: Controls */}
          <div className="flex items-center justify-between gap-4">
            {/* Brush Size Slider */}
            <div className="flex-1 flex items-center gap-2">
              <i className="fas fa-circle text-[8px] opacity-50"></i>
              <input
                type="range"
                min="2"
                max="20"
                value={brushSize}
                onChange={(e) => setBrushSize(parseInt(e.target.value))}
                className="w-full h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer"
              />
              <i className="fas fa-circle text-sm opacity-50"></i>
            </div>

            {/* Eraser Toggle */}
            <button
              onClick={() => setTool(tool === 'pen' ? 'eraser' : 'pen')}
              className={`p-2 rounded-lg transition-colors ${tool === 'eraser' ? 'bg-blue-500 text-white' : 'bg-gray-700 text-gray-400 hover:text-white'}`}
            >
              <i className="fas fa-eraser"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WhiteboardScreen;