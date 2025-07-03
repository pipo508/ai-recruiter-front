// src/components/Modals/ConfirmDeleteModal.jsx

import React from 'react';
import { AlertTriangle, Trash2, X } from 'lucide-react';

/**
 * Un modal de confirmación reutilizable para acciones destructivas simples.
 * * @param {object} props
 * @param {boolean} props.isOpen - Controla si el modal está visible.
 * @param {function} props.onClose - Función para cerrar el modal.
 * @param {function} props.onConfirm - Función que se ejecuta al confirmar la acción.
 * @param {boolean} [props.isLoading=false] - Si es true, muestra un estado de carga.
 * @param {string} [props.title='Confirmar Eliminación'] - El título del modal.
 * @param {string} [props.message='¿Estás seguro? Esta acción no se puede deshacer.'] - El mensaje de advertencia.
 */
const ConfirmDeleteModal = ({
  isOpen,
  onClose,
  onConfirm,
  isLoading = false,
  title = 'Confirmar Eliminación',
  message = '¿Estás seguro de que quieres eliminar este elemento? Esta acción no se puede deshacer.'
}) => {

  const handleConfirm = () => {
    if (!isLoading) {
      onConfirm();
    }
  };

  const handleClose = () => {
    if (!isLoading) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={handleClose}
      />
      
      {/* Modal */}
      <div className="relative bg-gray-900 border border-red-500/30 rounded-2xl max-w-sm w-full mx-4 shadow-2xl animate-fadeInUp">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-gray-700">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-red-500/10 rounded-lg">
              <AlertTriangle className="w-5 h-5 text-red-400" />
            </div>
            <h2 className="text-lg font-bold text-white">
              {title}
            </h2>
          </div>
          {!isLoading && (
            <button
              onClick={handleClose}
              className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-gray-400" />
            </button>
          )}
        </div>

        {/* Content */}
        <div className="p-6">
          <p className="text-sm text-gray-300">
            {message}
          </p>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end space-x-3 p-4 bg-gray-900/50 border-t border-gray-700">
          <button
            onClick={handleClose}
            disabled={isLoading}
            className="px-4 py-2 text-gray-300 hover:text-white hover:bg-gray-800 rounded-lg transition-colors disabled:opacity-50"
          >
            Cancelar
          </button>
          <button
            onClick={handleConfirm}
            disabled={isLoading}
            className="px-5 py-2 bg-red-600 hover:bg-red-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors flex items-center space-x-2"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Eliminando...</span>
              </>
            ) : (
              <>
                <Trash2 className="w-4 h-4" />
                <span>Sí, eliminar</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDeleteModal;