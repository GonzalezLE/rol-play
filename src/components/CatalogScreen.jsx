export default function CatalogScreen({ onSelectGame }) {
  const juegos = [
    {
      id: 'retos',
      titulo: 'Retos por Turnos',
      descripcion: 'Intensidad progresiva con temporizadores.',
      estado: 'disponible',
      color: 'bg-rose-500'
    },
    {
      id: 'ruleta',
      titulo: 'Cartas del Destino',
      descripcion: 'Saca una carta para descubrir tu suerte.',
      estado: 'disponible',
      color: 'bg-purple-500'
    },
    {
      id: 'contacto',
      titulo: 'Conecta y Toca',
      descripcion: 'Acción + Zona del cuerpo al azar.',
      estado: 'disponible',
      color: 'bg-orange-500'
    },
    {
      id: 'objetos',
      titulo: 'Interacción con Entorno',
      descripcion: 'Usa los objetos que tienes a la mano (Sillas, hielo, etc).',
      estado: 'disponible',
      color: 'bg-cyan-500' // <--- ESTE ES EL QUE TIENE EL INVENTARIO
    },{
      id: 'dados',
      titulo: 'Dados del Deseo',
      descripcion: 'Acción + Lugar en 3D.',
      estado: 'disponible',
      color: 'bg-indigo-500'
    }
  ];

  return (
    <div className="min-h-screen bg-neutral-950 p-6 md:p-12 text-white font-sans">
      <header className="mb-12 text-center md:text-left">
        <h1 className="text-4xl md:text-5xl font-black mb-4">
          Noches de <span className="text-rose-500">Juego</span>
        </h1>
        <p className="text-neutral-400 text-lg">Selecciona una experiencia para comenzar.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 max-w-4xl">
        {juegos.map((juego) => (
          <div 
            key={juego.id}
            className="relative overflow-hidden rounded-2xl border border-neutral-700 hover:border-white bg-neutral-900 cursor-pointer transition-all hover:-translate-y-1 p-6"
            onClick={() => onSelectGame(juego.id)}
          >
            <div className={`absolute top-0 left-0 h-1 w-full ${juego.color}`}></div>
            <h3 className="text-2xl font-bold mb-2">{juego.titulo}</h3>
            <p className="text-neutral-400 text-sm mb-6">{juego.descripcion}</p>
            <div className={`font-bold text-sm flex items-center gap-2 ${juego.color.replace('bg-', 'text-')}`}>
              Jugar ahora →
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}