import React from 'react';
import { AlertCircle, X } from 'lucide-react';

const ErrorAlert = ({ message, onClose }) => {
  return (
    <div className="flex items-center justify-between bg-red-900/30 backdrop-blur-sm border border-red-500/50 rounded-xl p-4 animate-fadeIn">
      <div className="flex items-center gap-3">
        <div className="p-1 bg-red-500/20 rounded-full">
          <AlertCircle className="w-4 h-4 text-red-400" />
        </div>
        <p className="text-red-300 text-sm font-medium">{message}</p>
      </div>
      
      {onClose && (
        <button
          onClick={onClose}
          className="p-1 hover:bg-red-500/20 rounded-full transition-colors duration-200"
        >
          <X className="w-4 h-4 text-red-400" />
        </button>
      )}
    </div>
  );
};

export default ErrorAlert;