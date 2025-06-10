import React from 'react';
import { Lightbulb } from 'lucide-react';

const SuggestionTags = ({ suggestions, onSuggestionClick, title }) => {
  return (
    <div className="space-y-6 animate-fadeInUp" style={{ animationDelay: '600ms' }}>
      <div className="flex items-center justify-center gap-2 text-gray-400">
        <Lightbulb className="w-4 h-4" />
        <p>{title}</p>
      </div>
      
      <div className="flex flex-wrap gap-3 justify-center max-w-4xl mx-auto">
        {suggestions.map((suggestion, index) => (
          <button
            key={suggestion}
            onClick={() => onSuggestionClick(suggestion)}
            className="group px-6 py-3 bg-gray-800/40 backdrop-blur-sm border border-gray-600/30 rounded-full text-blue-300 text-sm font-medium hover:bg-blue-600/20 hover:border-blue-500/50 hover:text-white hover:scale-105 transition-all duration-300 animate-fadeInUp"
            style={{ animationDelay: `${800 + index * 100}ms` }}
          >
            <span className="relative">
              {suggestion}
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10 blur-sm" />
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default SuggestionTags;