import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { fetchCandidateById, updateProfileSection } from '../../services/api';

// Importar componentes editables
import EditableBasicInfo from './EditableBasicInfo';
import EditableContactInfo from './EditableContactInfo';
import EditableSkills from './EditableSkills';
import EditableIdealCandidate from './EditableIdealCandidate';
import EditableExperience from './EditableExperience';
import EditableEducation from './EditableEducation';

// Componente de iniciales para perfil (sin cambios)
const ProfileInitialsAvatar = ({ name }) => {
  const getInitials = (fullName) => {
    return fullName
      .split(' ')
      .map(name => name[0])
      .filter(Boolean)
      .join('')
      .toUpperCase();
  };

  const initials = getInitials(name);

  return (
    <div className="relative group w-64 h-64">
      <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 via-cyan-500 to-purple-600 rounded-2xl blur opacity-60 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-pulse"></div>
      <div className="relative w-full h-full rounded-xl bg-gradient-to-br from-blue-600 via-blue-500 to-blue-700 flex items-center justify-center overflow-hidden transform group-hover:scale-105 transition-transform duration-300">
        <div className="absolute top-0 left-0 w-32 h-32 bg-white rounded-full opacity-20 blur-xl"></div>
        <div className="absolute bottom-0 right-0 w-32 h-32 bg-cyan-300 rounded-full opacity-20 blur-xl"></div>
        <div className="absolute inset-0 bg-grid-pattern opacity-20"></div>
        <div className="absolute inset-3 border-2 border-white border-opacity-30 rounded-lg"></div>
        <span className="text-7xl font-bold text-white tracking-wider z-10 text-shadow-glow">
          {initials}
        </span>
      </div>
    </div>
  );
};

const CandidateProfile = () => {
  const { candidateId } = useParams();
  const { token } = useAuth();
  const [candidate, setCandidate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCandidate = async () => {
      try {
        if (!token) {
          throw new Error('No se encontró el token de autenticación');
        }
        const data = await fetchCandidateById(candidateId, token);
        setCandidate(data);
      } catch (err) {
        setError(err.message || 'Error al cargar el perfil del candidato');
      } finally {
        setLoading(false);
      }
    };
    fetchCandidate();
  }, [candidateId, token]);

  // Función para manejar la actualización de secciones
  const handleSectionUpdate = async (sectionData) => {
    await updateProfileSection(candidateId, sectionData, token);
    
    // Actualizar el estado local
    setCandidate(prev => ({
      ...prev,
      profile: {
        ...prev.profile,
        ...sectionData
      }
    }));
  };

  if (loading) {
    return <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">Cargando...</div>;
  }

  if (error || !candidate || !candidate.profile) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        {error || 'No se encontró el perfil del candidato'}
      </div>
    );
  }

  const { profile, filename } = candidate;
  const name = profile['Nombre completo'] || 'Nombre no disponible';
  const jobTitle = profile['Puesto actual'] || 'Puesto no especificado';
  const experience = profile['Descripción profesional'] || 'Sin descripción disponible';
  const skills = profile['Habilidades clave'] || [];
  const whyPerfect = profile['Candidato ideal'] || 'Sin información disponible';
  const experiences = profile['Experiencia Profesional'] || [];
  const github = profile['GitHub'] || '';
  const email = profile['Email'] || '';
  const mainSkill = profile['Habilidad principal'] || 'No especificada';
  const education = profile['Educación'] || [];
  const phoneNumber = profile['Número de teléfono'] || '';
  const location = profile['Ubicación'] || '';

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 pt-16 pb-12 relative">
      <div className="animated-bg">
        <div className="bg-circle"></div>
        <div className="bg-circle"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative scrollbar-custom overflow-y-auto h-[calc(100vh-12rem)]">
        <div className="relative rounded-3xl bg-gray-800/30 backdrop-blur-xl border border-gray-700 overflow-hidden shadow-[0_0_40px_rgba(59,130,246,0.1)]">
          <div className="absolute inset-0 bg-grid-pattern pointer-events-none" />

          <div className="p-8 md:p-12">
            <div className="flex flex-col md:flex-row gap-12 items-start">
              <ProfileInitialsAvatar name={name} />

              <div className="flex-1 space-y-6">
                {/* Información básica editable */}
                <EditableBasicInfo
                  name={name}
                  jobTitle={jobTitle}
                  experience={experience}
                  mainSkill={mainSkill}
                  profile={profile}
                  onSave={handleSectionUpdate}
                />

                {/* Información de contacto editable */}
                <EditableContactInfo
                  phoneNumber={phoneNumber}
                  email={email}
                  github={github}
                  location={location}
                  candidate={candidate}
                  filename={filename}
                  token={token}
                  onSave={handleSectionUpdate}
                />
              </div>
            </div>
          </div>

          {/* Secciones en grid */}
          <div className="grid md:grid-cols-2 gap-8 mt-8 p-8 pt-0">
            {/* Habilidades editables */}
            <EditableSkills
              skills={skills}
              onSave={handleSectionUpdate}
            />

            {/* Candidato ideal editable */}
            <EditableIdealCandidate
              whyPerfect={whyPerfect}
              onSave={handleSectionUpdate}
            />
          </div>

          {/* Experiencia profesional editable */}
          <EditableExperience
            experiences={experiences}
            onSave={handleSectionUpdate}
          />

          {/* Educación editable */}
          <EditableEducation
            education={education}
            onSave={handleSectionUpdate}
          />
        </div>
      </div>
    </div>
  );
};

export default CandidateProfile;