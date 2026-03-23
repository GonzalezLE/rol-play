import { useState } from 'react';
import WelcomeScreen from './components/WelcomeScreen';
import GameScreen from './components/GameScreen';

function App() {
  const [gameState, setGameState] = useState({
    isActive: false,
    jugador1: '',
    jugador2: ''
  });

  const handleStartGame = (nombre1, nombre2) => {
    setGameState({
      isActive: true,
      jugador1: nombre1,
      jugador2: nombre2
    });
  };

  const handleEndGame = () => {
    // Esto nos servirá más adelante para cuando alguien presione "Me rindo"
    setGameState({ isActive: false, jugador1: '', jugador2: '' });
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-white font-sans selection:bg-rose-500/30">
      {!gameState.isActive ? (
        <WelcomeScreen onStartGame={handleStartGame} />
      ) : (
        <GameScreen 
          jugador1={gameState.jugador1} 
          jugador2={gameState.jugador2} 
          onEndGame={handleEndGame}
        />
      )}
    </div>
  );
}

export default App;