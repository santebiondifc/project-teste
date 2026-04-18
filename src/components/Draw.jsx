import { useState, useRef } from 'react';
import { numberNames } from '../utils/questions';
import { speak } from '../utils/speech';
import DrawingCanvas from './DrawingCanvas';
import Confetti from './Confetti';

const NUM_COLORS = [
  '#e94560', '#FFD700', '#4ECDC4', '#FF6B6B', '#45B7D1',
  '#96CEB4', '#FFEAA7', '#a29bfe', '#fd79a8', '#00b894'
];

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
      setFeedback({ type: 'retry', msg: '✏️ Prova ancora! Disegna il numero con il ditino!' });
      speak('Prova ancora! Usa il dito e disegna il numero sullo schermo!');
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
        <div className="big-title stagger-1">Scegli un numero! ✨</div>
        <div className="number-grid stagger-2">
          {Array.from({ length: 10 }).map((_, i) => (
            <button 
              key={i} 
              className="num-btn" 
              onClick={() => startDrawNumber(i)}
              style={{
                borderColor: `${NUM_COLORS[i]}55`,
                textShadow: `0 0 20px ${NUM_COLORS[i]}44`
              }}
            >
              {i}
            </button>
          ))}
        </div>
        <button className="btn btn-red stagger-3" onClick={() => setPage('menu')} style={{ fontSize: '15px', padding: '10px 24px', marginTop: '4px' }}>
          🏠 Menu
        </button>
      </div>
    );
  }

  return (
    <div className="page active" id="p-draw">
      <Confetti trigger={showConfetti} />
      
      <div style={{ width: '100%', display: 'flex', alignItems: 'center', flexDirection: 'column', gap: '14px' }}>
        <div className="big-title" style={{ fontSize: 'clamp(22px, 5.5vw, 30px)' }}>
          Disegna il numero <span style={{ 
            fontSize: 'clamp(36px, 10vw, 52px)', 
            color: NUM_COLORS[selectedNum],
            filter: `drop-shadow(0 0 10px ${NUM_COLORS[selectedNum]}55)`,
            fontWeight: 900
          }}>{selectedNum}</span>
        </div>
        
        <DrawingCanvas ref={canvasRef} hintText={selectedNum} />

        <div id="draw-feedback">
          {feedback && (
            <div className={feedback.type === 'ok' ? 'feedback-ok' : 'feedback-retry'} style={feedback.msg.includes('Vuoi provare') ? {fontSize: '17px'} : {}}>
              {feedback.msg}
            </div>
          )}
        </div>

        <div className="nav-row">
          <button className="clear-btn" onClick={handleClear}>🔄 Riprova</button>
          <button className="btn" onClick={handleCheck}>✅ Fatto!</button>
          <button className="btn btn-red" style={{ fontSize: '15px', padding: '10px 20px' }} onClick={showGrid}>↩ Scegli</button>
        </div>
      </div>
    </div>
  );
}
