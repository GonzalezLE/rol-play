import { useState, useEffect } from 'react';
import GameLayout from '../GameLayout';
import dataRetos from '../../data/retos.json';

export default function RetosPareja({ config, nivel, onTurno, onBackToCatalog }) {
  const [reto, setReto] = useState(null);
  // Estado local para saber a quién le toca (0 o 1)
  const [turnoIndex, setTurnoIndex] = useState(0);

  const sacarReto = () => {
    // 1. Filtramos por nivel
    let disponibles = dataRetos.filter(r => r.intensidad === nivel);
    if (disponibles.length === 0) disponibles = dataRetos; 

    const random = disponibles[Math.floor(Math.random() * disponibles.length)];
    setReto(random);

    // 2. Cambiamos el turno local (Si es 0 pasa a 1, si es 1 pasa a 0)
    setTurnoIndex(prev => (prev === 0 ? 1 : 0));

    // 3. Avisamos a App.jsx para que suba la temperatura global
    onTurno(); 
  };

  // Cargar el primer reto sin avanzar el turno global aún
  useEffect(() => {
    const disponibles = dataRetos.filter(r => r.intensidad === nivel);
    setReto(disponibles[Math.floor(Math.random() * disponibles.length)] || dataRetos[0]);
  }, []);

  // Identificamos quién actúa y quién recibe
  const jugadorActivo = config[turnoIndex];
  const jugadorPasivo = config[turnoIndex === 0 ? 1 : 0];

  return (
    <GameLayout nivel={nivel} gameTitle="Retos por Turnos" onBackToCatalog={onBackToCatalog}>
      <div className="text-center flex flex-col items-center gap-8">
        
        <div className="space-y-2">
          {/* Aquí es donde verás el cambio de nombre */}
          <span className={`text-[11px] font-black uppercase tracking-[0.4em] transition-colors duration-500 ${nivel === 'hard' ? 'text-red-400' : 'text-rose-500'}`}>
            Turno de: {jugadorActivo.nombre}
          </span>
          
          <h2 className="text-3xl md:text-5xl font-black leading-tight tracking-tighter transition-all duration-500">
            {reto ? reto.texto.replace('[Pareja]', jugadorPasivo.nombre) : "Cargando..."}
          </h2>
        </div>

        <button 
          onClick={sacarReto}
          className={`w-full max-w-xs py-5 rounded-[2rem] font-black text-xs uppercase tracking-widest transition-all active:scale-95 shadow-2xl ${
            nivel === 'soft' ? 'bg-white text-black hover:bg-neutral-200' : 
            nivel === 'medium' ? 'bg-orange-600 text-white shadow-orange-900/40' : 
            'bg-red-600 text-white animate-pulse shadow-red-900/60'
          }`}
        >
          {nivel === 'hard' ? '¡DAME OTRO! 🔥' : 'SIGUIENTE TURNO →'}
        </button>
        
      </div>
    </GameLayout>
  );
}