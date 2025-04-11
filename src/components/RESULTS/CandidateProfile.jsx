import React from 'react';
import { Calendar, Mail, Github, ExternalLink, Award, Star, Briefcase, Users } from 'lucide-react';

const CandidateProfile = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 pt-16 pb-12 relative">
      {/* Círculos de fondo animados */}
      <div className="animated-bg">
        <div className="bg-circle"></div>
        <div className="bg-circle"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative scrollbar-custom overflow-y-auto h-[calc(100vh-12rem)]"> {/* Apply scroll class */}
        {/* Hero Section con efecto glassmorphism mejorado */}
        <div className="relative rounded-3xl bg-gray-800/30 backdrop-blur-xl border border-gray-700 overflow-hidden shadow-[0_0_40px_rgba(59,130,246,0.1)]">
          <div className="absolute inset-0 bg-grid-white/[0.02] -z-10" />
          
          <div className="p-8 md:p-12">
            <div className="flex flex-col md:flex-row gap-12 items-start">
              {/* Profile Image Section con animación mejorada */}
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 via-cyan-500 to-purple-600 rounded-2xl blur opacity-60 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-pulse" />
                <img 
                  src="https://randomuser.me/api/portraits/women/45.jpg"
                  alt="Ana García"
                  className="relative w-64 h-64 object-cover rounded-xl transform group-hover:scale-105 transition-transform duration-300"
                />
              </div>

              {/* Info Section con badges animados */}
              <div className="flex-1 space-y-6">
                <div>
                  <div className="flex items-center gap-4 mb-4">
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 via-cyan-300 to-purple-400 bg-clip-text text-transparent animate-gradient">
                      Ana García
                    </h1>
                    <span className="px-3 py-1 text-sm bg-blue-500/20 text-blue-400 border border-blue-500/50 rounded-full animate-pulse">
                      98% Match
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Star className="w-5 h-5 text-yellow-400" />
                    <p className="text-xl font-medium text-blue-400">Senior Frontend Developer</p>
                  </div>
                </div>

                {/* Estadísticas con iconos */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-4">
                  <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700 hover:border-blue-500/50 transition-colors">
                    <Users className="w-6 h-6 text-blue-400 mb-2" />
                    <p className="text-sm text-gray-400">Liderazgo de Equipo</p>
                  </div>
                  <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700 hover:border-blue-500/50 transition-colors">
                    <Award className="w-6 h-6 text-purple-400 mb-2" />
                    <p className="text-sm text-gray-400">5 años exp.</p>
                  </div>
                  <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700 hover:border-blue-500/50 transition-colors">
                    <Briefcase className="w-6 h-6 text-cyan-400 mb-2" />
                    <p className="text-sm text-gray-400">15+ Proyectos</p>
                  </div>
                  <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700 hover:border-blue-500/50 transition-colors">
                    <Star className="w-6 h-6 text-yellow-400 mb-2" />
                    <p className="text-sm text-gray-400">Top Performer</p>
                  </div>
                </div>

                <p className="text-gray-300 text-lg leading-relaxed">
                  5 años de experiencia en React, TypeScript y diseño de experiencias de usuario intuitivas. 
                  Líder de equipos ágiles y con una pasión por crear interfaces modernas.
                </p>

                <div className="flex gap-4">
                  <button className="px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-xl font-medium transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/25 active:scale-95 hover:-translate-y-1">
                    Agendar Entrevista
                  </button>
                  <button className="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-xl font-medium transition-all duration-300 hover:shadow-lg active:scale-95 hover:-translate-y-1">
                    Ver Portfolio
                  </button>
                </div>

                <div className="flex gap-4 pt-4">
                  <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors duration-300 transform hover:scale-110">
                    <ExternalLink className="w-6 h-6" />
                  </a>
                  <a href="#" className="text-gray-400 hover:text-purple-400 transition-colors duration-300 transform hover:scale-110">
                    <Github className="w-6 h-6" />
                  </a>
                  <a href="#" className="text-gray-400 hover:text-cyan-400 transition-colors duration-300 transform hover:scale-110">
                    <Mail className="w-6 h-6" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Skills & Experience Grid con animaciones */}
        <div className="grid md:grid-cols-2 gap-8 mt-8">
          {/* Skills Card */}
          <div className="bg-gray-800/30 backdrop-blur-xl border border-gray-700 rounded-xl p-6 hover:shadow-lg hover:shadow-blue-500/10 transition-all duration-300">
            <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
              <Award className="w-5 h-5 text-blue-400" />
              Habilidades Clave
            </h2>
            <div className="flex flex-wrap gap-2">
              {['React', 'TypeScript', 'Next.js', 'UX/UI', 'Tailwind CSS', 'Git'].map((skill) => (
                <span key={skill} className="bg-blue-500/20 text-blue-400 border border-blue-500/50 px-4 py-2 text-sm rounded-full hover:bg-blue-500/30 hover:-translate-y-1 transition-all duration-300">
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {/* Why Perfect Card */}
          <div className="bg-gray-800/30 backdrop-blur-xl border border-gray-700 rounded-xl p-6 hover:shadow-lg hover:shadow-blue-500/10 transition-all duration-300">
            <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
              <Star className="w-5 h-5 text-yellow-400" />
              ¿Por qué es la candidata ideal?
            </h2>
            <p className="text-gray-300">
              Ana ha demostrado ser una líder excepcional en equipos de desarrollo frontend, 
              capaz de transformar ideas complejas en experiencias digitales intuitivas y fluidas.
            </p>
          </div>
        </div>

        {/* Experience Timeline */}
        <div className="mt-8 bg-gray-800/30 backdrop-blur-xl border border-gray-700 rounded-xl p-6 hover:shadow-lg hover:shadow-blue-500/10 transition-all duration-300">
          <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-purple-400" />
            Experiencia Profesional
          </h2>
          <div className="space-y-6">
            {[ 
              { role: 'React Developer', company: 'Empresa XYZ', period: '2022 - Presente', description: 'Lideró el desarrollo de aplicaciones web escalables utilizando React y TypeScript.' },
              { role: 'Frontend Developer', company: 'Empresa ABC', period: '2020 - 2022', description: 'Implementó interfaces de usuario responsivas y optimizó el rendimiento de aplicaciones web.' },
              { role: 'Junior Developer', company: 'Empresa 123', period: '2018 - 2020', description: 'Colaboró en el desarrollo de componentes React y participó en la implementación de nuevas características.' },
              { role: 'Freelance Developer', company: 'Proyectos Varios', period: '2017 - 2018', description: 'Desarrolló sitios web y aplicaciones para diversos clientes utilizando tecnologías modernas.' },
              { role: 'Practicante Frontend', company: 'Startup Tech', period: '2017', description: 'Comenzó su carrera desarrollando componentes UI y aprendiendo mejores prácticas de desarrollo web.' },
              { role: 'Desarrollador WordPress', company: 'Agencia Digital', period: '2016 - 2017', description: 'Creó y mantuvo sitios web personalizados usando WordPress y JavaScript.' }
            ].map((experience, index) => (
              <div key={index} className="relative pl-8 before:absolute before:left-0 before:top-2 before:w-2 before:h-2 before:bg-gradient-to-r before:from-blue-500 before:to-purple-500 before:rounded-full hover:before:scale-150 before:transition-transform">
                <h3 className="text-white font-medium">{experience.role}</h3>
                <p className="text-blue-400">{experience.company}</p>
                <div className="flex items-center gap-2 text-gray-500 text-sm mt-1">
                  <Calendar className="w-4 h-4" />
                  <span>{experience.period}</span>
                </div>
                <p className="text-gray-400 mt-2 text-sm">{experience.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CandidateProfile;
