import React from 'react';

export default function CatalogScreen({ onSelectGame, config, onReset }) {
  // Lista de juegos disponibles
  const juegos = [
    {
      id: 'retos',
      titulo: 'Retos por Turnos',
      descripcion: 'Intensidad progresiva con temporizadores y niveles.',
      color: 'bg-rose-500',
      borde: 'border-rose-500/20'
    },
    {
      id: 'ruleta',
      titulo: 'Cartas del Destino',
      descripcion: 'Saca una carta para descubrir retos aleatorios.',
      color: 'bg-purple-500',
      borde: 'border-purple-500/20'
    },
    {
      id: 'contacto',
      titulo: 'Conecta y Toca',
      descripcion: 'Mezcla acciones y zonas del cuerpo al azar.',
      color: 'bg-orange-500',
      borde: 'border-orange-500/20'
    },
    {
      id: 'objetos',
      titulo: 'Interacción con Entorno',
      descripcion: 'Usa los objetos que tienes a la mano (Sillas, hielo, etc).',
      color: 'bg-cyan-500',
      borde: 'border-cyan-500/20'
    },
    {
      id: 'dados',
      titulo: 'Dados del Deseo',
      descripcion: 'Lanza los dados 3D para ver qué te toca hacer hoy.',
      color: 'bg-indigo-500',
      borde: 'border-indigo-500/20'
    }, {
      id: 'rol',
      titulo: 'Historias de Rol',
      descripcion: 'Entren en un escenario con personajes asignados.',
      color: 'bg-emerald-500',
      borde: 'border-emerald-500/20'
    }
  ];

  return (
    <div className="min-h-screen bg-neutral-950 p-6 md:p-12 text-white font-sans selection:bg-rose-500/30">

      {/* CABECERA DINÁMICA */}
      <header className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-8 max-w-5xl mx-auto border-b border-neutral-900 pb-10">
        <div className="space-y-2">
          <h1 className="text-6xl md:text-8xl font-black tracking-tighter italic leading-none">
            PLAY<span className="text-rose-500">ROOM</span>
          </h1>
          <div className="flex items-center gap-3">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <p className="text-neutral-500 font-bold uppercase tracking-[0.2em] text-[10px]">
              Sesión activa: <span className="text-white">{config[0].nombre}</span> & <span className="text-white">{config[1].nombre}</span>
            </p>
          </div>
        </div>

        <button
          onClick={onReset}
          className="group bg-neutral-900 border border-neutral-800 hover:border-rose-500/50 hover:bg-rose-500/5 px-8 py-4 rounded-[1.5rem] text-[10px] font-black uppercase tracking-widest transition-all active:scale-95 flex items-center gap-3"
        >
          <span className="opacity-50 group-hover:rotate-180 transition-transform duration-500">🔄</span>
          Cambiar Jugadores
        </button>
      </header>

      {/* CUADRÍCULA DE JUEGOS DISPONIBLES */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
        {juegos.map((juego) => (
          <div
            key={juego.id}
            onClick={() => onSelectGame(juego.id)}
            className={`group relative overflow-hidden rounded-[2.5rem] border ${juego.borde} bg-neutral-900/40 p-10 cursor-pointer transition-all hover:-translate-y-2 hover:bg-neutral-900 hover:border-white/20 shadow-2xl`}
          >
            <div className={`absolute top-0 left-0 h-2 w-full ${juego.color} opacity-80`}></div>
            <h3 className="text-3xl font-black mb-3 tracking-tight group-hover:scale-105 transition-transform origin-left">{juego.titulo}</h3>
            <p className="text-neutral-500 text-sm leading-relaxed mb-10 font-medium group-hover:text-neutral-300 transition-colors">{juego.descripcion}</p>
            <div className={`inline-flex items-center gap-3 font-black text-[10px] uppercase tracking-[0.2em] ${juego.color.replace('bg-', 'text-')}`}>
              <span className="bg-white/5 px-4 py-2 rounded-full">Jugar ahora</span>
              <span className="transition-transform group-hover:translate-x-3 text-lg">→</span>
            </div>
          </div>
        ))}

        {/* --- SECCIÓN DE MONETIZACIÓN B2B / BUSINESS --- */}
        <div className="col-span-1 md:col-span-2 mt-16 grid grid-cols-1 lg:grid-cols-2 gap-6 mb-20">

          {/* OPCIÓN 1: PUBLICIDAD TRADICIONAL */}
          <div className="relative overflow-hidden bg-neutral-900/40 rounded-[2.5rem] p-8 border border-neutral-800 hover:border-rose-500/30 transition-all group shadow-xl">
            <div className="flex flex-col h-full justify-between">
              <div>
                <span className="bg-rose-500/10 text-rose-400 text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-widest border border-rose-500/20 mb-4 inline-block">Espacio Publicitario</span>
                <h3 className="text-2xl font-black text-white mb-3 tracking-tighter italic">Anuncia tu Marca</h3>
                <p className="text-neutral-500 text-xs leading-relaxed mb-6">Promociona tus productos en nuestros juegos y conecta con cientos de parejas.</p>
              </div>
              <a
                href="https://wa.me/5218147980172?text=Hola,%20me%20interesa%20anunciar%20mi%20negocio%20en%20la%20plataforma%20PLAYROOM."
                target="_blank" rel="noreferrer"
                className="w-full bg-white text-black py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest text-center hover:bg-rose-500 hover:text-white transition-all active:scale-95"
              >
                Anúnciate aquí 📢
              </a>
            </div>
          </div>

          {/* OPCIÓN 2: JUEGOS PERSONALIZADOS (ALTO VALOR) */}
          <div className="relative overflow-hidden bg-gradient-to-br from-indigo-900/20 to-neutral-900 rounded-[2.5rem] p-8 border border-indigo-500/20 hover:border-indigo-500/50 transition-all group shadow-xl">
            <div className="flex flex-col h-full justify-between">
              <div>
                <span className="bg-indigo-500/10 text-indigo-400 text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-widest border border-indigo-500/20 mb-4 inline-block">Desarrollo Custom</span>
                <h3 className="text-2xl font-black text-white mb-3 tracking-tighter italic">Tu propio Juego</h3>
                <p className="text-neutral-500 text-xs leading-relaxed mb-6">Creamos un juego exclusivo con la temática, nombre y retos de tu negocio.</p>
              </div>
              <a
                href="https://wa.me/5218147980172?text=Hola,%20me%20interesa%20crear%20un%20juego%20personalizado%20para%20mi%20marca%20en%20PLAYROOM."
                target="_blank" rel="noreferrer"
                className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest text-center hover:bg-indigo-500 transition-all active:scale-95"
              >
                Crear mi Juego 🕹️
              </a>
            </div>
            {/* Adorno visual para resaltar que es premium */}
            <div className="absolute -right-5 -top-5 w-16 h-16 bg-indigo-500/10 rounded-full blur-xl group-hover:bg-indigo-500/30 transition-all"></div>
          </div>

        </div>
      </div>

      <footer className="text-center pb-12 opacity-20">
        <p className="text-[10px] font-black uppercase tracking-[0.5em]">Creative Platform &copy; 2026</p>
      </footer>
    </div>
  );
}