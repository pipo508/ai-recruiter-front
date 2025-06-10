import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Calendar, Mail, Github, Award, Star, Briefcase, Users } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { fetchCandidateById } from '../../services/api';


// Componente de iniciales para perfil (versión más grande y detallada)
const ProfileInitialsAvatar = ({ name }) => {
  // Función para extraer las iniciales del nombre
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
      {/* Efecto de gradiente animado en el borde */}
      <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 via-cyan-500 to-purple-600 rounded-2xl blur opacity-60 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-pulse"></div>
      
      {/* Contenedor principal con fondo gradiente */}
      <div className="relative w-full h-full rounded-xl bg-gradient-to-br from-blue-600 via-blue-500 to-blue-700 flex items-center justify-center overflow-hidden transform group-hover:scale-105 transition-transform duration-300">
        
        {/* Efectos de luz */}
        <div className="absolute top-0 left-0 w-32 h-32 bg-white rounded-full opacity-20 blur-xl"></div>
        <div className="absolute bottom-0 right-0 w-32 h-32 bg-cyan-300 rounded-full opacity-20 blur-xl"></div>
        
        {/* Patrón de fondo */}
        <div className="absolute inset-0 bg-grid-pattern opacity-20"></div>
        
        {/* Borde interno iluminado */}
        <div className="absolute inset-3 border-2 border-white border-opacity-30 rounded-lg"></div>
        
        {/* Iniciales */}
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
                <div>
                  <div className="flex items-center gap-4 mb-4">
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 via-cyan-300 to-purple-400 bg-clip-text text-transparent animate-gradient">
                      {name}
                    </h1>
                  </div>
                  <div className="flex items-center gap-2">
                    <Star className="w-5 h-5 text-yellow-400" />
                    <p className="text-xl font-medium text-blue-400">{jobTitle}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-4">
                  <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700 hover:border-blue-500/50 transition-colors">
                    <Users className="w-6 h-6 text-blue-400 mb-2" />
                    <p className="text-sm text-gray-400">Liderazgo de Equipo</p>
                  </div>
                  <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700 hover:border-blue-500/50 transition-colors">
                    <Award className="w-6 h-6 text-blue-600 mb-2" />
                    <p className="text-sm text-gray-400">{profile['Años de experiencia total'] || 'N/A'} años exp.</p>
                  </div>
                  <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700 hover:border-blue-500/50 transition-colors">
                    <Briefcase className="w-6 h-6 text-cyan-400 mb-2" />
                    <p className="text-sm text-gray-400">{profile['Cantidad de proyectos/trabajos'] || 'N/A'} Proyectos</p>
                  </div>
                  <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700 hover:border-blue-500/50 transition-colors">
                    <Star className="w-6 h-6 text-yellow-400 mb-2" />
                    <p className="text-sm text-gray-400">Top Performer</p>
                  </div>
                </div>

                <p className="text-gray-300 text-lg leading-relaxed">
                  {experience}
                </p>

                <div className="flex gap-4">
                  <button className="px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-xl font-medium transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/25 active:scale-95 hover:-translate-y-1">
                    Agendar Entrevista
                  </button>
                  <button 
                    className="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-xl font-medium transition-all duration-300 hover:shadow-lg active:scale-95 hover:-translate-y-1"
                    onClick={async () => {
                      try {
                        const response = await fetch(`http://127.0.0.1:5000/document/get-pdf?user_id=${candidate.user_id}&filename=${filename}`, {
                          headers: { 'Authorization': `Bearer ${token}` }
                        });
                        const data = await response.json();
                        if (data.success && data.file_url) {
                          window.open(data.file_url, '_blank');
                        } else {
                          alert('No se pudo obtener la URL del portafolio');
                        }
                      } catch (err) {
                        alert('Error al obtener el portafolio: ' + err.message);
                      }
                    }}
                  >
                    Ver Portafolio
                  </button>
                </div>

                <div className="flex gap-4 pt-4">
                  {github && (
                    <a
                      href={github.startsWith('http') ? github : `https://${github}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-400 hover:text-purple-400 transition-colors duration-300 transform hover:scale-110"
                    >
                      <Github className="w-6 h-6" />
                    </a>
                  )}
                  {email && (
                    <a href={`mailto:${email}`} className="text-gray-400 hover:text-cyan-400 transition-colors duration-300 transform hover:scale-110">
                      <Mail className="w-6 h-6" />
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mt-8">
            <div className="bg-gray-800/30 backdrop-blur-xl border border-gray-700 rounded-xl p-6 hover:shadow-lg hover:shadow-blue-500/10 transition-all duration-300">
              <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                <Award className="w-5 h-5 text-blue-400" />
                Habilidades Clave
              </h2>
              <div className="flex flex-wrap gap-2">
                {skills.map((skill, index) => (
                  <span key={index} className="bg-blue-500/20 text-blue-400 border border-blue-500/50 px-4 py-2 text-sm rounded-full hover:bg-blue-500/30 hover:-translate-y-1 transition-all duration-300">
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            <div className="bg-gray-800/30 backdrop-blur-xl border border-gray-700 rounded-xl p-6 hover:shadow-lg hover:shadow-blue-500/10 transition-all duration-300">
              <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                <Star className="w-5 h-5 text-yellow-400" />
                ¿Por qué es el candidato ideal?
              </h2>
              <p className="text-gray-300">
                {whyPerfect}
              </p>
            </div>
          </div>

          <div className="mt-8 bg-gray-800/30 backdrop-blur-xl border border-gray-700 rounded-xl p-6 hover:shadow-lg hover:shadow-blue-500/10 transition-all duration-300">
            <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-purple-400" />
              Experiencia Profesional
            </h2>
            <div className="space-y-6">
              {experiences.map((experience, index) => (
                <div key={index} className="relative pl-8 before:absolute before:left-0 before:top-2 before:w-2 before:h-2 before:bg-gradient-to-r before:from-blue-500 before:to-purple-500 before:rounded-full hover:before:scale-150 before:transition-transform">
                  <h3 className="text-white font-medium">{experience['Puesto']}</h3>
                  <p className="text-blue-400">{experience['Empresa']}</p>
                  <div className="flex items-center gap-2 text-gray-500 text-sm mt-1">
                    <Calendar className="w-4 h-4" />
                    <span>{`${experience['Año inicio']} - ${experience['Año fin']}`}</span>
                  </div>
                  <p className="text-gray-400 mt-2 text-sm">{experience['Descripción breve del rol']}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CandidateProfile;