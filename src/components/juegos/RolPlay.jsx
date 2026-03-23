import { useState } from 'react';
import dataHistorias from '../../data/historias.json';

export default function RolPlay({ config, onBackToCatalog }) {
  const [tramaSeleccionada, setTramaSeleccionada] = useState(null);
  const [paso, setPaso] = useState(1); // 1: Intro, 2: Roles, 3: Acción

  const seleccionarHistoria = (trama) => {
    setTramaSeleccionada(trama);
    setPaso(1);
  };

  const volverALista = () => {
    setTramaSeleccionada(null);
    setPaso(1);
  };

  // --- 1. VISTA DE CATÁLOGO DE HISTORIAS ---
  if (!tramaSeleccionada) {
    return (
      <div className="min-h-screen bg-neutral-950 p-6 flex flex-col items-center justify-start text-white font-sans overflow-y-auto">
        <button onClick={onBackToCatalog} className="self-start mb-8 bg-neutral-800 px-4 py-2 rounded-lg text-xs font-bold">← Catálogo Principal</button>
        
        <div className="text-center mb-12">
          <h2 className="text-5xl font-black text-emerald-500 mb-2 tracking-tighter italic italic">LIBRERÍA DE ROLES</h2>
          <p className="text-neutral-500 text-[10px] font-black uppercase tracking-[0.3em]">Seleccionen su próxima aventura</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-4xl">
          {dataHistorias.tramas.map((trama) => (
            <div 
              key={trama.id}
              onClick={() => seleccionarHistoria(trama)}
              className="bg-neutral-900/50 border border-neutral-800 p-6 rounded-[2rem] hover:border-emerald-500/50 hover:bg-neutral-900 transition-all cursor-pointer group"
            >
              <h4 className="text-xl font-black mb-2 group-hover:text-emerald-400 transition-colors">{trama.titulo}</h4>
              <p className="text-neutral-500 text-xs leading-relaxed line-clamp-2 italic">"{trama.escenario}"</p>
              <div className="mt-4 flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-emerald-600">
                <span>Seleccionar Guion</span>
                <span>→</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // --- 2. VISTA DEL JUEGO EN CURSO ---
  return (
    <div className="min-h-screen bg-neutral-950 p-6 flex flex-col items-center justify-center text-white font-sans">
      <button onClick={volverALista} className="absolute top-4 left-4 text-neutral-400 font-bold bg-neutral-900 px-4 py-2 rounded-xl text-xs">← Cambiar Historia</button>

      <div className="w-full max-w-2xl bg-neutral-900/80 backdrop-blur-xl p-10 rounded-[3rem] border border-emerald-500/20 shadow-2xl relative">
        
        {/* INDICADOR DE PASOS */}
        <div className="flex justify-center gap-2 mb-8">
            {[1, 2, 3].map(i => (
                <div key={i} className={`h-1 rounded-full transition-all duration-500 ${paso >= i ? 'w-8 bg-emerald-500' : 'w-4 bg-neutral-800'}`}></div>
            ))}
        </div>

        <div className="text-center mb-10 pb-6 border-b border-white/5">
          <span className="text-emerald-500 text-[9px] font-black uppercase tracking-[0.3em]">Acto {paso}</span>
          <h3 className="text-4xl font-black italic tracking-tighter mt-2">{tramaSeleccionada.titulo}</h3>
        </div>

        <div className="min-h-[200px] flex items-center justify-center">
          {paso === 1 && (
            <div className="text-center space-y-6 animate-in fade-in zoom-in duration-500">
              <p className="text-neutral-500 uppercase text-[10px] font-black tracking-widest leading-none">El Escenario</p>
              <p className="text-2xl font-light italic leading-relaxed text-neutral-200">"{tramaSeleccionada.escenario}"</p>
              <button onClick={() => setPaso(2)} className="mt-8 bg-emerald-600 hover:bg-emerald-500 px-12 py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all active:scale-95 shadow-lg shadow-emerald-900/20">Asignar Roles</button>
            </div>
          )}

          {paso === 2 && (
            <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in slide-in-from-right-8 duration-500">
              {config.map((jugador, i) => (
                <div key={i} className={`p-8 rounded-[2rem] border-2 transition-all ${jugador.rol === 'hombre' ? 'border-rose-500/20 bg-rose-500/5' : 'border-indigo-500/20 bg-indigo-500/5'}`}>
                  <p className={`font-black text-[10px] uppercase tracking-widest mb-3 ${jugador.rol === 'hombre' ? 'text-rose-500' : 'text-indigo-400'}`}>{jugador.nombre}</p>
                  <p className="text-lg font-bold leading-tight text-white italic">
                    {tramaSeleccionada[`rol_${jugador.rol}`]}
                  </p>
                </div>
              ))}
              <div className="col-span-full flex justify-center pt-6">
                <button onClick={() => setPaso(3)} className="bg-emerald-600 hover:bg-emerald-500 px-12 py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all">Empezar Actuación</button>
              </div>
            </div>
          )}

          {paso === 3 && (
            <div className="text-center space-y-8 animate-in fade-in zoom-in duration-500">
              <div className="space-y-2">
                <p className="text-neutral-500 uppercase text-[10px] font-black tracking-widest italic tracking-widest">Objetivo Final</p>
                <p className="text-3xl font-black leading-tight text-emerald-400 tracking-tighter uppercase underline decoration-white/10">{tramaSeleccionada.objetivo}</p>
              </div>
              <p className="text-neutral-500 text-xs italic">Mantengan el personaje hasta que la escena termine de forma natural.</p>
              <button onClick={volverALista} className="mt-8 bg-white text-black px-12 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-emerald-500 hover:text-white transition-all">Terminar Escena</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}