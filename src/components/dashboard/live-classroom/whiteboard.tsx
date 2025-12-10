'use client';

import { useRef, useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Eraser, PenTool, X } from 'lucide-react';

export default function Whiteboard({ onClose }: { onClose: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [color, setColor] = useState('#000000');

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.width = canvas.parentElement?.clientWidth || 800;
      canvas.height = canvas.parentElement?.clientHeight || 600;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.lineCap = 'round';
        ctx.lineWidth = 3;
        ctx.fillStyle = "white";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }
    }
  }, []);

  const startDrawing = (e: React.MouseEvent) => {
    const ctx = canvasRef.current?.getContext('2d');
    if (ctx) {
      ctx.beginPath();
      ctx.moveTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
      setIsDrawing(true);
    }
  };

  const draw = (e: React.MouseEvent) => {
    if (!isDrawing) return;
    const ctx = canvasRef.current?.getContext('2d');
    if (ctx) {
      ctx.strokeStyle = color;
      ctx.lineTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
      ctx.stroke();
    }
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearBoard = () => {
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext('2d');
      if (canvas && ctx) {
          ctx.fillStyle = "white";
          ctx.fillRect(0, 0, canvas.width, canvas.height);
      }
  };

  return (
    <div className="absolute inset-0 bg-white z-50 flex flex-col">
      {/* Toolbar */}
      <div className="flex items-center justify-between p-2 bg-slate-100 border-b">
          <div className="flex gap-2">
              <Button size="sm" variant={color === '#000000' ? "default" : "outline"} onClick={() => setColor('#000000')}><PenTool className="h-4 w-4 mr-1"/> Black</Button>
              <Button size="sm" variant={color === '#ef4444' ? "default" : "outline"} onClick={() => setColor('#ef4444')} className="text-red-500 border-red-200">Red</Button>
              <Button size="sm" variant={color === '#3b82f6' ? "default" : "outline"} onClick={() => setColor('#3b82f6')} className="text-blue-500 border-blue-200">Blue</Button>
              <Button size="sm" variant="secondary" onClick={clearBoard}><Eraser className="h-4 w-4 mr-1"/> Clear</Button>
          </div>
          <Button size="sm" variant="ghost" onClick={onClose}><X className="h-4 w-4"/> Close Board</Button>
      </div>
      
      {/* Canvas Area */}
      <div className="flex-1 relative cursor-crosshair">
        <canvas
            ref={canvasRef}
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={stopDrawing}
            onMouseLeave={stopDrawing}
            className="absolute inset-0 w-full h-full"
        />
      </div>
    </div>
  );
}
