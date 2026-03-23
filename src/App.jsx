import { useState, useEffect } from 'react';
import CatalogScreen from './components/CatalogScreen';
import RetosPareja from './components/juegos/RetosPareja';
import RuletaJuego from './components/juegos/RuletaJuego';
import ContactoFisico from './components/juegos/ContactoFisico';
import JuegoObjetos from './components/juegos/JuegoObjetos';
import DadosJuego from './components/juegos/DadosJuego';
import RolPlay from './components/juegos/RolPlay';

function App() {
  const [juegoActivo, setJuegoActivo] = useState(null);
  const [config, setConfig] = useState(null);
  
  // --- MOTOR DE INTENSIDAD GLOBAL ---
  const [totalTurnos, setTotalTurnos] = useState(0);

  // 1. CARGAR CONFIGURACIÓN AL INICIAR
  useEffect(() => {
    const savedConfig = localStorage.getItem('app_juego_config');
    if (savedConfig) {
      setConfig(JSON.parse(savedConfig));
    }
  }, []);

  const guardarConfig = (datos) => {
    setConfig(datos);
    localStorage.setItem('app_juego_config', JSON.stringify(datos));
  };

  const resetApp = () => {
    localStorage.removeItem('app_juego_config');
    setConfig(null);
    setJuegoActivo(null);
    setTotalTurnos(0);
  };

  // --- LÓGICA DE PROGRESIÓN ---
  const avanzarTurno = () => setTotalTurnos(prev => prev + 1);

  const forzarCalor = () => {
    if (totalTurnos <= 5) setTotalTurnos(6); // Brinca a Medium
    else if (totalTurnos <= 12) setTotalTurnos(13); // Brinca a Hard
  };

  const getNivelActual = () => {
    if (totalTurnos <= 5) return 'soft';
    if (totalTurnos <= 12) return 'medium';
    return 'hard';
  };

  const nivelActual = getNivelActual();

  // --- RENDERIZADO DE JUEGOS ---
  const renderJuegoActivo = () => {
    const propsComunes = {
      config,
      nivel: nivelActual,
      onTurno: avanzarTurno,
      onBackToCatalog: () => setJuegoActivo(null)
    };

    switch (juegoActivo) {
      case 'retos': return <RetosPareja {...propsComunes} />;
      case 'ruleta': return <RuletaJuego {...propsComunes} />;
      case 'contacto': return <ContactoFisico {...propsComunes} />;
      case 'objetos': return <JuegoObjetos {...propsComunes} />;
      case 'dados': return <DadosJuego {...propsComunes} />;
      case 'rol': return <RolPlay {...propsComunes} />;
      default: return null;
    }
  };

  if (!config) {
    return <ConfigInicial onConfirm={guardarConfig} />;
  }

  return (
    <div className={`min-h-screen transition-all duration-1000 ease-in-out ${
      nivelActual === 'soft' ? 'bg-neutral-950' : 
      nivelActual === 'medium' ? 'bg-orange-950/20' : 
      'bg-red-950/40 shadow-[inset_0_0_100px_rgba(220,38,38,0.2)]'
    }`}>
      
      {/* BOTÓN DE ACELERACIÓN (FUEGO) - Solo dentro de un juego y si no es Hard aún */}
      {juegoActivo && nivelActual !== 'hard' && (
        <button 
          onClick={forzarCalor}
          title="Aumentar intensidad"
          className="fixed bottom-6 right-6 z-50 bg-orange-600 hover:bg-red-600 text-white w-14 h-14 rounded-full shadow-2xl flex items-center justify-center text-2xl animate-bounce transition-colors border-2 border-white/20"
        >
          🔥
        </button>
      )}

      {/* OVERLAY DE VAPOR/HUMO PARA NIVEL HARD */}
      {nivelActual === 'hard' && (
        <div className="fixed inset-0 pointer-events-none bg-gradient-to-t from-red-600/5 to-transparent z-0 animate-pulse"></div>
      )}

      <main className="relative z-10">
        {juegoActivo === null ? (
          <CatalogScreen 
            onSelectGame={(id) => setJuegoActivo(id)} 
            config={config}
            onReset={resetApp}
            nivel={nivelActual}
          />
        ) : (
          renderJuegoActivo()
        )}
      </main>
    </div>
  );
}

// --- COMPONENTE DE CONFIGURACIÓN INICIAL (MEJORADO) ---
function ConfigInicial({ onConfirm }) {
  const [p1, setP1] = useState({ nombre: '', rol: 'hombre' });
  const [p2, setP2] = useState({ nombre: '', rol: 'mujer' });

  return (
    <div className="min-h-screen bg-neutral-950 flex items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-rose-500/10 blur-[120px] rounded-full"></div>
      <div className="bg-neutral-900/80 backdrop-blur-xl p-10 md:p-14 rounded-[3rem] border border-white/10 w-full max-w-lg shadow-2xl relative z-10">
        <div className="text-center mb-12">
          <h1 className="text-6xl md:text-7xl font-black text-white mb-2 tracking-tighter italic">PLAY<span className="text-rose-500">ROOM</span></h1>
          <p className="text-neutral-500 text-[10px] font-black uppercase tracking-[0.4em]">The Ultimate Couple Experience</p>
        </div>
        <div className="space-y-10 mb-12">
          <InputJugador label="Jugador Uno" color="text-rose-500" data={p1} setData={setP1} defaultRol="hombre" />
          <InputJugador label="Jugador Dos" color="text-indigo-400" data={p2} setData={setP2} defaultRol="mujer" />
        </div>
        <button 
          onClick={() => p1.nombre && p2.nombre && onConfirm([p1, p2])}
          className="group w-full bg-white hover:bg-rose-500 text-black hover:text-white py-6 rounded-[2rem] font-black text-xl shadow-2xl transition-all active:scale-95 flex items-center justify-center gap-4"
        >
          COMENZAR AVENTURA <span className="group-hover:translate-x-3 transition-transform">→</span>
        </button>
      </div>
    </div>
  );
}

function InputJugador({ label, color, data, setData, defaultRol }) {
  return (
    <div className="relative">
      <label className={`absolute -top-3 left-6 bg-neutral-900 px-2 text-[9px] font-black uppercase tracking-widest ${color}`}>{label}</label>
      <div className="flex gap-3">
        <input 
          placeholder="Nombre..." 
          className="flex-1 bg-black/40 p-5 rounded-2xl border border-neutral-800 text-white focus:border-rose-500 outline-none transition-all font-bold" 
          onChange={e => setData({...data, nombre: e.target.value})} 
        />
        <select 
          defaultValue={defaultRol}
          className="bg-black/40 p-5 rounded-2xl border border-neutral-800 text-white outline-none cursor-pointer font-black text-xs uppercase" 
          onChange={e => setData({...data, rol: e.target.value})}
        >
          <option value="hombre">Él</option><option value="mujer">Ella</option>
        </select>
      </div>
    </div>
  );
}

export default App;