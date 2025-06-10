import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';

const ErrorMessage = ({ message, onRetry }) => {
  return (
    <div className="flex-grow flex items-center justify-center p-8">
      <div className="text-center max-w-md">
        <div className="w-20 h-20 bg-red-500/20 rounded-full mx-auto flex items-center justify-center mb-6">
          <AlertCircle className="w-10 h-10 text-red-400" />
        </div>
        
        <h3 className="text-2xl font-bold text-white mb-4">Oops, algo salió mal</h3>
        <p className="text-red-400 text-lg mb-8">{message}</p>
        
        {onRetry && (
          <button
            onClick={onRetry}
            className="px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-semibold rounded-xl transition-all duration-300 hover:scale-105 flex items-center gap-2 mx-auto"
          >
            <RefreshCw className="w-4 h-4" />
            Reintentar
          </button>
        )}
      </div>
    </div>
  );
};

export default ErrorMessage;