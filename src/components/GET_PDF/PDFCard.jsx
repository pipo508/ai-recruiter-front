import React from 'react';
import Swal from 'sweetalert2';
import { DOCUMENTS_VIEW_CONSTANTS as C } from '../../constants/constants';
import { deletePDF } from '../../services/api'; 
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const PDFCard = ({ document, onDelete, skipRedirect = false }) => {
  const { token, user } = useAuth();
  const navigate = useNavigate();

  const handleDelete = async () => {
    if (!token) {
      Swal.fire('Error', 'Tu sesión ha expirado. Por favor, inicia sesión nuevamente.', 'error');
      return;
    }

    const result = await Swal.fire({
      title: '¿Estás seguro?',
      text: 'Esta acción eliminará el archivo permanentemente.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#e3342f',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
    });

    if (result.isConfirmed) {
      try {
        const data = await deletePDF(document.storage_path, user.id, token);
        Swal.fire('Eliminado', data.message || 'El archivo fue eliminado', 'success');
        
        // Primero notificamos al componente padre sobre la eliminación
        if (onDelete) {
          onDelete(document.id);
        }

        // Solo redirigimos si no estamos ya en la página de documentos o si skipRedirect es false
        if (!skipRedirect) {
          navigate('/documentlist');
        }
      } catch (error) {
        console.error('Error al eliminar documento:', error);
        Swal.fire('Error', error.message || 'No se pudo eliminar el archivo', 'error');
      }
    }
  };

  return (
    <div className={`rounded-xl shadow-lg p-5 ${C.COLORS.CARD} group search-container`}>
      <div className="flex justify-between items-start mb-3">
        <div className="flex-1">
          <p className="font-semibold text-lg truncate text-white">{document.filename}</p>
          <p className="text-xs text-gray-400 mt-1">
            Subido el: {new Date(document.created_at).toLocaleDateString()}
          </p>
        </div>
        <div
          className="bg-[rgba(255,255,255,0.05)] p-2 rounded-lg cursor-pointer"
          onClick={handleDelete}
          title="Eliminar archivo"
        >
          <svg
            className="w-5 h-5 text-red-400 hover:text-red-600 transition"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M6 2a1 1 0 00-1 1v1H3.5a.5.5 0 000 1h.54l.83 10.03A2 2 0 006.85 18h6.3a2 2 0 001.98-1.97L15.95 5H16.5a.5.5 0 000-1H15V3a1 1 0 00-1-1H6zm2 5a.5.5 0 011 0v7a.5.5 0 01-1 0V7zm3 .5a.5.5 0 10-1 0v7a.5.5 0 001 0v-7z"
              clipRule="evenodd"
            />
          </svg>
        </div>
      </div>

      <div className="flex justify-between items-center mt-4">
        {document.ocr_processed && (
          <span className="bg-blue-600/40 text-blue-200 text-xs px-2 py-1 rounded-full">
            OCR Procesado
          </span>
        )}
        <a
          href={document.file_url}
          target="_blank"
          rel="noopener noreferrer"
          className={`ml-auto flex items-center space-x-1 px-3 py-1.5 rounded-lg ${C.COLORS.BUTTON} text-sm search-button`}
        >
          <span>Ver PDF</span>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
        </a>
      </div>
    </div>
  );
};

export default PDFCard;