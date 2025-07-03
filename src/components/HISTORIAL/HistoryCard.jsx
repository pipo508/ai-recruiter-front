// src/components/HISTORIAL/HistoryCard.jsx
import { Clock, Search, ChevronRight, Trash2, Loader2 } from 'lucide-react';

const HistoryCard = ({ item, index, onClick, onDelete, isDeleting }) => {
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

  const handleDeleteClick = (e) => {
    e.stopPropagation(); // Prevenir que se ejecute el onClick del card
    if (onDelete) {
      onDelete();
    }
  };

  const handleCardClick = () => {
    if (!isDeleting && onClick) {
      onClick();
    }
  };

  return (
    <div
      onClick={handleCardClick}
      className={`
        group relative bg-gradient-to-r from-gray-900/80 to-gray-800/60 backdrop-blur-xl 
        border border-gray-700/50 rounded-2xl p-6 transition-all duration-500 
        hover:border-blue-500/50 hover:shadow-2xl hover:shadow-blue-500/10 hover:scale-[1.02] 
        animate-fadeInUp
        ${isDeleting ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'}
      `}
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
        
        <div className="flex items-center gap-2 ml-4">
          {/* Botón de eliminar */}
          {onDelete && (
            <button
              onClick={handleDeleteClick}
              disabled={isDeleting}
              className={`
                p-2 rounded-full transition-all duration-300 
                ${isDeleting 
                  ? 'bg-gray-700/50 cursor-not-allowed' 
                  : 'bg-red-500/20 hover:bg-red-500/30 text-red-400 hover:text-red-300 hover:scale-110'
                }
                opacity-0 group-hover:opacity-100 focus:opacity-100
              `}
              title={isDeleting ? 'Eliminando...' : 'Eliminar resultado'}
            >
              {isDeleting ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Trash2 className="w-4 h-4" />
              )}
            </button>
          )}
          
          {/* Flecha de navegación */}
          <div className="p-2 rounded-full bg-gray-700/50 group-hover:bg-blue-500/20 transition-all duration-300 group-hover:scale-110">
            <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-blue-400 transition-colors duration-300" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default HistoryCard;