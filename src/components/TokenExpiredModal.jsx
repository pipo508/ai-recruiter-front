// src/components/Modals/TokenExpiredModal.js
import React from 'react';

const TokenExpiredModal = ({ isOpen, onConfirm, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 shadow-xl">
        <div className="flex items-center justify-center w-12 h-12 mx-auto bg-yellow-100 rounded-full mb-4">
          <svg
            className="w-6 h-6 text-yellow-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.08 16.5c-.77.833.192 2.5 1.732 2.5z"
            />
          </svg>
        </div>
        
        <div className="text-center">
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Sesión Expirada
          </h3>
          <p className="text-sm text-gray-500 mb-6">
            Tu sesión ha expirado por motivos de seguridad. Por favor, inicia sesión nuevamente para continuar.
          </p>
          
          <div className="flex gap-3 justify-center">
            <button
              onClick={onConfirm}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium transition-colors"
            >
              Iniciar Sesión
            </button>
            {/* Opcional: botón para cerrar sin hacer nada */}
            {/* <button
              onClick={onClose}
              className="bg-gray-300 hover:bg-gray-400 text-gray-700 px-4 py-2 rounded-md font-medium transition-colors"
            >
              Cerrar
            </button> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TokenExpiredModal;