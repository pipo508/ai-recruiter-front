import React from 'react';

const HeroTitle = ({ title, subtitle }) => {
  return (
    <div className="space-y-6 mb-16">
      <div className="relative">
        <h1 className="text-6xl lg:text-7xl font-bold bg-gradient-to-r from-white via-blue-200 to-blue-400 bg-clip-text text-transparent tracking-tight animate-fadeInUp leading-tight">
          {title}
        </h1>
        {/* Elementos decorativos */}
        <div className="absolute -top-8 -right-8 w-16 h-16 bg-blue-500/20 rounded-full blur-2xl animate-pulse" />
        <div className="absolute -bottom-4 -left-8 w-12 h-12 bg-purple-500/20 rounded-full blur-xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>
      
      <p className="text-gray-300 text-xl lg:text-2xl max-w-3xl mx-auto leading-relaxed animate-fadeInUp" style={{ animationDelay: '200ms' }}>
        {subtitle}
      </p>
      
      {/* Línea decorativa */}
      <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto rounded-full animate-fadeInUp" style={{ animationDelay: '400ms' }} />
    </div>
  );
};

export default HeroTitle;