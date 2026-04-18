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
      <div className="big-title">🔢 Impariamo i Numeri! 🔢</div>
      <div style={{ fontSize: '80px', animation: 'bounce 1s ease infinite' }}>🧒</div>
      <div className="subtitle">
        Ciao piccolo amico!<br />Oggi impariamo i numeri<br />giocando insieme! 🎉
      </div>
      <button className="btn" onClick={handleStart}>
        ▶ INIZIAMO!
      </button>
      <button className="speech-btn" onClick={handleSpeak}>🔊</button>
    </div>
  );
}
