import { useState } from 'react';
import dataRuleta from '../../data/ruleta.json';

export default function RuletaJuego({ config, onBackToCatalog }) {
  const [cartas, setCartas] = useState(dataRuleta);
  const [seleccionada, setSeleccionada] = useState(null);
  const [saltando, setSaltando] = useState(false);

  const girar = () => {
    setSaltando(true);
    let iteraciones = 0;
    const intervalo = setInterval(() => {
      setSeleccionada(cartas[Math.floor(Math.random() * cartas.length)]);
      iteraciones++;
      if (iteraciones > 20) {
        clearInterval(intervalo);
        setSaltando(false);
      }
    }, 100);
  };

  return (
    <div className="min-h-screen bg-neutral-950 p-6 flex flex-col items-center justify-center text-white">
      <button onClick={onBackToCatalog} className="absolute top-4 left-4 text-neutral-400 font-bold">← Catálogo</button>
      
      <h2 className="text-3xl font-black mb-12 text-purple-500 uppercase italic">Ruleta del Destino</h2>

      <div className={`w-64 h-80 rounded-[2rem] border-4 flex items-center justify-center p-6 text-center transition-all duration-300 ${
        saltando ? 'scale-95 blur-[1px] border-neutral-800' : 'scale-100 border-purple-500 shadow-2xl shadow-purple-900/20'
      }`}>
        <p className="text-xl font-bold">{seleccionada ? seleccionada.texto : "Haz clic para girar"}</p>
      </div>

      <button 
        onClick={girar} 
        disabled={saltando}
        className="mt-12 w-full max-w-xs bg-purple-600 py-5 rounded-2xl font-black text-xl shadow-lg active:scale-95 transition-all"
      >
        {saltando ? 'GIRANDO...' : '¡GIRAR!'}
      </button>
    </div>
  );
}