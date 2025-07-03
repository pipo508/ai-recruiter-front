import React, { useState } from 'react';
import { Zap, Clock, DollarSign, Sparkles, Info } from 'lucide-react';

const AIToggle = ({ isEnabled, onToggle, disabled = false }) => {
  const [showAlert, setShowAlert] = useState(false);

  const handleToggle = () => {
    if (disabled) return;
    
    const newState = !isEnabled;
    
    // SOLO cambiar el estado - NO activar procesamiento
    onToggle(newState);
    
    // Mostrar alerta solo cuando se activa
    if (newState) {
      setShowAlert(true);
      // Auto-ocultar después de 4 segundos
      setTimeout(() => setShowAlert(false), 4000);
    } else {
      setShowAlert(false);
    }
  };

  return (
    <div className="relative">
      {/* Toggle Button */}
      <div className="flex items-center space-x-3">
        <div className="flex items-center space-x-2">
          <span className={`text-sm font-medium transition-colors duration-200 ${
            isEnabled ? 'text-purple-400' : 'text-gray-400'
          }`}>
            AI+
          </span>
          
          <button
            onClick={handleToggle}
            disabled={disabled}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-gray-900 ${
              disabled 
                ? 'bg-gray-600 cursor-not-allowed opacity-50' 
                : isEnabled
                  ? 'bg-gradient-to-r from-purple-500 to-blue-500 shadow-lg shadow-purple-500/30'
                  : 'bg-gray-600 hover:bg-gray-500'
            }`}
            aria-label={`${isEnabled ? 'Desactivar' : 'Activar'} modo AI+`}
            type="button"
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-all duration-300 ${
                isEnabled ? 'translate-x-6 shadow-lg' : 'translate-x-1'
              } ${disabled ? 'opacity-70' : ''}`}
            >
              {isEnabled && (
                <Zap className="h-3 w-3 text-purple-500 absolute top-0.5 left-0.5" />
              )}
            </span>
          </button>
        </div>

        {/* Status Indicator */}
        {isEnabled && (
          <div className="flex items-center space-x-1 text-xs">
            <Sparkles className="h-3 w-3 text-purple-400 animate-pulse" />
            <span className="text-purple-400 font-medium">Activado</span>
          </div>
        )}
      </div>

      {/* Simplified Alert */}
      {showAlert && isEnabled && (
        <div className="absolute top-8 right-0 z-50 w-72 animate-fade-in">
          <div className="bg-gray-800/95 border border-gray-600/50 rounded-lg shadow-xl backdrop-blur-sm">
            <div className="p-4">
              {/* Header */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <Zap className="h-4 w-4 text-purple-400" />
                  <h4 className="text-sm font-semibold text-white">
                    AI+ Activado
                  </h4>
                </div>
                <button
                  onClick={() => setShowAlert(false)}
                  className="text-gray-400 hover:text-white transition-colors text-lg leading-none"
                  type="button"
                  aria-label="Cerrar alerta"
                >
                  ×
                </button>
              </div>

              {/* Content */}
              <div className="space-y-2 text-xs text-gray-300">
                <div className="flex items-center space-x-2">
                  <Sparkles className="h-3 w-3 text-green-400 flex-shrink-0" />
                  <span>Mayor precisión y análisis detallado</span>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Clock className="h-3 w-3 text-yellow-400 flex-shrink-0" />
                  <span>Procesamiento más lento (2-3x)</span>
                </div>

                <div className="flex items-center space-x-2">
                  <DollarSign className="h-3 w-3 text-orange-400 flex-shrink-0" />
                  <span>Usa modelo premium GPT-4o-mini</span>
                </div>
              </div>

              {/* Footer */}
              <div className="mt-3 pt-3 border-t border-gray-700/50">
                <div className="flex items-center space-x-2 text-xs text-gray-400">
                  <Info className="h-3 w-3" />
                  <span>Ideal para documentos complejos</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Animation Styles */}
      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(-8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.2s ease-out;
        }
      `}</style>
    </div>
  );
};

export default AIToggle;