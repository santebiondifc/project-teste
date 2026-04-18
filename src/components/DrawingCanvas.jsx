import { useRef, useEffect, forwardRef, useImperativeHandle } from 'react';
import { validateAgainstPattern } from '../utils/numberPatterns';

const DrawingCanvas = forwardRef(({ 
  width = 280, 
  height = 280, 
  templateText = null,
  hintText = null 
}, ref) => {
  const canvasRef = useRef(null);
  const templateRef = useRef(null);
  
  // Expose methods to parent component
  useImperativeHandle(ref, () => ({
    clearCanvas: () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.strokeStyle = '#FFD700'; 
      ctx.lineWidth = Math.max(12, canvas.width / 20);
      ctx.lineCap = 'round'; 
      ctx.lineJoin = 'round';
    },
    hasDrawing: (threshold = 200) => {
      const canvas = canvasRef.current;
      if (!canvas) return false;
      const ctx = canvas.getContext('2d');
      const data = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
      let count = 0;
      for (let i = 3; i < data.length; i += 4) {
        if (data[i] > 50) count++;
      }
      return count > threshold;
    },
    validateDrawing: (targetNumber) => {
      const canvas = canvasRef.current;
      if (!canvas) return false;
      
      const ctx = canvas.getContext('2d');
      const w = canvas.width;
      const h = canvas.height;
      const imageData = ctx.getImageData(0, 0, w, h);
      
      // If no target, just check if they drew something
      if (targetNumber === null || targetNumber === undefined) {
        let count = 0;
        for (let i = 3; i < imageData.data.length; i += 4) {
          if (imageData.data[i] > 50) count++;
        }
        return count > 150;
      }
      
      return validateAgainstPattern(imageData, w, h, targetNumber);
    }
  }));

  // Initialize main canvas context
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const size = Math.min(width, window.innerWidth * 0.85);
    canvas.width = size;
    canvas.height = size;
    canvas.style.width = size + 'px';
    canvas.style.height = size + 'px';
    
    const ctx = canvas.getContext('2d');
    ctx.strokeStyle = '#FFD700'; 
    ctx.lineWidth = Math.max(12, size / 20);
    ctx.lineCap = 'round'; 
    ctx.lineJoin = 'round';
  }, [width, height]);

  // Handle template rendering
  useEffect(() => {
    if (templateText !== null && templateRef.current) {
      const canvas = templateRef.current;
      const size = Math.min(width, window.innerWidth * 0.85);
      canvas.width = size;
      canvas.height = size;
      canvas.style.width = size + 'px';
      canvas.style.height = size + 'px';
      
      const ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, size, size);
      ctx.fillStyle = 'rgba(255,255,255,0.18)';
      ctx.font = `bold ${size * 0.68}px 'Nunito', 'Comic Sans MS', cursive`;
      ctx.textAlign = 'center'; 
      ctx.textBaseline = 'middle';
      ctx.fillText(String(templateText), size / 2, size / 2);
    }
  }, [templateText, width]);

  // Drawing event logic
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    let drawing = false;
    let lastX, lastY;

    const getPos = (e) => {
      const rect = canvas.getBoundingClientRect();
      const scaleX = canvas.width / rect.width;
      const scaleY = canvas.height / rect.height;
      const src = e.touches ? e.touches[0] : e;
      return [
        (src.clientX - rect.left) * scaleX, 
        (src.clientY - rect.top) * scaleY
      ];
    };

    const start = (e) => {
      e.preventDefault();
      drawing = true;
      const pos = getPos(e);
      lastX = pos[0];
      lastY = pos[1];
      ctx.beginPath();
      ctx.moveTo(lastX, lastY);
    };

    const move = (e) => {
      if (!drawing) return;
      e.preventDefault();
      const [x, y] = getPos(e);
      ctx.lineTo(x, y);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(x, y);
      lastX = x;
      lastY = y;
    };

    const end = () => { drawing = false; };

    canvas.addEventListener('mousedown', start);
    canvas.addEventListener('mousemove', move);
    window.addEventListener('mouseup', end);
    canvas.addEventListener('touchstart', start, { passive: false });
    canvas.addEventListener('touchmove', move, { passive: false });
    window.addEventListener('touchend', end);

    return () => {
      canvas.removeEventListener('mousedown', start);
      canvas.removeEventListener('mousemove', move);
      window.removeEventListener('mouseup', end);
      canvas.removeEventListener('touchstart', start);
      canvas.removeEventListener('touchmove', move);
      window.removeEventListener('touchend', end);
    };
  }, []);

  const size = Math.min(width, window.innerWidth * 0.85);

  return (
    <div className="canvas-wrap" style={{ width: size, height: size }}>
      {templateText !== null && (
        <canvas ref={templateRef} className="template-canvas" />
      )}
      {hintText !== null && (
        <div className="hint-number" style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'absolute' }}>
          {hintText}
        </div>
      )}
      <canvas ref={canvasRef} style={{ position: 'relative', zIndex: 10 }} />
    </div>
  );
});

export default DrawingCanvas;
