import { useState } from 'react';
import CatalogScreen from './components/CatalogScreen';
import RetosPareja from './components/juegos/RetosPareja';
import RuletaJuego from './components/juegos/RuletaJuego'; // <-- Agrega este import
import ContactoFisico from './components/juegos/ContactoFisico';
import JuegoObjetos from './components/juegos/JuegoObjetos';
import DadosJuego from "./components/juegos/DadosJuego";

function App() {
  const [juegoActivo, setJuegoActivo] = useState(null);

  return (
    <div className="min-h-screen bg-neutral-950 text-white font-sans selection:bg-rose-500/30">
      
      {juegoActivo === null && <CatalogScreen onSelectGame={(id) => setJuegoActivo(id)} />}
      
      {juegoActivo === 'retos' && <RetosPareja onBackToCatalog={() => setJuegoActivo(null)} />}
      
      {/* <-- Descomentamos la línea de la ruleta */}
      {juegoActivo === 'ruleta' && <RuletaJuego onBackToCatalog={() => setJuegoActivo(null)} />}
      
      {juegoActivo === 'contacto' && <ContactoFisico onBackToCatalog={() => setJuegoActivo(null)} />}

      {juegoActivo === 'objetos' && <JuegoObjetos onBackToCatalog={() => setJuegoActivo(null)} />}
        {juegoActivo === 'dados' && <DadosJuego onBackToCatalog={() => setJuegoActivo(null)} />}
    </div>
  );
}

export default App;