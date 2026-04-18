import { speak } from '../utils/speech';

export default function Intro({ setPage }) {
  const handleStart = () => {
    speak('Ciao! Benvenuto! Oggi impariamo i numeri giocando insieme. Premi il bottone verde per iniziare!');
    setTimeout(() => setPage('menu'), 100);
  };

  const handleSpeak = () => {
    speak('Ciao! Benvenuto! Oggi impariamo i numeri giocando insieme!');
  };

  return (
    <div className="page active" id="p-intro">
      <div className="big-title stagger-1">🔢 Impariamo i Numeri! 🔢</div>
      
      <div className="stagger-2" style={{ fontSize: '80px', animation: 'float 3s ease-in-out infinite' }}>
        🧒
      </div>
      
      <div className="subtitle stagger-3">
        Ciao piccolo amico!<br />Oggi impariamo i numeri<br />giocando insieme! 🎉
      </div>
      
      <button className="btn stagger-4" onClick={handleStart}>
        ▶ INIZIAMO!
      </button>
      
      <button className="speech-btn stagger-5" onClick={handleSpeak}>🔊</button>
    </div>
  );
}
