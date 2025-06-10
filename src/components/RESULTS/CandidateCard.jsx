import React from 'react';
import { useNavigate } from 'react-router-dom';
import InitialsAvatar from './initials-avatar-component';
import Swal from 'sweetalert2'; // Importa SweetAlert2
import { useAuth } from '../../context/AuthContext'; // Importa el contexto de autenticación
import { deletePDF } from '../../services/api'; // Importa la función para borrar PDF

const CandidateCard = ({ candidate, showDeleteButton = false, onDelete }) => {
  const navigate = useNavigate();
  const { user, token } = useAuth(); // Obtén el usuario y token

  // Normalizamos los datos porque pueden venir de la página de resultados o de la lista de documentos
  const profile = candidate.profile || candidate.text_json || {};
  const documentId = candidate.document_id || candidate.id;

  const handleProfileClick = () => {
    // Usamos el `documentId` normalizado
    navigate(`/profile/${documentId}`);
  };

  // Lógica de borrado (copiada de PDFCard.jsx)
  const handleDelete = async () => {
    if (!token) {
      Swal.fire('Error', 'Tu sesión ha expirado. Por favor, inicia sesión nuevamente.', 'error');
      return;
    }

    const result = await Swal.fire({
      title: '¿Estás seguro?',
      text: `Esta acción eliminará el archivo "${candidate.filename}" permanentemente.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#e3342f',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
    });

    if (result.isConfirmed) {
      try {
        // Usamos storage_path y user.id para la llamada a la API
        const data = await deletePDF(candidate.storage_path, user.id, token);
        Swal.fire('Eliminado', data.message || 'El archivo fue eliminado', 'success');
        
        if (onDelete) {
          onDelete(documentId); // Notificamos al padre para que actualice la UI
        }
      } catch (error) {
        Swal.fire('Error', error.message || 'No se pudo eliminar el archivo', 'error');
      }
    }
  };

  const name = profile["Nombre completo"] || candidate.filename || "Nombre no disponible";
  const jobTitle = profile["Puesto actual"] || "Sin puesto especificado";
  const experience = profile["Años de experiencia total"] 
    ? `${profile["Años de experiencia total"]} años de experiencia` 
    : "Experiencia no especificada";
  
  // El porcentaje de match solo existe en la página de resultados
  const matchPercentage = candidate.similarity_percentage ? `${candidate.similarity_percentage}% match` : null;

  return (
    <div className="card relative text-white shadow-lg rounded-lg overflow-hidden transition-transform duration-300 hover:scale-105 hover:shadow-blue-500/50 hover:shadow-lg">
      {/* Contenedor del avatar con centrado */}
      <div className="h-48 w-full">
        <InitialsAvatar 
          name={name} 
          size="full"
          colorScheme="gradient"
          withBorder={true}
          withHoverEffects={true}
          className="h-full w-full"
        />
      </div>

      <div className="p-6 bg-gray-800/60 backdrop-blur-sm">
        {/* Mostramos el match percentage solo si existe */}
        {matchPercentage && (
          <span className="match-percentage absolute top-4 right-4 bg-blue-500 text-white font-semibold py-1 px-4 rounded-full shadow-glow">
            {matchPercentage}
          </span>
        )}
        <h3 className="text-2xl font-bold mb-1 bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
          {name}
        </h3>
        <p className="text-blue-300 mb-2">{jobTitle}</p>
        <p className="text-gray-300 text-sm">{experience}</p>
        
        {/* Contenedor para los botones */}
        <div className="mt-4 flex flex-col sm:flex-row gap-2">
          <button
            className="w-full bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-300 shadow-md hover:shadow-blue-500/50"
            onClick={handleProfileClick}
          >
            Ver perfil
          </button>
          
          {/* Mostramos el botón de borrado solo si la prop está activada */}
          {showDeleteButton && (
            <button
              className="w-full bg-gradient-to-r from-red-600 to-red-800 hover:from-red-700 hover:to-red-900 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-300 shadow-md hover:shadow-red-500/50"
              onClick={handleDelete}
            >
              Eliminar
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CandidateCard;