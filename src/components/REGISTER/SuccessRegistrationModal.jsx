// src/components/Modals/SuccessRegistrationModal.jsx

import React from 'react';
import { CheckCircle } from 'lucide-react';

/**
 * Modal de confirmación para registro exitoso
 * @param {object} props
 * @param {boolean} props.isOpen - Controla si el modal está visible
 * @param {function} props.onAccept - Función que se ejecuta al aceptar (redirige al login)
 * @param {string} [props.username] - Nombre de usuario registrado
 */
const SuccessRegistrationModal = ({
  isOpen,
  onAccept,
  username = ''
}) => {

  const handleAccept = () => {
    onAccept();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop - Sin onClick para que no se pueda cerrar */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
      
      {/* Modal */}
      <div className="relative bg-gradient-to-br from-[#0a0f1c] via-[#0d1728] to-[#07111d] border border-green-500/30 rounded-2xl max-w-md w-full mx-4 shadow-2xl animate-fadeInUp ring-1 ring-green-400/20">
        {/* Header - Sin botón X */}
        <div className="flex items-center justify-center p-5 border-b border-gray-700/50">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-green-500/10 rounded-lg">
              <CheckCircle className="w-6 h-6 text-green-400" />
            </div>
            <h2 className="text-xl font-bold text-white">
              ¡Registro Exitoso!
            </h2>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 text-center">
          <div className="mb-4">
            <div className="mx-auto w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mb-4">
              <CheckCircle className="w-8 h-8 text-green-400" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">
              ¡Bienvenido{username ? `, ${username}` : ''}!
            </h3>
            <p className="text-sm text-gray-300">
              Tu cuenta ha sido creada exitosamente.
            </p>
          </div>
        </div>

        {/* Footer - Solo botón Aceptar */}
        <div className="flex items-center justify-center p-4 bg-gray-900/30 border-t border-gray-700/50">
          <button
            onClick={handleAccept}
            className="px-8 py-3 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white rounded-lg font-medium transition-all duration-200 flex items-center space-x-2 shadow-lg hover:shadow-green-500/30 focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <CheckCircle className="w-4 h-4" />
            <span>Aceptar</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default SuccessRegistrationModal;