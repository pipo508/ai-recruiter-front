import React, { forwardRef } from 'react';
import { Search } from 'lucide-react';

const SearchBox = forwardRef(({ value, onChange, onKeyPress, placeholder, error }, ref) => {
  return (
    <div className="relative group">
      {/* Ícono de búsqueda */}
      <div className="absolute top-4 left-4 z-10">
        <Search className={`w-6 h-6 transition-colors duration-300 ${
          error ? 'text-red-400' : 'text-gray-400 group-focus-within:text-blue-400'
        }`} />
      </div>
      

      
      <textarea
        ref={ref}
        value={value}
        onChange={onChange}
        onKeyDown={onKeyPress}
        className={`w-full h-36 pl-14 pr-6 pt-4 pb-4 bg-gray-800/60 backdrop-blur-sm border-2 rounded-2xl text-white text-lg placeholder-gray-400 focus:outline-none resize-none transition-all duration-300 ${
          error 
            ? 'border-red-500/50 focus:border-red-500' 
            : 'border-gray-600/50 focus:border-blue-500/50 hover:border-gray-500/50'
        } focus:shadow-2xl focus:shadow-blue-500/10`}
        placeholder={placeholder}
        spellCheck="false"
      />
      
      {/* Borde gradiente en focus */}
      <div className={`absolute inset-0 rounded-2xl opacity-0 group-focus-within:opacity-100 transition-opacity duration-300 ${
        error ? 'bg-gradient-to-r from-red-500/20 to-red-600/20' : 'bg-blue-500/10'
      } -z-10 blur-xl`} />
    </div>
  );
});

SearchBox.displayName = 'SearchBox';

export default SearchBox;