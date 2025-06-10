import React from 'react';
import { Search, Loader2, Zap } from 'lucide-react';

const SearchButton = ({ onClick, isLoading, disabled }) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`group relative px-8 py-4 rounded-2xl font-semibold text-lg flex items-center justify-center gap-3 w-full md:w-auto mx-auto min-w-[200px] transition-all duration-300 ${
        disabled
          ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
          : 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/25 active:scale-95'
      }`}
    >
      {/* Fondo brillante en hover */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-500 rounded-2xl opacity-0 group-hover:opacity-20 transition-opacity duration-300" />
      
      <div className="relative flex items-center gap-3">
        {isLoading ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            Buscando...
          </>
        ) : (
          <>
            <Zap className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" />
            Buscar Talento
            <Search className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
          </>
        )}
      </div>
      
      {/* Partículas en hover */}
      <div className="absolute inset-0 rounded-2xl overflow-hidden">
        <div className="absolute -top-2 -left-2 w-4 h-4 bg-white/20 rounded-full opacity-0 group-hover:opacity-100 group-hover:animate-ping" />
        <div className="absolute -bottom-2 -right-2 w-3 h-3 bg-blue-300/30 rounded-full opacity-0 group-hover:opacity-100 group-hover:animate-ping" style={{ animationDelay: '0.5s' }} />
      </div>
    </button>
  );
};

export default SearchButton;