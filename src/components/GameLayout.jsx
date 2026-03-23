import React from 'react';
// IMPORTA TU VÍDEO AQUÍ (Ajusta la ruta según tu proyecto)
import fuegoVideo from '../assets/video/fuego_loop.mp4'; 

const heatStyles = {
  soft: {
    background: 'bg-neutral-950',
    headerBorder: 'border-neutral-900',
    boxBorder: 'border-neutral-800', 
    boxBg: 'bg-neutral-900/50',
    tagBorder: 'border-neutral-800',
    tagText: 'text-neutral-500',
    btnBg: 'bg-neutral-800',
    btnText: 'text-neutral-600'
  },
  medium: {
    background: 'bg-orange-950/10',
    headerBorder: 'border-orange-900/50',
    boxBorder: 'border-orange-500/40 shadow-[0_0_30px_rgba(249,115,22,0.2)]', 
    boxBg: 'bg-neutral-900/80',
    tagBorder: 'border-orange-500/60',
    tagText: 'text-orange-400',
    btnBg: 'bg-orange-600',
    btnText: 'text-white'
  },
  hard: {
    background: 'bg-red-950/30',
    headerBorder: 'border-red-900/50',
    boxBorder: 'border-red-600 shadow-[0_0_70px_rgba(220,38,38,0.6)]', 
    boxBg: 'bg-black/80',
    tagBorder: 'border-red-500',
    tagText: 'text-red-100',
    btnBg: 'bg-red-700 animate-pulse',
    btnText: 'text-white'
  }
};

export default function GameLayout({ nivel, gameTitle, children, onBackToCatalog }) {
  const heat = heatStyles[nivel] || heatStyles.soft;
  const isHard = nivel === 'hard';

  return (
    <div className={`min-h-screen ${heat.background} transition-all duration-1000 flex flex-col items-center justify-start p-6 text-white font-sans overflow-hidden relative`}>
      
      {/* BARRA SUPERIOR (Indicador unificado) */}
      <header className={`w-full max-w-5xl mx-auto flex items-center justify-between mb-12 border-b pb-6 transition-colors duration-700 ${heat.headerBorder}`}>
        <button onClick={onBackToCatalog} className="flex items-center gap-2.5 text-neutral-500 hover:text-white transition-colors text-xs font-black uppercase tracking-[0.2em]">
          <span className="text-xl leading-none">←</span> {gameTitle}
        </button>
        
        <div className={`flex items-center gap-2.5 border px-5 py-3 rounded-full font-black text-[9px] uppercase tracking-[0.3em] transition-all duration-700 ${heat.tagBorder} ${heat.tagText}`}>
            <span className={`relative flex h-2.5 w-2.5 rounded-full ${nivel === 'soft' ? 'bg-neutral-800' : nivel === 'medium' ? 'bg-orange-500 animate-pulse' : 'bg-red-500 animate-ping'}`}></span>
            Nivel: <span className="text-white">{nivel === 'soft' ? 'Bajo' : nivel === 'medium' ? 'Medio' : 'ALTO 🔥'}</span>
        </div>
      </header>

      {/* EL CUADRO PRINCIPAL (HEAT-BOX) */}
      <main className={`relative w-full max-w-2xl backdrop-blur-md p-14 md:p-16 rounded-[4rem] transition-all duration-1000 ${heat.boxBorder} ${heat.boxBg} ${heat.boxShadow} overflow-hidden group`}>
        
        {/* === EFECTO DE FUEGO LITERAL (VÍDEO CON MÁSCARA CSS) === */}
        {isHard && (
          <div className="absolute inset-0 z-0 pointer-events-none rounded-[4rem] overflow-hidden">
            {/* El vídeo en bucle */}
            <video 
              autoPlay 
              loop 
              muted 
              playsInline 
              className="absolute inset-0 w-full h-full object-cover scale-110 opacity-60 mix-blend-screen transition-opacity duration-1000"
            >
              <source src={fuegoVideo} type="video/mp4" />
            </video>
            
            {/* Overlay degrade para que el fuego no tape el texto */}
            <div className="absolute inset-0 bg-gradient-to-t from-red-950 via-black/30 to-black/10 z-10 rounded-[4rem]"></div>
            
            {/* Adorno de chispas flotantes (Partículas CSS) */}
            <div className="absolute inset-0 z-20 animate-emberFlow opacity-40"></div>
          </div>
        )}

        {/* El contenido específico de cada juego va aquí */}
        <div className={`relative z-20 ${isHard ? 'animate-thermalVibration' : ''}`}>
          {children}
        </div>
      </main>

      {/* FOOTER DE JUEGO (Turno actual) */}
      <footer className="mt-8 text-neutral-800 font-bold uppercase tracking-[0.4em] text-[10px]">Turno 1-5 / Suave</footer>

      {/* Definimos las animaciones CSS necesarias directamente aquí */}
      <style>{`
        /* 1. Animación de Chispas Flotantes (Ascuas) */
        @keyframes emberFlow {
          0% { background-position: 0% 100%; }
          100% { background-position: 100% 0%; }
        }
        .animate-emberFlow {
          background-image: radial-gradient(circle, #ff5e00 1px, transparent 1px);
          background-size: 30px 30px;
          animation: emberFlow 60s infinite linear;
          filter: blur(0.5px);
        }

        /* 2. Vibración Térmica (Sutil, solo texto) */
        @keyframes thermalVibration {
          0% { transform: translate(0, 0); }
          50% { transform: translate(0.3px, -0.3px); }
          100% { transform: translate(0, 0); }
        }
        .animate-thermalVibration { animation: thermalVibration 0.3s infinite ease-in-out; }
      `}</style>
    </div>
  );
}