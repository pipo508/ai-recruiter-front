import React from 'react';

const FloatingElements = () => {
  return (
    <>
      {/* Elementos flotantes de fondo */}
      <div className="absolute top-20 left-10 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute top-40 right-20 w-24 h-24 bg-purple-500/10 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '2s' }} />
      <div className="absolute bottom-32 left-1/4 w-20 h-20 bg-cyan-500/10 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '4s' }} />
      <div className="absolute bottom-20 right-1/3 w-28 h-28 bg-pink-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '6s' }} />
      
      {/* Líneas decorativas */}
      <div className="absolute top-1/4 left-0 w-full h-px bg-gradient-to-r from-transparent via-blue-500/20 to-transparent" />
      <div className="absolute bottom-1/4 left-0 w-full h-px bg-gradient-to-r from-transparent via-purple-500/20 to-transparent" />
    </>
  );
};

export default FloatingElements;