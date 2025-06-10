import React from 'react';
import { Search } from 'lucide-react';

const PageHeader = ({ title, subtitle, searchTerm, onSearchChange }) => {
  return (
    <header className="text-center mb-12 mt-16 lg:mt-20">
      <div className="relative mb-8">
        <h1 className="text-5xl lg:text-6xl font-bold bg-gradient-to-r from-white via-blue-200 to-blue-400 bg-clip-text text-transparent mb-4 animate-fadeInUp">
          {title}
        </h1>
        <div className="absolute -top-4 -right-4 w-12 h-12 bg-blue-500/20 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute -bottom-2 -left-6 w-8 h-8 bg-purple-500/20 rounded-full blur-lg animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>
      
      <p className="text-gray-400 text-lg lg:text-xl mb-8 animate-fadeInUp" style={{ animationDelay: '200ms' }}>
        {subtitle}
      </p>

      <div className="max-w-md mx-auto relative animate-fadeInUp" style={{ animationDelay: '400ms' }}>
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          placeholder="Buscar en tu historial..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-12 pr-4 py-3 bg-gray-800/60 backdrop-blur-sm border border-gray-700/50 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-300"
        />
      </div>
    </header>
  );
};

export default PageHeader;