import { useState, useRef } from 'react';
import { numberNames } from '../utils/questions';
import { speak } from '../utils/speech';
import DrawingCanvas from './DrawingCanvas';
import Confetti from './Confetti';

export default function Draw({ setPage }) {
  const [selectedNum, setSelectedNum] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const canvasRef = useRef(null);

  const startDrawNumber = (n) => {
    setSelectedNum(n);
    setFeedback(null);
    speak(`Disegna il numero ${n}, ${numberNames[n]}! Usa il ditino sullo schermo!`);
  };

  const handleClear = () => {
    if (canvasRef.current) canvasRef.current.clearCanvas();
    setFeedback(null);
  };

  const handleCheck = () => {
    if (!canvasRef.current) return;
    
    if (!canvasRef.current.validateDrawing(selectedNum)) {
      setFeedback({ type: 'retry', msg: '✏️ Disegna il numero con il ditino!' });
      speak('Usa il dito e disegna il numero sullo schermo!');
      return;
    }

    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 3500);

    speak(`Fantastico! Hai disegnato il ${selectedNum}! Sei bravissimo!`);
    setFeedback({ type: 'ok', msg: '🌟 Fantastico! 🌟' });

    setTimeout(() => {
      setFeedback({ type: 'ok', msg: 'Vuoi provare un altro numero?' });
    }, 2200);
  };

  const showGrid = () => {
    setSelectedNum(null);
    setFeedback(null);
  };

  if (selectedNum === null) {
    return (
      <div className="page active" id="p-draw">
        <div className="big-title">Scegli un numero!</div>
        <div className="number-grid">
          {Array.from({ length: 10 }).map((_, i) => (
            <button key={i} className="num-btn" onClick={() => startDrawNumber(i)}>
              {i}
            </button>
          ))}
        </div>
        <button className="btn btn-red" onClick={() => setPage('menu')} style={{ fontSize: '16px', padding: '10px 24px', marginTop: '8px' }}>
          🏠 Menu
        </button>
      </div>
    );
  }

  return (
    <div className="page active" id="p-draw">
      <Confetti trigger={showConfetti} />
      
      <div style={{ width: '100%', display: 'flex', alignItems: 'center', flexDirection: 'column', gap: '14px' }}>
        <div className="big-title" style={{ fontSize: '28px' }}>
          Disegna il numero <span style={{ fontSize: '48px', color: '#FFD700' }}>{selectedNum}</span>
        </div>
        
        <DrawingCanvas ref={canvasRef} hintText={selectedNum} />

        <div id="draw-feedback">
          {feedback && (
            <div className={feedback.type === 'ok' ? 'feedback-ok' : 'feedback-retry'} style={feedback.msg.includes('Vuoi provare') ? {fontSize: '18px'} : {}}>
              {feedback.msg}
            </div>
          )}
        </div>

        <div className="nav-row">
          <button className="clear-btn" onClick={handleClear}>🔄 Riprova</button>
          <button className="btn" onClick={handleCheck}>✅ Fatto!</button>
          <button className="btn btn-red" style={{ fontSize: '16px', padding: '10px 20px' }} onClick={showGrid}>↩ Scegli</button>
        </div>
      </div>
    </div>
  );
}
