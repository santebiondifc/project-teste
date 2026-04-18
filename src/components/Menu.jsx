import { speak } from '../utils/speech';

export default function Menu({ setPage }) {
  const handleAction = (pageName, speechText) => {
    setPage(pageName);
    if (speechText) {
      speak(speechText);
    }
  };

  const handleSpeak = () => {
    speak('Scegli un gioco! Impara i numeri, disegna un numero, o rispondi con un numero!');
  };

  return (
    <div className="page active" id="p-menu">
      <div className="big-title stagger-1">Cosa facciamo? 🎮</div>
      <div className="menu-row stagger-2">
        <button className="activity-btn" onClick={() => handleAction('learn', '')}>
          <span>📖</span>Impara i numeri
        </button>
        <button className="activity-btn" onClick={() => handleAction('draw', 'Scegli un numero e prova a disegnarlo con il ditino!')}>
          <span>✏️</span>Disegna un numero
        </button>
        <button className="activity-btn" onClick={() => handleAction('quiz', '')}>
          <span>🤔</span>Rispondi con un numero
        </button>
      </div>
      <button className="speech-btn stagger-3" onClick={handleSpeak}>🔊</button>
    </div>
  );
}
