import { useState, useRef } from 'react';
import dataContacto from '../../data/contacto.json';

export default function ContactoFisico({ onBackToCatalog }) {
  // Estados de configuración
  const [gameStarted, setGameStarted] = useState(false);
  const [jugadores, setJugadores] = useState([
    { nombre: '', rol: 'hombre' },
    { nombre: '', rol: 'mujer' }
  ]);
  const [turnoIndex, setTurnoIndex] = useState(0);

  // Estados de la tragamonedas
  const [isSpinning, setIsSpinning] = useState(false);
  const [accionActual, setAccionActual] = useState('???');
  const [zonaActual, setZonaActual] = useState('???');
  const [resultadoFinal, setResultadoFinal] = useState(false);
  
  const audioCtxRef = useRef(null);

  const jugadorActivo = jugadores[turnoIndex];
  const jugadorPasivo = jugadores[turnoIndex === 0 ? 1 : 0];

  const iniciarJuego = (e) => {
    e.preventDefault();
    if (jugadores[0].nombre.trim() && jugadores[1].nombre.trim()) {
      setGameStarted(true);
    }
  };

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
    osc.frequency.value = 400;
    gain.gain.setValueAtTime(0.05, ctx.currentTime);
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
    osc.frequency.value = 1000;
    gain.gain.setValueAtTime(1, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.7);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.7);
  };

  const generarContacto = () => {
    if (isSpinning) return;
    setIsSpinning(true);
    setResultadoFinal(false);

    // Seleccionar las listas correctas basadas en los roles
    const listaAcciones = dataContacto[`acciones_${jugadorActivo.rol}`];
    const listaZonas = dataContacto[`zonas_${jugadorPasivo.rol}`];

    let saltos = 0;
    const maxSaltos = 25;
    
    const intervalo = setInterval(() => {
      setAccionActual(listaAcciones[Math.floor(Math.random() * listaAcciones.length)]);
      setZonaActual(listaZonas[Math.floor(Math.random() * listaZonas.length)]);
      
      reproducirTick();
      saltos++;

      if (saltos >= maxSaltos) {
        clearInterval(intervalo);
        setIsSpinning(false);
        setResultadoFinal(true);
        reproducirDing();
      }
    }, 100);
  };

  const siguienteTurno = () => {
    setTurnoIndex(turnoIndex === 0 ? 1 : 0);
    setAccionActual('???');
    setZonaActual('???');
    setResultadoFinal(false);
  };

  // --- PANTALLA DE CONFIGURACIÓN ---
  if (!gameStarted) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-neutral-950 text-white font-sans relative">
        <button onClick={onBackToCatalog} className="absolute top-4 left-4 z-50 bg-neutral-800 text-neutral-300 hover:text-white px-4 py-2 rounded-lg text-sm font-bold transition-colors">
          ← Catálogo
        </button>

        <div className="bg-neutral-900 p-8 rounded-3xl border border-neutral-800 w-full max-w-md shadow-2xl">
          <h2 className="text-3xl font-black text-orange-500 mb-6 text-center">Configurar Jugadores</h2>
          
          <form onSubmit={iniciarJuego} className="space-y-6">
            {/* Jugador 1 */}
            <div className="space-y-3">
              <label className="text-neutral-400 font-bold text-sm uppercase tracking-widest">Jugador 1</label>
              <input 
                type="text" placeholder="Nombre" required
                value={jugadores[0].nombre}
                onChange={(e) => setJugadores([{...jugadores[0], nombre: e.target.value}, jugadores[1]])}
                className="w-full bg-neutral-950 border border-neutral-700 rounded-xl p-3 text-white focus:border-orange-500 focus:outline-none"
              />
              <select 
                value={jugadores[0].rol}
                onChange={(e) => setJugadores([{...jugadores[0], rol: e.target.value}, jugadores[1]])}
                className="w-full bg-neutral-950 border border-neutral-700 rounded-xl p-3 text-white focus:border-orange-500 focus:outline-none"
              >
                <option value="hombre">Hombre (Él)</option>
                <option value="mujer">Mujer (Ella)</option>
              </select>
            </div>

            <hr className="border-neutral-800" />

            {/* Jugador 2 */}
            <div className="space-y-3">
              <label className="text-neutral-400 font-bold text-sm uppercase tracking-widest">Jugador 2</label>
              <input 
                type="text" placeholder="Nombre" required
                value={jugadores[1].nombre}
                onChange={(e) => setJugadores([jugadores[0], {...jugadores[1], nombre: e.target.value}])}
                className="w-full bg-neutral-950 border border-neutral-700 rounded-xl p-3 text-white focus:border-orange-500 focus:outline-none"
              />
              <select 
                value={jugadores[1].rol}
                onChange={(e) => setJugadores([jugadores[0], {...jugadores[1], rol: e.target.value}])}
                className="w-full bg-neutral-950 border border-neutral-700 rounded-xl p-3 text-white focus:border-orange-500 focus:outline-none"
              >
                <option value="mujer">Mujer (Ella)</option>
                <option value="hombre">Hombre (Él)</option>
              </select>
            </div>

            <button type="submit" className="w-full bg-orange-600 hover:bg-orange-500 text-white font-bold py-4 rounded-xl mt-4 transition-transform active:scale-95 shadow-lg shadow-orange-900/50">
              Comenzar a jugar
            </button>
          </form>
        </div>
      </div>
    );
  }

  // --- PANTALLA PRINCIPAL DEL JUEGO ---
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-neutral-950 text-white font-sans relative overflow-hidden">
      
      <button onClick={onBackToCatalog} className="absolute top-4 left-4 z-50 bg-neutral-800 text-neutral-300 hover:text-white px-4 py-2 rounded-lg text-sm font-bold transition-colors">
        ← Catálogo
      </button>

      <div className="text-center mb-10 mt-12 md:mt-0">
        <p className="text-neutral-400 font-bold tracking-widest uppercase text-sm mb-2">
          Turno de
        </p>
        <h2 className="text-4xl font-black text-orange-500">
          {jugadorActivo.nombre}
        </h2>
      </div>

      <div className="flex flex-col md:flex-row gap-4 w-full max-w-4xl mb-12">
        <div className={`flex-1 flex flex-col items-center justify-center bg-neutral-900 border-2 rounded-3xl p-8 min-h-[160px] transition-all duration-300 ${resultadoFinal ? 'border-orange-500 shadow-lg shadow-orange-900/40 scale-105' : 'border-neutral-800'}`}>
          <span className="text-orange-500/70 font-bold uppercase tracking-widest text-xs mb-4">Acción de {jugadorActivo.nombre}</span>
          <span className={`text-2xl md:text-3xl font-black text-center ${isSpinning ? 'text-neutral-500 blur-[1px]' : 'text-white'}`}>
            {accionActual}
          </span>
        </div>
        
        <div className="flex items-center justify-center text-3xl font-black text-neutral-700">
          +
        </div>

        <div className={`flex-1 flex flex-col items-center justify-center bg-neutral-900 border-2 rounded-3xl p-8 min-h-[160px] transition-all duration-300 ${resultadoFinal ? 'border-orange-500 shadow-lg shadow-orange-900/40 scale-105' : 'border-neutral-800'}`}>
          <span className="text-orange-500/70 font-bold uppercase tracking-widest text-xs mb-4">Zona de {jugadorPasivo.nombre}</span>
          <span className={`text-2xl md:text-3xl font-black text-center ${isSpinning ? 'text-neutral-500 blur-[1px]' : 'text-white'}`}>
            {zonaActual}
          </span>
        </div>
      </div>

      {!resultadoFinal ? (
        <button 
          onClick={generarContacto}
          disabled={isSpinning}
          className={`w-full max-w-sm font-bold text-xl py-5 px-6 rounded-2xl transition-all shadow-lg text-lg ${
            isSpinning ? 'bg-neutral-800 text-neutral-500 cursor-not-allowed' : 'bg-orange-600 hover:bg-orange-500 text-white active:scale-95 shadow-orange-900/50'
          }`}
        >
          {isSpinning ? 'Calculando...' : 'Generar Contacto'}
        </button>
      ) : (
        <button 
          onClick={siguienteTurno}
          className="w-full max-w-sm bg-white text-neutral-950 hover:bg-neutral-200 font-bold text-xl py-5 px-6 rounded-2xl transition-transform active:scale-95 shadow-lg shadow-white/10"
        >
          Siguiente Turno →
        </button>
      )}

    </div>
  );
}