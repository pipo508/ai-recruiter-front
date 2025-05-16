import React from 'react';
import { useNavigate } from 'react-router-dom';
import InitialsAvatar from './initials-avatar-component';

const CandidateCard = ({ candidate }) => {
  const navigate = useNavigate();

  const handleProfileClick = () => {
    navigate(`/profile/${candidate.name}`);
  };

  return (
    <div className="card relative text-white shadow-lg rounded-lg overflow-hidden transition-transform duration-300 hover:scale-105 hover:shadow-blue-500/50 hover:shadow-lg">
      {/* Contenedor del avatar con centrado */}
      <div className="h-48 w-full">
        <InitialsAvatar 
          name={candidate.name} 
          size="full" // usamos un nuevo tamaño especial
          colorScheme="gradient"
          withBorder={true}
          withHoverEffects={true}
          className="h-full w-full"
        />
      </div>

      <div className="p-6 bg-gray-800/60 backdrop-blur-sm">
        <span className="match-percentage absolute top-4 right-4 bg-blue-500 text-white font-semibold py-1 px-4 rounded-full shadow-glow">
          {candidate.matchPercentage}
        </span>
        <h3 className="text-2xl font-bold mb-1 bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
          {candidate.name}
        </h3>
        <p className="text-blue-300 mb-2">{candidate.jobTitle}</p>
        <p className="text-gray-300 text-sm">{candidate.experience}</p>
        <button
          className="mt-4 w-full bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-300 shadow-md hover:shadow-blue-500/50"
          onClick={handleProfileClick}
        >
          Ver perfil completo
        </button>
      </div>
    </div>
  );
};

export default CandidateCard;
