// src/components/UPLOAD/UploadProgress.jsx

import React from 'react';

const UploadProgress = ({ progress }) => {
  if (!progress.totalFiles) return null;

  const percentage = progress.totalFiles > 0 ? (progress.currentFile / progress.totalFiles) * 100 : 0;

  return (
    <div className="w-full bg-gray-700 rounded-full p-2 border border-gray-600 shadow-inner my-4">
      <div className="mb-2 text-center text-sm font-medium text-gray-300">
        <p>Procesando: <span className="font-bold text-white">{progress.currentFileName}</span></p>
        <p>Archivo <span className="font-bold text-white">{progress.currentFile}</span> de <span className="font-bold text-white">{progress.totalFiles}</span></p>
      </div>
      <div className="w-full bg-gray-800 rounded-full h-4 overflow-hidden">
        <div
          className="bg-gradient-to-r from-blue-500 to-purple-600 h-4 rounded-full transition-all duration-300 ease-in-out"
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
    </div>
  );
};

export default UploadProgress;