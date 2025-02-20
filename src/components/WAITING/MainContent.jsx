import React from 'react';
import StatsGrid from './StatsGrid';
import LoadingSpinner from '../LoadingSpinner';

const MainContent = () => {
  return (
    <main className="relative flex flex-col items-center justify-between min-h-screen">
      {/* Removed justify-end to allow more flexible positioning */}
      <div className="text-center z-10 flex-grow flex flex-col">
        {/* Reduced space-y-20 to space-y-8 to bring elements closer */}
        <div className="space-y-8 pt-20"> {/* Added pt-20 for top padding */}
          <div className="glass-container p-8 rounded-2xl inline-block relative mt-12"> {/* Reduced padding and made container smaller */} {/* Added margin top */}
            <h1 className="text-5xl font-bold text-white tracking-tight mb-2 mt-12"> {/* Reduced margin top */}
              AI Talent Analyzer
            </h1>
            {/* Reduced padding and made container smaller */}
            <p className="text-xl text-gray-400 max-w-xl mx-auto glass-container p-1 rounded-xl typing-text">
              Analizando perfiles y encontrando el talento ideal para tu empresa
            </p>
          </div>
        </div>

        {/* Reduced space-y-8 to space-y-4 and mb-12 to mb-8 */}
        <div className="space-y-4 mb-8">
          <div className="flex flex-col items-center space-y-6"> {/* Reduced space-y-12 to space-y-6 */}
            <div className="glass-container px-8 py-4 rounded-full border-2 border-blue-700">
              <p className="text-blue-400 text-lg">
                Procesando currículums con IA avanzada
              </p>
            </div>
            {/* Reduced margin top */}
            <div className="mt-2">
              <LoadingSpinner />
            </div>
            <div className="flex flex-wrap justify-center space-x-2 text-sm text-gray-400">
              <span>Análisis de competencias</span>
              <span className="text-blue-400">•</span>
              <span>Evaluación de experiencia</span>
              <span className="text-blue-400">•</span>
              <span>Match de habilidades</span>
            </div>
          </div>
        </div>

        {/* Moved stats up by reducing bottom margin */}
        <div className="mb-6">
          <StatsGrid />
        </div>
      </div>
    </main>
  );
};

export default MainContent;