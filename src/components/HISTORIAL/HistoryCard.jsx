import React from 'react';
import { Clock, Search, ChevronRight } from 'lucide-react';

const HistoryCard = ({ item, index, onClick }) => {
  const formatDate = (isoString) => {
    const date = new Date(isoString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
    const diffMinutes = Math.floor(diffTime / (1000 * 60));

    if (diffMinutes < 60) {
      return `Hace ${diffMinutes} minutos`;
    } else if (diffHours < 24) {
      return `Hace ${diffHours} horas`;
    } else if (diffDays < 7) {
      return `Hace ${diffDays} días`;
    } else {
      return date.toLocaleDateString('es-AR', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      });
    }
  };

  const getResultsCount = () => {
    try {
      const results = typeof item.result_json === 'string' 
        ? JSON.parse(item.result_json) 
        : item.result_json;
      return results?.length || 0;
    } catch {
      return 0;
    }
  };

  return (
    <div
      onClick={onClick}
      className="group relative bg-gradient-to-r from-gray-900/80 to-gray-800/60 backdrop-blur-xl border border-gray-700/50 rounded-2xl p-6 cursor-pointer transition-all duration-500 hover:border-blue-500/50 hover:shadow-2xl hover:shadow-blue-500/10 hover:scale-[1.02] animate-fadeInUp"
      style={{ animationDelay: `${index * 100}ms` }}
    >
      {/* Gradiente de fondo sutil */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 to-purple-600/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      <div className="relative flex items-center justify-between">
        <div className="flex-grow">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-blue-500/20 rounded-lg group-hover:bg-blue-500/30 transition-colors duration-300">
              <Search className="w-4 h-4 text-blue-400" />
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <Clock className="w-4 h-4" />
              <span>{formatDate(item.created_at)}</span>
            </div>
          </div>
          
          <h3 className="text-xl font-semibold text-white mb-2 line-clamp-2 group-hover:text-blue-300 transition-colors duration-300">
            "{item.query}"
          </h3>
          
          <div className="flex items-center gap-4 text-sm text-gray-400">
            <span className="flex items-center gap-1">
              <div className="w-2 h-2 bg-green-500 rounded-full" />
              {getResultsCount()} resultados
            </span>
          </div>
        </div>
        
        <div className="ml-4 p-2 rounded-full bg-gray-700/50 group-hover:bg-blue-500/20 transition-all duration-300 group-hover:scale-110">
          <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-blue-400 transition-colors duration-300" />
        </div>
      </div>
    </div>
  );
};

export default HistoryCard;