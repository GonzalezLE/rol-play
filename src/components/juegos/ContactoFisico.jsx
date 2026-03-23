import { useState } from 'react';
import dataContacto from '../../data/contacto.json';

export default function ContactoFisico({ config, onBackToCatalog }) {
  const [turnoIndex, setTurnoIndex] = useState(0);
  const [resultado, setResultado] = useState({ accion: '???', zona: '???' });
  const [girando, setGirando] = useState(false);

  const jugadorActivo = config[turnoIndex];
  const jugadorPasivo = config[turnoIndex === 0 ? 1 : 0];

  const lanzar = () => {
    setGirando(true);
    setTimeout(() => {
      const listaAcciones = dataContacto[`acciones_${jugadorActivo.rol}`];
      const listaZonas = dataContacto[`zonas_${jugadorPasivo.rol}`];
      setResultado({
        accion: listaAcciones[Math.floor(Math.random() * listaAcciones.length)],
        zona: listaZonas[Math.floor(Math.random() * listaZonas.length)]
      });
      setGirando(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-neutral-950 p-6 flex flex-col items-center justify-center text-white">
      <button onClick={onBackToCatalog} className="absolute top-4 left-4 text-neutral-400 font-bold">← Catálogo</button>
      
      <div className="text-center mb-10">
        <p className="text-orange-500 font-black text-4xl">{jugadorActivo.nombre}</p>
        <p className="text-neutral-500 text-xs font-bold uppercase tracking-widest">Le toca actuar sobre {jugadorPasivo.nombre}</p>
      </div>

      <div className="flex gap-4 mb-10 w-full max-w-2xl">
        <div className="flex-1 bg-neutral-900 p-6 rounded-3xl border border-neutral-800 text-center">
           <p className="text-[10px] text-orange-500 font-black mb-2 uppercase">Acción</p>
           <p className={`text-xl font-bold ${girando ? 'blur-sm' : ''}`}>{resultado.accion}</p>
        </div>
        <div className="flex-1 bg-neutral-900 p-6 rounded-3xl border border-neutral-800 text-center">
           <p className="text-[10px] text-orange-500 font-black mb-2 uppercase">Zona</p>
           <p className={`text-xl font-bold ${girando ? 'blur-sm' : ''}`}>{resultado.zona}</p>
        </div>
      </div>

      <button onClick={lanzar} className="w-full max-w-sm bg-orange-600 py-5 rounded-2xl font-black text-xl">
        {girando ? 'SORTEANDO...' : 'GENERAR CONTACTO'}
      </button>
      
      {!girando && resultado.accion !== '???' && (
        <button onClick={() => setTurnoIndex(turnoIndex === 0 ? 1 : 0)} className="mt-4 text-neutral-500 font-bold text-sm">Cambiar Turno →</button>
      )}
    </div>
  );
}