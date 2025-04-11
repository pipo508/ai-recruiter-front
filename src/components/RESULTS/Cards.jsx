import React from 'react';
import { useNavigate } from 'react-router-dom';

const CandidateCard = ({ candidate }) => {
  const navigate = useNavigate(); // Hook para navegar

  const handleProfileClick = () => {
    // Navegar a la página del perfil usando el candidateId
    navigate(`/profile/${candidate.name}`); // Aquí candidate.name es el identificador, puedes cambiarlo por un ID único si es necesario
  };

  return (
    <div className="card relative text-white shadow-lg">
      <img
        src={candidate.imageUrl}
        alt={candidate.name}
        className="w-full h-48 object-cover"
      />
      <div className="p-6">
        <span className="match-percentage absolute top-4 right-4 bg-blue-500 text-white font-semibold py-1 px-4 rounded-full">
          {candidate.matchPercentage}
        </span>
        <h3 className="text-2xl font-bold mb-1">{candidate.name}</h3>
        <p className="text-blue-300 mb-2">{candidate.jobTitle}</p>
        <p className="text-gray-300 text-sm">{candidate.experience}</p>
        <button
          className="mt-4 w-full bg-blue-500 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-all"
          onClick={handleProfileClick} // Redirigir al perfil
        >
          Ver perfil completo
        </button>
      </div>
    </div>
  );
};

export default CandidateCard;
