import React, { useState } from 'react';
import { Trash2, AlertTriangle, X } from 'lucide-react';

const DeleteAllModal = ({ isOpen, onClose, onConfirm, isLoading = false }) => {
  const [confirmationText, setConfirmationText] = useState('');
  const [isChecked, setIsChecked] = useState(false);
  
  const CONFIRMATION_TEXT = 'BORRAR TODO';
  const isConfirmationValid = confirmationText === CONFIRMATION_TEXT && isChecked;

  const handleConfirm = () => {
    if (isConfirmationValid && !isLoading) {
      onConfirm();
    }
  };

  const handleClose = () => {
    if (!isLoading) {
      setConfirmationText('');
      setIsChecked(false);
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
      <div className="relative bg-gray-900 border border-red-500/30 rounded-2xl max-w-md w-full mx-4 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-red-500/10 rounded-lg">
              <AlertTriangle className="w-6 h-6 text-red-400" />
            </div>
            <h2 className="text-xl font-bold text-white">
              Eliminar Todos los Documentos
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
        <div className="p-6 space-y-6">
          {/* Warning Message */}
          <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <AlertTriangle className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-red-200">
                <p className="font-semibold mb-2">¡Acción irreversible!</p>
                <ul className="space-y-1 text-red-300">
                  <li>• Se eliminarán TODOS tus documentos</li>
                  <li>• Se borrarán todos los archivos PDF</li>
                  <li>• Se eliminará todo el historial de búsquedas</li>
                  <li>• Esta acción NO se puede deshacer</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Confirmation Steps */}
          <div className="space-y-4">
            {/* Checkbox Confirmation */}
            <label className="flex items-start space-x-3 cursor-pointer">
              <input
                type="checkbox"
                checked={isChecked}
                onChange={(e) => setIsChecked(e.target.checked)}
                disabled={isLoading}
                className="mt-1 w-4 h-4 text-red-500 bg-gray-800 border-gray-600 rounded focus:ring-red-500 focus:ring-2"
              />
              <span className="text-sm text-gray-300">
                Entiendo que esta acción eliminará permanentemente todos mis documentos y datos asociados
              </span>
            </label>

            {/* Text Confirmation */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-300">
                Para confirmar, escribe: <span className="text-red-400 font-mono font-bold">{CONFIRMATION_TEXT}</span>
              </label>
              <input
                type="text"
                value={confirmationText}
                onChange={(e) => setConfirmationText(e.target.value)}
                disabled={isLoading}
                placeholder="Escribe aquí..."
                className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-red-500 focus:ring-1 focus:ring-red-500 font-mono"
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-700">
          <button
            onClick={handleClose}
            disabled={isLoading}
            className="px-4 py-2 text-gray-300 hover:text-white hover:bg-gray-800 rounded-lg transition-colors disabled:opacity-50"
          >
            Cancelar
          </button>
          <button
            onClick={handleConfirm}
            disabled={!isConfirmationValid || isLoading}
            className="px-6 py-2 bg-red-600 hover:bg-red-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors flex items-center space-x-2"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Eliminando...</span>
              </>
            ) : (
              <>
                <Trash2 className="w-4 h-4" />
                <span>Eliminar Todo</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteAllModal;

// Función API para eliminar todos los documentos
export const deleteAllDocuments = async (token) => {
  try {
    if (!token) {
      throw new Error('Token de autorización faltante. Por favor, inicia sesión nuevamente.');
    }
    
    const response = await fetch('http://127.0.0.1:5000/api/document/delete-all', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ 
        confirmation: "DELETE_ALL_DOCUMENTS" 
      }),
    });

    console.log('deleteAllDocuments - Response status:', response.status);

    if (!response.ok) {
      const contentType = response.headers.get('content-type');
      
      if (!contentType || !contentType.includes('application/json')) {
        const text = await response.text();
        throw new Error(`Respuesta inesperada del servidor: ${text}`);
      }

      const data = await response.json();
      const error = new Error(data.error || 'Error al eliminar todos los documentos');
      error.status = response.status;
      throw error;
    }

    const data = await response.json();
    console.log('Delete all successful:', data);
    return data;
  } catch (error) {
    console.error('❌ Error en deleteAllDocuments:', error.message);
    throw error;
  }
};