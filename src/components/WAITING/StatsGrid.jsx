import React from 'react';
import { COLORSTATS } from '../../constants/constants';

// El componente ahora recibe las estadísticas como props
const StatsGrid = ({ stats }) => {

  const StatCard = ({ title, value, colorClass = "text-gray-300" }) => (
    <div 
      className="glass-container p-6 rounded-xl border-2 border-blue-700 animate-count" 
      style={{ backgroundColor: COLORSTATS }}
    >
      <p className="text-blue-400 mb-2">{title}</p>
      <p className={`text-2xl font-semibold ${colorClass}`}>{value}</p>
    </div>
  );

  return (
    // Cambiamos el grid para que sea 2x2 en pantallas medianas y más grandes
    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-5xl mx-auto">
      <StatCard title="PDFs Procesados" value={stats.processed} colorClass="text-green-400" />
      <StatCard title="PDFs Fallidos" value={stats.failed} colorClass="text-red-400" />
      <StatCard title="Necesitan Vision" value={stats.vision} colorClass="text-yellow-400" />
      <StatCard title="PDFs Restantes" value={stats.remaining} />
    </div>
  );
};

export default StatsGrid;