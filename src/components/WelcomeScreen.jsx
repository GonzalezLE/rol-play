import { useState } from 'react';

export default function WelcomeScreen({ onStartGame }) {
  const [jugador1, setJugador1] = useState('');
  const [jugador2, setJugador2] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (jugador1.trim() && jugador2.trim()) {
      onStartGame(jugador1, jugador2);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-neutral-950 p-6">
      <div className="bg-neutral-900 p-8 rounded-2xl shadow-2xl w-full max-w-md border border-neutral-800">
        <h1 className="text-4xl font-black text-rose-500 mb-6 text-center">Retos App</h1>
        <p className="text-neutral-400 mb-8 text-center text-sm">
          Ingresen sus nombres para comenzar la partida.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-neutral-300 mb-2 text-sm">Jugador 1</label>
            <input 
              type="text" 
              value={jugador1}
              onChange={(e) => setJugador1(e.target.value)}
              className="w-full bg-neutral-800 text-white border border-neutral-700 rounded-lg p-3 focus:outline-none focus:border-rose-500 transition-colors"
              placeholder="Ej. Luis"
              required
            />
          </div>
          <div>
            <label className="block text-neutral-300 mb-2 text-sm">Jugador 2</label>
            <input 
              type="text" 
              value={jugador2}
              onChange={(e) => setJugador2(e.target.value)}
              className="w-full bg-neutral-800 text-white border border-neutral-700 rounded-lg p-3 focus:outline-none focus:border-rose-500 transition-colors"
              placeholder="Ej. Ana"
              required
            />
          </div>
          <button 
            type="submit"
            className="w-full bg-rose-600 hover:bg-rose-500 text-white font-bold py-3 px-4 rounded-lg mt-6 transition-colors shadow-lg shadow-rose-900/50"
          >
            Comenzar Juego
          </button>
        </form>
      </div>
    </div>
  );
}