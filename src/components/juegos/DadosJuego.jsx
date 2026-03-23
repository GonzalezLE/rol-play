import { useState, useRef } from 'react';
import dataDados from '../../data/dados.json';

export default function DadosJuego({ config, onBackToCatalog }) {
  // --- CONFIGURACIÓN ESPECÍFICA DEL JUEGO ---
  const [gameStarted, setGameStarted] = useState(false);
  const [listaAcciones, setListaAcciones] = useState(dataDados.acciones);
  const [listaPosiciones, setListaPosiciones] = useState(dataDados.posiciones);

  // --- ESTADOS DE LA ANIMACIÓN ---
  const [girando, setGirando] = useState(false);
  const [resultado, setResultado] = useState({ accion: '', posicion: '' });
  const [rotacion1, setRotacion1] = useState({ x: 0, y: 0 });
  const [rotacion2, setRotacion2] = useState({ x: 0, y: 0 });

  const audioCtxRef = useRef(null);
  const caras = [
    { x: 0, y: 0 }, { x: 0, y: 180 }, { x: 0, y: -90 },
    { x: 0, y: 90 }, { x: -90, y: 0 }, { x: 90, y: 0 }
  ];

  const updateOption = (index, value, type) => {
    if (type === 'accion') {
      const newArr = [...listaAcciones];
      newArr[index] = value;
      setListaAcciones(newArr);
    } else {
      const newArr = [...listaPosiciones];
      newArr[index] = value;
      setListaPosiciones(newArr);
    }
  };

  const lanzarDados = () => {
    if (girando) return;
    setGirando(true);
    setResultado({ accion: '', posicion: '' });

    const index1 = Math.floor(Math.random() * 6);
    const index2 = Math.floor(Math.random() * 6);

    // Animación de 3 vueltas + cara final
    setRotacion1({ x: caras[index1].x + 1080, y: caras[index1].y + 1080 });
    setRotacion2({ x: caras[index2].x + 1080, y: caras[index2].y + 1080 });

    setTimeout(() => {
      setRotacion1(caras[index1]);
      setRotacion2(caras[index2]);
      setResultado({
        accion: listaAcciones[index1],
        posicion: listaPosiciones[index2]
      });
      setGirando(false);
    }, 1500);
  };

  // --- 1. PANTALLA DE EDICIÓN DE CARAS (DADOS) ---
  if (!gameStarted) {
    return (
      <div className="min-h-screen bg-neutral-950 p-6 flex flex-col items-center justify-start overflow-y-auto text-white font-sans">
        <button onClick={onBackToCatalog} className="self-start mb-4 bg-neutral-800 px-4 py-2 rounded-lg text-xs font-bold">← Catálogo</button>
        
        <div className="w-full max-w-2xl bg-neutral-900 p-8 rounded-[2.5rem] border border-neutral-800 shadow-2xl">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-black text-indigo-500 uppercase tracking-tighter">Personalizar Dados</h2>
            <p className="text-neutral-500 text-[10px] font-bold uppercase tracking-widest mt-2">Configura las 6 caras de cada dado</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
            {/* Columna Acciones */}
            <div className="space-y-3">
              <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest text-center">Dado 1: Acciones</p>
              {listaAcciones.map((acc, i) => (
                <input key={i} type="text" value={acc} onChange={(e) => updateOption(i, e.target.value, 'accion')} className="w-full bg-black p-3 rounded-xl border border-neutral-800 text-sm focus:border-indigo-500 outline-none transition-all" />
              ))}
            </div>
            {/* Columna Posiciones */}
            <div className="space-y-3">
              <p className="text-[10px] font-black text-rose-400 uppercase tracking-widest text-center">Dado 2: Lugares</p>
              {listaPosiciones.map((pos, i) => (
                <input key={i} type="text" value={pos} onChange={(e) => updateOption(i, e.target.value, 'posicion')} className="w-full bg-black p-3 rounded-xl border border-neutral-800 text-sm focus:border-rose-500 outline-none transition-all" />
              ))}
            </div>
          </div>

          <button onClick={() => setGameStarted(true)} className="w-full bg-indigo-600 hover:bg-indigo-500 py-5 rounded-2xl font-black text-xl shadow-xl active:scale-95 transition-all uppercase tracking-tighter">
            Confirmar y Jugar
          </button>
        </div>
      </div>
    );
  }

  // --- 2. PANTALLA DE JUEGO (Lanzamiento 3D) ---
  return (
    <div className="min-h-screen bg-neutral-950 flex flex-col items-center justify-center p-6 text-white font-sans overflow-hidden">
      <button onClick={onBackToCatalog} className="absolute top-4 left-4 text-neutral-400 font-bold">← Catálogo</button>
      
      <div className="flex gap-10 md:gap-24 mb-20 perspective-1000">
        <Dado3D rotacion={rotacion1} color="bg-indigo-600" />
        <Dado3D rotacion={rotacion2} color="bg-rose-600" />
      </div>

      <button onClick={lanzarDados} disabled={girando} className="w-full max-w-xs bg-indigo-600 py-5 rounded-2xl font-black text-2xl shadow-xl active:scale-95 transition-transform">
        {girando ? 'GIRANDO...' : 'LANZAR DADOS'}
      </button>

      {resultado.accion && (
        <div className="mt-12 text-center animate-in fade-in zoom-in duration-500">
          <p className="text-3xl md:text-5xl font-black tracking-tighter uppercase leading-none">
            <span className="text-indigo-400">{resultado.accion}</span> <br/>
            <span className="text-white text-xl font-light italic lowercase">en</span> <br/>
            <span className="text-rose-400">{resultado.posicion}</span>
          </p>
        </div>
      )}

      <style>{`.perspective-1000 { perspective: 1000px; } .preserve-3d { transform-style: preserve-3d; }`}</style>
    </div>
  );
}

function Dado3D({ rotacion, color }) {
  return (
    <div className="w-20 h-20 md:w-24 md:h-24 preserve-3d transition-transform duration-[1500ms] ease-out" style={{ transform: `rotateX(${rotacion.x}deg) rotateY(${rotacion.y}deg)` }}>
      {[...Array(6)].map((_, i) => {
        const transforms = [
          'translateZ(50px)', 'rotateY(180deg) translateZ(50px)', 'rotateY(-90deg) translateZ(50px)',
          'rotateY(90deg) translateZ(50px)', 'rotateX(90deg) translateZ(50px)', 'rotateX(-90deg) translateZ(50px)'
        ];
        return (
          <div key={i} className={`absolute w-full h-full border border-white/10 flex items-center justify-center rounded-xl font-black text-3xl shadow-inner ${color}`} style={{ transform: transforms[i], backfaceVisibility: 'hidden' }}>
            {i + 1}
          </div>
        );
      })}
    </div>
  );
}