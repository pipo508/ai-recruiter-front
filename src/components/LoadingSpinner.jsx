import React from 'react';

const LoadingSpinner = () => {
  return (
    <div className="relative flex items-center justify-center w-42 h-42">
      {/* Primer círculo giratorio */}
      <div className="w-20 h-20 border-[10px] border-gray-600 border-opacity-20 border-t-blue-500 rounded-full animate-spin"></div>
      
      {/* Segundo círculo giratorio */}
      <div className="absolute w-14 h-14 border-4 border-gray-600 border-opacity-20 border-t-blue-400 rounded-full animate-spin-slow"></div>
    </div>
  );
};

export default LoadingSpinner;
