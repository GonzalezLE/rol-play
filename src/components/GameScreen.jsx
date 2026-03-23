import { useState, useEffect, useRef } from 'react';
import { GAME_SETTINGS } from '../config/gameSettings';
import retosData from '../data/retos.json';

export default function GameScreen({ jugador1, jugador2, onEndGame }) {
  const [turno, setTurno] = useState(1);
  const [jugadorActivo, setJugadorActivo] = useState(jugador1);
  const [retoActual, setRetoActual] = useState(null);
  
  const [tiempoRestante, setTiempoRestante] = useState(0);
  const [timerActivo, setTimerActivo] = useState(false);

  // Referencia para reutilizar el contexto de audio y no saturar el navegador
  const audioCtxRef = useRef(null);

  const getAudioContext = () => {
    if (!audioCtxRef.current) {
      audioCtxRef.current = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (audioCtxRef.current.state === 'suspended') {
      audioCtxRef.current.resume();
    }
    return audioCtxRef.current;
  };

  const calcularNivel = () => {
    if (turno >= GAME_SETTINGS.turnosParaNivel3) return 3;
    if (turno >= GAME_SETTINGS.turnosParaNivel2) return 2;
    return 1;
  };

  const nivelActual = calcularNivel();

  const obtenerNuevoReto = () => {
    const retosDelNivel = retosData.filter(reto => reto.nivel === nivelActual);
    const retoAleatorio = retosDelNivel[Math.floor(Math.random() * retosDelNivel.length)];
    setRetoActual(retoAleatorio);
    
    setTimerActivo(false);
    if (retoAleatorio.conTiempo) {
      setTiempoRestante(retoAleatorio.segundos || GAME_SETTINGS.tiempoBase);
    } else {
      setTiempoRestante(0);
    }
  };

  // Sonido corto (Tick) para los últimos 5 segundos
  const reproducirTick = () => {
    const context = getAudioContext();
    const osc = context.createOscillator();
    const gainNode = context.createGain();
    
    osc.connect(gainNode);
    gainNode.connect(context.destination);
    
    osc.type = 'sine'; 
    osc.frequency.setValueAtTime(500, context.currentTime); // Tono medio
    
    gainNode.gain.setValueAtTime(0.3, context.currentTime); // Volumen más bajo
    gainNode.gain.exponentialRampToValueAtTime(0.001, context.currentTime + 0.1); // Muy rápido
    
    osc.start(context.currentTime);
    osc.stop(context.currentTime + 0.1);
  };

  // Sonido largo (Ding) para cuando llega a cero
  const reproducirSonidoFin = () => {
    const context = getAudioContext();
    const osc = context.createOscillator();
    const gainNode = context.createGain();
    
    osc.connect(gainNode);
    gainNode.connect(context.destination);
    
    osc.type = 'sine'; 
    osc.frequency.setValueAtTime(800, context.currentTime); // Tono agudo
    
    gainNode.gain.setValueAtTime(1, context.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, context.currentTime + 0.5);
    
    osc.start(context.currentTime);
    osc.stop(context.currentTime + 0.5);
  };

  useEffect(() => {
    obtenerNuevoReto();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const avanzarTurno = () => {
    setTurno(turno + 1);
    setJugadorActivo(jugadorActivo === jugador1 ? jugador2 : jugador1);
  };

  useEffect(() => {
    if (turno > 1) {
      obtenerNuevoReto();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [turno]);

  // Lógica principal del cronómetro con alertas sonoras
  useEffect(() => {
    let intervalo = null;
    
    if (timerActivo && tiempoRestante > 0) {
      intervalo = setInterval(() => {
        setTiempoRestante((prev) => {
          const nuevoTiempo = prev - 1;
          
          // Lógica de sonidos
          if (nuevoTiempo > 0 && nuevoTiempo <= 5) {
            reproducirTick();
          } else if (nuevoTiempo === 0) {
            reproducirSonidoFin();
          }
          
          return nuevoTiempo;
        });
      }, 1000);
    } else if (tiempoRestante === 0 && timerActivo) {
      setTimerActivo(false);
    }
    
    return () => clearInterval(intervalo);
  }, [timerActivo, tiempoRestante]);

  const parejaActual = jugadorActivo === jugador1 ? jugador2 : jugador1;
  const textoProcesado = retoActual?.texto.replace('[Pareja]', parejaActual);

  if (!retoActual) return null;

  return (
    <div className="flex flex-col items-center min-h-screen p-6 bg-neutral-950 text-sans">
      
      <div className="flex justify-between w-full max-w-md mb-8 text-neutral-400 text-sm font-bold tracking-widest uppercase">
        <span>Turno {turno}</span>
        <span className="text-rose-500">Nivel {nivelActual}</span>
      </div>

      <h2 className="text-2xl text-neutral-300 mb-8 text-center">
        Es el turno de <br/>
        <span className="text-5xl font-black text-white">{jugadorActivo}</span>
      </h2>
      
      <div className="bg-neutral-900 border border-neutral-800 w-full max-w-md p-8 md:p-12 rounded-3xl text-center shadow-2xl mb-12 flex flex-col items-center justify-center min-h-[250px] relative overflow-hidden">
        
        {retoActual.conTiempo && (
          <button 
            onClick={() => {
              // Si va a iniciar y quedan 5 segundos o menos, hacemos el primer tick
              if (!timerActivo && tiempoRestante <= 5 && tiempoRestante > 0) {
                reproducirTick();
              }
              setTimerActivo(!timerActivo);
            }}
            disabled={tiempoRestante === 0}
            className={`absolute top-4 left-1/2 -translate-x-1/2 text-sm font-bold px-4 py-1.5 rounded-full border transition-all ${
              tiempoRestante === 0 
                ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30 cursor-default'
                : timerActivo
                  ? tiempoRestante <= 5 
                    ? 'bg-red-600/30 text-red-400 border-red-500/50 animate-bounce' // Alerta visual en los últimos 5s
                    : 'bg-amber-500/20 text-amber-400 border-amber-500/30 animate-pulse'
                  : 'bg-rose-500/20 text-rose-400 border-rose-500/30 hover:bg-rose-500/30 cursor-pointer'
            }`}
          >
            {tiempoRestante === 0 
              ? '✅ ¡Tiempo terminado!' 
              : timerActivo 
                ? `⏳ Quedan ${tiempoRestante}s (Pausar)`
                : `▶️ Iniciar Timer (${tiempoRestante}s)`
            }
          </button>
        )}

        <p className={`text-xl md:text-2xl font-medium text-white leading-relaxed ${retoActual.conTiempo ? 'mt-8' : ''}`}>
          {textoProcesado}
        </p>

      </div>

      <button 
        onClick={avanzarTurno}
        className="w-full max-w-md bg-white text-neutral-950 hover:bg-neutral-200 font-bold py-4 px-6 rounded-xl transition-transform active:scale-95 shadow-lg mb-8 text-lg"
      >
        Completado (Siguiente turno)
      </button>

      {/* Botón de "Me rindo" / Fin del juego ESTILIZADO */}
      <button 
        onClick={onEndGame}
        className="text-rose-500 hover:text-white bg-rose-500/10 hover:bg-rose-600 transition-colors font-semibold text-sm mt-auto mb-4 p-4 rounded-xl border border-rose-500/20 shadow-md shadow-rose-950/20"
      >
        🚨 ¡No aguanto más! (Terminar juego)
      </button>
      
    </div>
  );
}