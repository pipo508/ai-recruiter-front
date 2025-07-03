import React, { useState } from 'react';
import { AlertTriangle } from 'lucide-react';
import DeleteAllModal, { deleteAllDocuments } from './DeleteAllModal '; 
import { useAuth } from '../../context/AuthContext';

const DeleteAllButton = ({ onDeleteAll, documentsCount = 0 }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState(null);
  const { token } = useAuth();

  const handleDeleteAll = async () => {
    if (!token) {
      setError('No se encontró el token de autenticación');
      return;
    }

    setIsDeleting(true);
    setError(null);

    try {
      const result = await deleteAllDocuments(token);
      
      // Mostrar mensaje de éxito
      if (result.success) {
        // Llamar callback para actualizar la UI
        if (onDeleteAll) {
          onDeleteAll(result);
        }
        
        // Cerrar modal
        setIsModalOpen(false);
        
        // Opcional: mostrar notificación de éxito
        console.log('✅ Eliminación exitosa:', result.message);
      } else {
        setError(result.message || 'Error al eliminar los documentos');
      }
    } catch (err) {
      console.error('Error al eliminar todos los documentos:', err);
      setError(err.message || 'Error inesperado al eliminar los documentos');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCloseModal = () => {
    if (!isDeleting) {
      setIsModalOpen(false);
      setError(null);
    }
  };

  // No mostrar el botón si no hay documentos
  if (documentsCount === 0) {
    return null;
  }

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        className="group flex items-center space-x-2 px-4 py-2 bg-red-600/10 hover:bg-red-600/20 border border-red-500/30 hover:border-red-500/50 text-red-400 hover:text-red-300 rounded-lg transition-all duration-200 font-medium"
        title={`Eliminar todos los documentos (${documentsCount})`}
      >
        <AlertTriangle className="w-4 h-4 group-hover:scale-110 transition-transform" />
        <span className="hidden sm:inline">Borrar Todo</span>
        <span className="sm:hidden">Borrar</span>
        <span className="text-xs bg-red-500/20 px-2 py-0.5 rounded-full">
          {documentsCount}
        </span>
      </button>

      <DeleteAllModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onConfirm={handleDeleteAll}
        isLoading={isDeleting}
      />

      {/* Error Message */}
      {error && (
        <div className="fixed bottom-4 right-4 z-50 max-w-sm">
          <div className="bg-red-600 text-white px-4 py-3 rounded-lg shadow-lg flex items-start space-x-2">
            <AlertTriangle className="w-5 h-5 mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <p className="text-sm font-medium">Error</p>
              <p className="text-xs opacity-90">{error}</p>
            </div>
            <button
              onClick={() => setError(null)}
              className="text-white/70 hover:text-white"
            >
              ×
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default DeleteAllButton;