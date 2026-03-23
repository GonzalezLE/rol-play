import { useState, useEffect, useRef } from 'react';
import dataObjetos from '../../data/objetos.json';

export default function JuegoObjetos({ onBackToCatalog }) {
  const [gameStarted, setGameStarted] = useState(false);
  const [jugadores, setJugadores] = useState([
    { nombre: '', rol: 'hombre' },
    { nombre: '', rol: 'mujer' }
  ]);
  const [objetosSeleccionados, setObjetosSeleccionados] = useState([]);
  
  const [turnoIndex, setTurnoIndex] = useState(0);
  const [retoActual, setRetoActual] = useState(null);
  const [tiempoRestante, setTiempoRestante] = useState(0);
  const [timerActivo, setTimerActivo] = useState(false);

  const audioCtxRef = useRef(null);

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
    osc.frequency.value = 500;
    gain.gain.setValueAtTime(0.2, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.1);
  };

  const reproducirDing = () => {
    const ctx = getAudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.frequency.value = 800;
    gain.gain.setValueAtTime(0.8, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.5);
  };

  const toggleObjeto = (id) => {
    setObjetosSeleccionados(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const sacarNuevoReto = (indexTurno) => {
    const activo = jugadores[indexTurno];
    const retosPosibles = dataObjetos.retos.filter(r => 
      r.rolActivo === activo.rol && objetosSeleccionados.includes(r.objetoReq)
    );

    if (retosPosibles.length === 0) {
      setRetoActual({ texto: "No hay más retos con esos objetos.", tiempo: 0 });
      return;
    }

    const random = retosPosibles[Math.floor(Math.random() * retosPosibles.length)];
    setRetoActual(random);
    setTiempoRestante(random.tiempo || 0);
    setTimerActivo(false); // Siempre inicia pausado
  };

  const manejarInicio = (e) => {
    e.preventDefault();
    if (objetosSeleccionados.length === 0) return;
    setGameStarted(true);
    sacarNuevoReto(0);
  };

  useEffect(() => {
    let intervalo = null;
    if (timerActivo && tiempoRestante > 0) {
      intervalo = setInterval(() => {
        setTiempoRestante(t => {
          const nuevo = t - 1;
          if (nuevo > 0 && nuevo <= 5) reproducirTick();
          if (nuevo === 0) reproducirDing();
          return nuevo;
        });
      }, 1000);
    } else {
      setTimerActivo(false);
    }
    return () => clearInterval(intervalo);
  }, [timerActivo, tiempoRestante]);

  if (!gameStarted) {
    return (
      <div className="min-h-screen bg-neutral-950 p-6 flex flex-col items-center justify-center text-white font-sans">
        <button onClick={onBackToCatalog} className="absolute top-4 left-4 text-neutral-400 font-bold">← Volver</button>
        <div className="w-full max-w-md bg-neutral-900 p-8 rounded-3xl border border-neutral-800 shadow-2xl">
          <h2 className="text-3xl font-black text-cyan-500 mb-6 text-center">Inventario</h2>
          <form onSubmit={manejarInicio} className="space-y-6">
            <div className="grid grid-cols-2 gap-3 mb-6">
               <input type="text" placeholder="Él" required className="bg-neutral-950 p-3 rounded-xl border border-neutral-800" value={jugadores[0].nombre} onChange={e => setJugadores([{...jugadores[0], nombre: e.target.value}, jugadores[1]])} />
               <input type="text" placeholder="Ella" required className="bg-neutral-950 p-3 rounded-xl border border-neutral-800" value={jugadores[1].nombre} onChange={e => setJugadores([jugadores[0], {...jugadores[1], nombre: e.target.value}])} />
            </div>
            <div className="grid grid-cols-2 gap-2">
              {dataObjetos.inventario.map(obj => (
                <div key={obj.id} onClick={() => toggleObjeto(obj.id)} className={`p-3 rounded-xl border-2 transition-all cursor-pointer text-center font-bold text-sm ${objetosSeleccionados.includes(obj.id) ? 'border-cyan-500 bg-cyan-500/10 text-cyan-400' : 'border-neutral-800 bg-neutral-950 text-neutral-600'}`}>{obj.nombre}</div>
              ))}
            </div>
            <button type="submit" className="w-full bg-cyan-600 py-4 rounded-2xl font-black text-xl mt-4">EMPEZAR JUEGO</button>
          </form>
        </div>
      </div>
    );
  }

  const jugadorActivo = jugadores[turnoIndex];
  const jugadorPasivo = jugadores[turnoIndex === 0 ? 1 : 0];

  return (
    <div className="min-h-screen bg-neutral-950 p-6 flex flex-col items-center justify-center text-white">
      <div className="text-center mb-12">
        <p className="text-neutral-500 uppercase tracking-widest font-bold text-xs mb-2">Es el turno de</p>
        <p className="text-cyan-500 font-black text-5xl">{jugadorActivo.nombre}</p>
      </div>

      <div className="w-full max-w-xl bg-neutral-900 p-10 rounded-[2.5rem] border-4 border-cyan-500/10 text-center relative shadow-2xl">
        {/* TIMER INTERACTIVO IGUAL AL DE LOS OTROS JUEGOS */}
        {retoActual?.tiempo > 0 && (
          <button 
            onClick={() => {
              if (!timerActivo && tiempoRestante <= 5 && tiempoRestante > 0) reproducirTick();
              setTimerActivo(!timerActivo);
            }}
            disabled={tiempoRestante === 0}
            className={`absolute -top-6 left-1/2 -translate-x-1/2 px-8 py-3 rounded-full font-black border-2 transition-all shadow-xl ${
              tiempoRestante === 0 
                ? 'bg-emerald-500 border-emerald-400 text-white cursor-default' 
                : timerActivo 
                  ? tiempoRestante <= 5 
                    ? 'bg-red-600 border-red-400 text-white animate-bounce' 
                    : 'bg-amber-500 border-amber-400 text-white animate-pulse' 
                  : 'bg-cyan-600 border-cyan-400 text-white hover:scale-105'
            }`}
          >
            {tiempoRestante === 0 ? '✅ ¡TIEMPO!' : timerActivo ? `⏳ ${tiempoRestante}s` : `▶️ INICIAR (${tiempoRestante}s)`}
          </button>
        )}
        
        <p className="text-2xl md:text-3xl font-bold leading-relaxed mt-4">
          {retoActual?.texto.replace('[Pareja]', jugadorPasivo.nombre)}
        </p>
      </div>

      <button 
        onClick={() => {
          const next = turnoIndex === 0 ? 1 : 0;
          setTurnoIndex(next);
          sacarNuevoReto(next);
        }}
        className="mt-16 w-full max-w-md bg-white text-black py-5 rounded-2xl font-black text-xl shadow-xl active:scale-95 transition-transform uppercase"
      >
        Siguiente Reto →
      </button>
    </div>
  );
}