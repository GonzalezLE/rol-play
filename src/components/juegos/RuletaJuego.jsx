import { useState, useRef } from 'react';
import opcionesCartas from '../../data/ruleta.json';
import { GAME_SETTINGS } from '../../config/gameSettings';

export default function RuletaJuego({ onBackToCatalog }) {
  const [turno, setTurno] = useState(1);
  const [isSelecting, setIsSelecting] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [resultado, setResultado] = useState(null);
  
  const audioCtxRef = useRef(null);

  // Calcular el nivel igual que en el juego principal
  const nivelActual = turno >= GAME_SETTINGS.turnosParaNivel3 ? 3 
                    : turno >= GAME_SETTINGS.turnosParaNivel2 ? 2 
                    : 1;

  // Filtramos el mazo para usar solo las cartas del nivel actual
  const cartasDisponibles = opcionesCartas.filter(carta => carta.nivel === nivelActual);

  const getAudioContext = () => {
    if (!audioCtxRef.current) {
      audioCtxRef.current = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (audioCtxRef.current.state === 'suspended') audioCtxRef.current.resume();
    return audioCtxRef.current;
  };

  const reproducirTick = () => {
    const ctx = getAudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.frequency.value = 600;
    gain.gain.setValueAtTime(0.1, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.05);
  };

  const reproducirDing = () => {
    const ctx = getAudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.frequency.value = 880;
    gain.gain.setValueAtTime(1, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.6);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.6);
  };

  const sacarCarta = () => {
    if (isSelecting) return;
    setIsSelecting(true);
    setResultado(null);

    let saltos = 0;
    const maxSaltos = 20;
    
    const intervalo = setInterval(() => {
      // La animación salta solo entre las cartas del nivel actual
      const randomIdx = Math.floor(Math.random() * cartasDisponibles.length);
      setSelectedIndex(randomIdx);
      reproducirTick();
      saltos++;

      if (saltos >= maxSaltos) {
        clearInterval(intervalo);
        const ganadorIdx = Math.floor(Math.random() * cartasDisponibles.length);
        setSelectedIndex(ganadorIdx);
        setResultado(cartasDisponibles[ganadorIdx]);
        setIsSelecting(false);
        setTurno(prev => prev + 1); // Avanzamos el turno al revelar la carta
        reproducirDing();
      }
    }, 120);
  };

  const obtenerEstiloCarta = (tipo, isActive) => {
    let colores = "";
    if (tipo === "Reto") colores = "text-rose-500 border-rose-500/30 bg-rose-500/10";
    if (tipo === "Pregunta") colores = "text-purple-500 border-purple-500/30 bg-purple-500/10";
    if (tipo === "Comodín") colores = "text-amber-500 border-amber-500/50 bg-amber-500/20";

    if (isActive) {
      return `${colores} border-2 scale-105 shadow-lg shadow-white/10`;
    }
    return `${colores} border opacity-70 scale-100`;
  };

  return (
    <div className="flex flex-col items-center min-h-screen p-6 bg-neutral-950 text-white font-sans relative">
      
      <button 
        onClick={onBackToCatalog}
        className="absolute top-4 left-4 z-50 bg-neutral-800 text-neutral-300 hover:text-white px-4 py-2 rounded-lg text-sm font-bold transition-colors"
      >
        ← Catálogo
      </button>

      {/* Indicador de Nivel y Turno */}
      <div className="flex justify-between w-full max-w-2xl mb-8 mt-12 md:mt-4 text-neutral-400 text-sm font-bold tracking-widest uppercase">
        <span>Turno {turno}</span>
        <span className="text-amber-500">Nivel {nivelActual}</span>
      </div>

      <h2 className="text-3xl font-black text-rose-500 mb-2">Cartas del Destino</h2>
      <p className="text-neutral-400 mb-8 text-center text-sm md:text-base">
        Saca una carta. El mazo se calienta conforme avanzan los turnos.
      </p>

      {/* Cuadrícula Dinámica (Muestra las cartas de Nivel Actual) */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 w-full max-w-2xl mb-12">
        {cartasDisponibles.map((carta, index) => {
          const isActive = selectedIndex === index;
          return (
            <div 
              key={carta.id}
              className={`flex flex-col items-center justify-center p-6 rounded-xl transition-all duration-150 ${obtenerEstiloCarta(carta.tipo, isActive)}`}
            >
              <span className="font-bold uppercase tracking-widest text-sm mb-1">{carta.tipo}</span>
              <span className="text-xl font-black opacity-30">?</span>
            </div>
          );
        })}
      </div>

      <button 
        onClick={sacarCarta}
        disabled={isSelecting}
        className={`w-full max-w-xs font-bold py-4 px-6 rounded-xl transition-all shadow-lg text-lg mb-8 ${
          isSelecting 
            ? 'bg-neutral-800 text-neutral-500 cursor-not-allowed' 
            : 'bg-rose-600 hover:bg-rose-500 text-white active:scale-95 shadow-rose-900/50'
        }`}
      >
        {isSelecting ? 'Eligiendo...' : 'Sacar Carta Aleatoria'}
      </button>

      {resultado && (
        <div className={`w-full max-w-md p-8 border rounded-2xl text-center transition-all duration-500 ${resultado ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'} ${obtenerEstiloCarta(resultado.tipo, false)}`}>
          <p className="text-xs font-bold uppercase tracking-widest mb-3 opacity-70">
            Tu destino es: {resultado.tipo}
          </p>
          <p className="text-2xl font-black text-white">
            {resultado.texto}
          </p>
        </div>
      )}
      
    </div>
  );
}