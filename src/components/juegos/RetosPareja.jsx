import { useState } from 'react';
import WelcomeScreen from '../WelcomeScreen';
import GameScreen from '../GameScreen';

export default function RetosPareja({ onBackToCatalog }) {
  const [gameState, setGameState] = useState({
    isActive: false,
    jugador1: '',
    jugador2: ''
  });

  const handleStartGame = (nombre1, nombre2) => {
    setGameState({ isActive: true, jugador1: nombre1, jugador2: nombre2 });
  };

  const handleEndGame = () => {
    setGameState({ isActive: false, jugador1: '', jugador2: '' });
    // Opcional: Si quieres que al terminar regresen al catálogo en lugar de la pantalla de nombres
    // onBackToCatalog(); 
  };

  return (
    <div className="w-full relative">
      {/* Botón flotante para regresar al catálogo */}
      <button 
        onClick={onBackToCatalog}
        className="absolute top-4 left-4 z-50 bg-neutral-800 text-neutral-300 hover:text-white px-4 py-2 rounded-lg text-sm font-bold transition-colors"
      >
        ← Catálogo
      </button>

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