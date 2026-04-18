import { useState, useEffect, useRef, useCallback } from 'react';
import { questions, numberNames } from '../utils/questions';
import { speak } from '../utils/speech';
import DrawingCanvas from './DrawingCanvas';
import Confetti from './Confetti';

export default function Quiz({ setPage }) {
  const [currentQIdx, setCurrentQIdx] = useState(() => Math.floor(Math.random() * questions.length));
  const [feedback, setFeedback] = useState(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const canvasRef = useRef(null);

  const loadQuestion = useCallback((idx) => {
    setCurrentQIdx(idx);
    setFeedback(null);
    if (canvasRef.current) canvasRef.current.clearCanvas();
    const q = questions[idx];
    setTimeout(() => speak(q.q + ' Disegna la risposta con il ditino!'), 400);
  }, []);

  useEffect(() => {
    loadQuestion(currentQIdx);
  }, [currentQIdx, loadQuestion]);

  const handleClear = () => {
    if (canvasRef.current) canvasRef.current.clearCanvas();
    setFeedback(null);
  };

  const handleCheck = () => {
    if (!canvasRef.current) return;
    
    const q = questions[currentQIdx];
    const ans = q.accept[0];

    if (!canvasRef.current.validateDrawing(ans)) {
      setFeedback({ type: 'retry', msg: '✏️ Prova ancora! Disegna la risposta!' });
      speak('Prova ancora! Disegna la risposta con il dito!');
      return;
    }

    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 3500);

    speak(`Bravissimo! La risposta è ${ans}, ${numberNames[ans]}! Sei un genio!`);
    setFeedback({ type: 'ok', msg: `🎉 La risposta è ${ans}! Bravissimo! 🎉` });
  };

  const nextQuiz = () => {
    let next;
    do { 
      next = Math.floor(Math.random() * questions.length); 
    } while(next === currentQIdx && questions.length > 1);
    loadQuestion(next);
  };

  const q = questions[currentQIdx];

  return (
    <div className="page active" id="p-quiz">
      <Confetti trigger={showConfetti} />
      
      <div className="big-title stagger-1" style={{ fontSize: 'clamp(22px, 5.5vw, 28px)' }}>Domanda per te! 🤔</div>
      
      <div className="question-card stagger-2">
        <div className="question-text">{q.q}</div>
        <div style={{ fontSize: '50px', marginTop: '10px', filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))' }}>{q.img}</div>
      </div>
      
      <div className="subtitle stagger-3" style={{ fontSize: '16px', opacity: 0.7 }}>Scrivi la risposta con il ditino ☝️</div>
      
      <DrawingCanvas ref={canvasRef} hintText={q.hint} />

      <div id="quiz-feedback">
        {feedback && (
          <div className={feedback.type === 'ok' ? 'feedback-ok' : 'feedback-retry'}>
            {feedback.msg}
          </div>
        )}
      </div>

      <div className="nav-row">
        <button className="clear-btn" onClick={handleClear}>🔄 Riprova</button>
        <button className="btn" onClick={handleCheck}>✅ Rispondo!</button>
      </div>
      <div className="nav-row">
        <button className="btn" onClick={nextQuiz} style={{ fontSize: '15px', padding: '10px 24px' }}>⏩ Altra domanda</button>
        <button className="btn btn-red" onClick={() => setPage('menu')} style={{ fontSize: '15px', padding: '10px 24px' }}>🏠 Menu</button>
      </div>
    </div>
  );
}
