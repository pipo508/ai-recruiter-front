import React from "react";
import Navbar from "../components/Navbar";
import ParticlesBackground from "../components/ParticlesBackground";
import CandidateCard from "../components/RESULTS/CandidateCard"

const ResultsPage = () => {
  // Datos de candidatos actualizados (mantenemos los datos iguales)
  const candidates = [
    {
      name: "Ana García",
      jobTitle: "Senior Frontend Developer",
      experience: "5 años de experiencia en React y TypeScript.",
      matchPercentage: "98% match",
      profileUrl: "perfil.html",
    },
    {
      name: "Carlos Ruiz",
      jobTitle: "Full Stack Developer",
      experience: "4 años de experiencia en Node.js y React.",
      matchPercentage: "95% match",
      profileUrl: "perfil.html",
    },
    {
      name: "Laura Martínez",
      jobTitle: "Backend Developer",
      experience: "3 años de experiencia en Node.js y AWS.",
      matchPercentage: "92% match",
      profileUrl: "perfil.html",
    },
    {
      name: "Miguel Sánchez",
      jobTitle: "UX/UI Designer",
      experience: "6 años de experiencia en diseño de interfaces.",
      matchPercentage: "90% match",
      profileUrl: "perfil.html",
    },
    {
      name: "Elena Torres",
      jobTitle: "Mobile Developer",
      experience: "4 años de experiencia en desarrollo móvil.",
      matchPercentage: "88% match",
      profileUrl: "perfil.html",
    },
    {
      name: "Javier López",
      jobTitle: "DevOps Engineer",
      experience: "5 años de experiencia en CI/CD y AWS.",
      matchPercentage: "87% match",
      profileUrl: "perfil.html",
    },
    {
      name: "Sofía Gómez",
      jobTitle: "Data Scientist",
      experience: "3 años de experiencia en análisis de datos.",
      matchPercentage: "85% match",
      profileUrl: "perfil.html",
    },
    {
      name: "Alejandro Díaz",
      jobTitle: "Systems Analyst",
      experience: "7 años de experiencia en análisis de sistemas.",
      matchPercentage: "83% match",
      profileUrl: "perfil.html",
    },
    {
      name: "Carmen Vega",
      jobTitle: "Project Manager",
      experience: "8 años de experiencia en gestión de proyectos.",
      matchPercentage: "80% match",
      profileUrl: "perfil.html",
    },
  ];

  return (
    <div className="relative w-full min-h-screen bg-black text-white">
      <ParticlesBackground />
      
      {/* Navbar */}
      <Navbar />

      {/* Contenedor de resultados con efecto glassmorphism */}
      <div className="max-w-7xl mx-auto p-8 relative z-10">
        {/* Título con efecto de gradiente */}
        <header className="text-center mb-12 mt-16">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-white to-blue-300 bg-clip-text text-transparent mb-4 animate-gradient">
            Candidatos Encontrados
          </h1>
          <p className="text-gray-400 text-lg">
            Descubre los mejores perfiles que coinciden con tu búsqueda
          </p>
        </header>

        {/* Contenedor de Cards con scroll personalizado y efectos de hover mejorados */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-h-[70vh] overflow-y-auto scrollbar-custom pb-10">
          {/* Reutilizando el componente CandidateCard */}
          {candidates.map((candidate, index) => (
            <CandidateCard key={index} candidate={candidate} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ResultsPage;