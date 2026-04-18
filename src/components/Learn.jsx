import { useState, useEffect, useRef } from 'react';
import { numberNames } from '../utils/questions';
import { speak } from '../utils/speech';
import DrawingCanvas from './DrawingCanvas';
import Confetti from './Confetti';

export default function Learn({ setPage }) {
  const [currentNum, setCurrentNum] = useState(0);
  const [doneList, setDoneList] = useState(new Set());
  const [feedback, setFeedback] = useState(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const canvasRef = useRef(null);

  useEffect(() => {
    speakCurrentNumber(currentNum);
  }, [currentNum]);

  const speakCurrentNumber = (n) => {
    speak(`Questo è il numero ${n}. Si chiama ${numberNames[n]}! Segui la forma con il ditino!`);
  };

  const handleClear = () => {
    if (canvasRef.current) canvasRef.current.clearCanvas();
    setFeedback(null);
  };

  const handleCheck = () => {
    if (!canvasRef.current) return;
    
    if (!canvasRef.current.validateDrawing(currentNum)) {
      setFeedback({ type: 'retry', msg: '✏️ Prova a tracciare il numero con il ditino!' });
      speak('Prova ancora! Usa il ditino per seguire il numero!');
      return;
    }

    setDoneList(prev => new Set(prev).add(currentNum));
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 3500);

    speak(`Bravo! Hai disegnato il ${currentNum}! Stai imparando benissimo!`);
    setFeedback({ type: 'ok', msg: '⭐ Bravissimo! ⭐' });

    setTimeout(() => {
      if (currentNum < 9) {
        setCurrentNum(prev => prev + 1);
        setFeedback(null);
        if (canvasRef.current) canvasRef.current.clearCanvas();
      } else {
        speak('Complimenti! Hai imparato tutti i numeri da zero a nove! Sei un campione!');
        setFeedback({ type: 'ok', msg: '🏆 Hai imparato tutti i numeri! Sei un campione! 🏆' });
      }
    }, 2200);
  };

  return (
    <div className="page active" id="p-learn">
      <Confetti trigger={showConfetti} />
      
      <div className="progress-dots stagger-1">
        {Array.from({ length: 10 }).map((_, i) => (
          <div key={i} className={`dot ${doneList.has(i) ? 'done' : ''} ${i === currentNum ? 'active' : ''}`} />
        ))}
      </div>

      <div className="big-title stagger-2" style={{ fontSize: 'clamp(22px, 5vw, 32px)' }}>Questo è il numero</div>
      <div className="number-display stagger-2">{currentNum}</div>
      <div className="subtitle stagger-3" style={{ 
        fontSize: 'clamp(18px, 4.5vw, 26px)', 
        fontWeight: 800, 
        color: 'rgba(255, 215, 0, 0.9)',
        textTransform: 'uppercase',
        letterSpacing: '0.08em'
      }}>
        {numberNames[currentNum]}
      </div>
      
      <button className="speech-btn stagger-3" onClick={() => speakCurrentNumber(currentNum)}>🔊</button>
      <div className="subtitle stagger-4" style={{ fontSize: '16px', opacity: 0.7 }}>Ora segui la forma con il ditino! 👇</div>

      <DrawingCanvas ref={canvasRef} templateText={currentNum} />

      <div id="learn-feedback">
        {feedback && (
          <div className={feedback.type === 'ok' ? 'feedback-ok' : 'feedback-retry'} style={feedback.msg.includes('campione') ? {fontSize: '18px'} : {}}>
            {feedback.msg}
          </div>
        )}
      </div>

      <div className="nav-row">
        <button className="clear-btn" onClick={handleClear}>🔄 Riprova</button>
        <button className="btn" onClick={handleCheck}>✅ Fatto!</button>
      </div>
      <button className="btn btn-red" onClick={() => setPage('menu')} style={{ fontSize: '15px', padding: '10px 24px' }}>🏠 Menu</button>
    </div>
  );
}
