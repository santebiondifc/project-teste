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
      setFeedback({ type: 'retry', msg: '✏️ Disegna la risposta!' });
      speak('Disegna la risposta con il dito!');
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
      
      <div className="big-title" style={{ fontSize: '26px' }}>Domanda per te! 🤔</div>
      <div className="question-card">
        <div className="question-text">{q.q}</div>
        <div style={{ fontSize: '50px', marginTop: '8px' }}>{q.img}</div>
      </div>
      
      <div className="subtitle" style={{ fontSize: '17px' }}>Scrivi la risposta con il ditino ☝️</div>
      
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
        <button className="btn" onClick={nextQuiz} style={{ fontSize: '16px', padding: '10px 24px' }}>⏩ Altra domanda</button>
        <button className="btn btn-red" onClick={() => setPage('menu')} style={{ fontSize: '16px', padding: '10px 24px' }}>🏠 Menu</button>
      </div>
    </div>
  );
}
