import React from 'react';
import { Search, Clock } from 'lucide-react';

const EmptyState = ({ title, description, actionText, onAction, showAction = true }) => {
  return (
    <div className="text-center py-16">
      <div className="relative mb-8">
        <div className="w-24 h-24 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full mx-auto flex items-center justify-center backdrop-blur-sm border border-gray-700/50">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-600/30 to-purple-600/30 rounded-full flex items-center justify-center">
            <Clock className="w-8 h-8 text-blue-400" />
          </div>
        </div>
        <div className="absolute -top-2 -right-2 w-8 h-8 bg-blue-500/20 rounded-full flex items-center justify-center">
          <Search className="w-4 h-4 text-blue-400" />
        </div>
      </div>
      
      <h3 className="text-2xl font-bold text-white mb-4">{title}</h3>
      <p className="text-gray-400 text-lg mb-8 max-w-md mx-auto">{description}</p>
      
      {showAction && actionText && onAction && (
        <button
          onClick={onAction}
          className="px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-blue-500/25"
        >
          {actionText}
        </button>
      )}
    </div>
  );
};

export default EmptyState;