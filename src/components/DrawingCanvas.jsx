import { useRef, useEffect, forwardRef, useImperativeHandle } from 'react';

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
      ctx.lineWidth = Math.max(14, canvas.width / 18);
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
      const width = canvas.width;
      const height = canvas.height;
      const userData = ctx.getImageData(0, 0, width, height).data;
      
      // Count total user pixels
      let totalUserPixels = 0;
      for (let i = 3; i < userData.length; i += 4) {
        if (userData[i] > 50) totalUserPixels++;
      }
      
      // If they didn't draw enough, fail early
      if (totalUserPixels < 150) return false;
      
      // If we don't have a target, just return true since they drew something
      if (targetNumber === null || targetNumber === undefined) return true;
      
      // Create off-screen canvas for validation template
      const tempCanvas = document.createElement('canvas');
      tempCanvas.width = width;
      tempCanvas.height = height;
      const tempCtx = tempCanvas.getContext('2d');
      
      tempCtx.font = `bold ${width * 0.72}px 'Comic Sans MS', cursive`;
      tempCtx.textAlign = 'center'; 
      tempCtx.textBaseline = 'middle';
      tempCtx.lineCap = 'round';
      tempCtx.lineJoin = 'round';
      
      // 1. CORE MASK (Coverage check: did they draw enough of the actual number?)
      tempCtx.clearRect(0, 0, width, height);
      tempCtx.fillStyle = 'black';
      tempCtx.strokeStyle = 'black';
      // Same thickness as user's stroke
      tempCtx.lineWidth = Math.max(14, width / 18); 
      tempCtx.fillText(String(targetNumber), width / 2, height / 2);
      tempCtx.strokeText(String(targetNumber), width / 2, height / 2);
      const coreData = tempCtx.getImageData(0, 0, width, height).data;
      
      let totalCorePixels = 0;
      let coveredCorePixels = 0;
      
      for (let i = 3; i < coreData.length; i += 4) {
        if (coreData[i] > 50) {
          totalCorePixels++;
          if (userData[i] > 50) {
            coveredCorePixels++;
          }
        }
      }
      
      // 2. TOLERANCE MASK (Precision check: did they draw too much outside?)
      tempCtx.clearRect(0, 0, width, height);
      tempCtx.fillStyle = 'black';
      tempCtx.strokeStyle = 'black';
      // Very thick stroke to create a forgiving safe zone
      tempCtx.lineWidth = width / 3.5; 
      tempCtx.fillText(String(targetNumber), width / 2, height / 2);
      tempCtx.strokeText(String(targetNumber), width / 2, height / 2);
      const tolData = tempCtx.getImageData(0, 0, width, height).data;
      
      let outsidePixels = 0;
      for (let i = 3; i < userData.length; i += 4) {
        if (userData[i] > 50) {
          // If user pixel is outside the thick tolerance mask
          if (tolData[i] < 50) {
            outsidePixels++;
          }
        }
      }
      
      const coverage = totalCorePixels > 0 ? (coveredCorePixels / totalCorePixels) : 0;
      const outsideRatio = totalUserPixels > 0 ? (outsidePixels / totalUserPixels) : 1;
      
      // Per i bambini: 
      // - Devono coprire almeno il 40% della forma corretta (coverage > 0.40)
      // - Meno del 45% del loro disegno deve uscire dai bordi tollerati (outsideRatio < 0.45)
      return coverage > 0.40 && outsideRatio < 0.45;
    }
  }));

  // Initialize main canvas context
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    // Set actual width and height
    const size = Math.min(width, window.innerWidth * 0.88);
    canvas.width = size;
    canvas.height = size;
    canvas.style.width = size + 'px';
    canvas.style.height = size + 'px';
    
    const ctx = canvas.getContext('2d');
    ctx.strokeStyle = '#FFD700'; 
    ctx.lineWidth = Math.max(14, size / 18);
    ctx.lineCap = 'round'; 
    ctx.lineJoin = 'round';
  }, [width, height]);

  // Handle template rendering
  useEffect(() => {
    if (templateText !== null && templateRef.current) {
      const canvas = templateRef.current;
      const size = Math.min(width, window.innerWidth * 0.88);
      canvas.width = size;
      canvas.height = size;
      canvas.style.width = size + 'px';
      canvas.style.height = size + 'px';
      
      const ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, size, size);
      ctx.fillStyle = 'rgba(255,255,255,0.6)';
      ctx.font = `bold ${size * 0.72}px 'Comic Sans MS', cursive`;
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
      const src = e.touches ? e.touches[0] : e;
      return [src.clientX - rect.left, src.clientY - rect.top];
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

  const size = Math.min(width, window.innerWidth * 0.88);

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
