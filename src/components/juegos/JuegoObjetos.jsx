import { useState, useEffect, useRef } from 'react';
import dataObjetos from '../../data/objetos.json';

export default function JuegoObjetos({ config, onBackToCatalog }) {
  // --- CONFIGURACIÓN ESPECÍFICA: Solo inventario ---
  const [gameStarted, setGameStarted] = useState(false);
  const [objetosSeleccionados, setObjetosSeleccionados] = useState([]);
  
  // --- ESTADOS DEL JUEGO ---
  const [turnoIndex, setTurnoIndex] = useState(0);
  const [retoActual, setRetoActual] = useState(null);
  const [tiempoRestante, setTiempoRestante] = useState(0);
  const [timerActivo, setTimerActivo] = useState(false);

  // Usamos los nombres globales que vienen de App.jsx
  const jugadorActivo = config[turnoIndex];
  const jugadorPasivo = config[turnoIndex === 0 ? 1 : 0];

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
    osc.frequency.setValueAtTime(500, ctx.currentTime);
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
    osc.frequency.setValueAtTime(800, ctx.currentTime);
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
    const activo = config[indexTurno];
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
    setTimerActivo(false);
  };

  const manejarInicio = () => {
    if (objetosSeleccionados.length === 0) {
      alert("¡Selecciona al menos un objeto!");
      return;
    }
    setGameStarted(true);
    sacarNuevoReto(0);
  };

  useEffect(() => {
    let intervalo = null;
    if (timerActivo && tiempoRestante > 0) {
      intervalo = setInterval(() => {
        setTiempoRestante(t => {
          if (t <= 6 && t > 1) reproducirTick();
          if (t === 1) reproducirDing();
          return t - 1;
        });
      }, 1000);
    } else {
      setTimerActivo(false);
    }
    return () => clearInterval(intervalo);
  }, [timerActivo, tiempoRestante]);

  // --- 1. PANTALLA DE SELECCIÓN DE INVENTARIO ---
  if (!gameStarted) {
    return (
      <div className="min-h-screen bg-neutral-950 p-6 flex flex-col items-center justify-center text-white">
        <button onClick={onBackToCatalog} className="absolute top-4 left-4 bg-neutral-800 px-4 py-2 rounded-lg text-xs font-bold">← Catálogo</button>
        
        <div className="w-full max-w-md bg-neutral-900 p-8 rounded-[2.5rem] border border-neutral-800 shadow-2xl">
          <h2 className="text-3xl font-black text-cyan-500 mb-2 text-center">Entorno</h2>
          <p className="text-neutral-500 text-[10px] font-black uppercase tracking-widest text-center mb-8 italic">
            Sesión: {config[0].nombre} & {config[1].nombre}
          </p>

          <p className="text-xs font-bold text-neutral-400 uppercase tracking-widest mb-4 text-center">¿Qué objetos tienen a la mano?</p>
          
          <div className="grid grid-cols-2 gap-3 mb-8">
            {dataObjetos.inventario.map(obj => (
              <button 
                key={obj.id}
                type="button"
                onClick={() => toggleObjeto(obj.id)}
                className={`p-4 rounded-2xl border-2 transition-all font-bold text-xs uppercase tracking-tighter ${
                  objetosSeleccionados.includes(obj.id) 
                  ? 'border-cyan-500 bg-cyan-500/20 text-cyan-400 scale-95' 
                  : 'border-neutral-800 bg-black text-neutral-600'
                }`}
              >
                {obj.nombre}
              </button>
            ))}
          </div>

          <button 
            onClick={manejarInicio}
            className="w-full bg-cyan-600 hover:bg-cyan-500 py-4 rounded-2xl font-black text-xl shadow-lg shadow-cyan-900/40 transition-transform active:scale-95"
          >
            INICIAR RETOS
          </button>
        </div>
      </div>
    );
  }

  // --- 2. PANTALLA DE JUEGO ---
  return (
    <div className="min-h-screen bg-neutral-950 p-6 flex flex-col items-center justify-center text-white">
      <button onClick={onBackToCatalog} className="absolute top-4 left-4 text-neutral-400 font-bold">← Catálogo</button>

      <div className="text-center mb-8">
        <p className="text-cyan-500 font-black text-5xl mb-2 tracking-tighter">{jugadorActivo.nombre}</p>
        <p className="text-neutral-500 uppercase text-[10px] font-black tracking-widest leading-none">
          Debe usar un objeto con {jugadorPasivo.nombre}
        </p>
      </div>

      <div className="w-full max-w-xl bg-neutral-900 p-10 rounded-[2.5rem] border-4 border-cyan-500/10 text-center relative shadow-2xl">
        {retoActual?.tiempo > 0 && (
          <button 
            onClick={() => setTimerActivo(!timerActivo)}
            className={`absolute -top-6 left-1/2 -translate-x-1/2 px-8 py-3 rounded-full font-black border-2 transition-all shadow-xl ${
              tiempoRestante === 0 ? 'bg-emerald-500 border-emerald-300' : 'bg-cyan-600 border-cyan-400 animate-pulse'
            }`}
          >
            {tiempoRestante === 0 ? '¡TIEMPO!' : `${tiempoRestante}s`}
          </button>
        )}
        <p className="text-2xl md:text-3xl font-bold leading-relaxed">
          {retoActual?.texto.replace('[Pareja]', jugadorPasivo.nombre)}
        </p>
      </div>

      <button 
        onClick={() => {
          const next = turnoIndex === 0 ? 1 : 0;
          setTurnoIndex(next);
          sacarNuevoReto(next);
        }}
        className="mt-12 w-full max-w-md bg-white text-black py-5 rounded-2xl font-black text-xl active:scale-90 transition-transform shadow-xl shadow-white/5 uppercase"
      >
        Siguiente Reto →
      </button>
    </div>
  );
}