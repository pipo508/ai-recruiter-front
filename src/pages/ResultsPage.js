import React from "react";
import Navbar from "../components/Navbar";
import ParticlesBackground from "../components/SEARCH/ParticlesBackground";
import CandidateCard from "../components/RESULTS/Cards"; // Importando el componente

const ResultsPage = () => {
  // Definiendo un array con los datos de los candidatos
  const candidates = [
    {
      imageUrl: "https://randomuser.me/api/portraits/women/45.jpg",
      name: "Ana García",
      jobTitle: "Senior Frontend Developer",
      experience: "5 años de experiencia en React y TypeScript.",
      matchPercentage: "98% match",
      profileUrl: "perfil.html",
    },
    {
      imageUrl: "https://randomuser.me/api/portraits/men/32.jpg",
      name: "Carlos Ruiz",
      jobTitle: "Full Stack Developer",
      experience: "4 años de experiencia en Node.js y React.",
      matchPercentage: "95% match",
      profileUrl: "perfil.html",
    },
    {
      imageUrl: "https://randomuser.me/api/portraits/women/60.jpg",
      name: "Laura Martínez",
      jobTitle: "Backend Developer",
      experience: "3 años de experiencia en Node.js y AWS.",
      matchPercentage: "92% match",
      profileUrl: "perfil.html",
    },
    {
        imageUrl: "https://randomuser.me/api/portraits/women/45.jpg",
        name: "Ana García",
        jobTitle: "Senior Frontend Developer",
        experience: "5 años de experiencia en React y TypeScript.",
        matchPercentage: "98% match",
        profileUrl: "perfil.html",
      },
      {
        imageUrl: "https://randomuser.me/api/portraits/men/32.jpg",
        name: "Carlos Ruiz",
        jobTitle: "Full Stack Developer",
        experience: "4 años de experiencia en Node.js y React.",
        matchPercentage: "95% match",
        profileUrl: "perfil.html",
      },
      {
        imageUrl: "https://randomuser.me/api/portraits/women/60.jpg",
        name: "Laura Martínez",
        jobTitle: "Backend Developer",
        experience: "3 años de experiencia en Node.js y AWS.",
        matchPercentage: "92% match",
        profileUrl: "perfil.html",
      },
      {
        imageUrl: "https://randomuser.me/api/portraits/women/45.jpg",
        name: "Ana García",
        jobTitle: "Senior Frontend Developer",
        experience: "5 años de experiencia en React y TypeScript.",
        matchPercentage: "98% match",
        profileUrl: "perfil.html",
      },
      {
        imageUrl: "https://randomuser.me/api/portraits/men/32.jpg",
        name: "Carlos Ruiz",
        jobTitle: "Full Stack Developer",
        experience: "4 años de experiencia en Node.js y React.",
        matchPercentage: "95% match",
        profileUrl: "perfil.html",
      },
      {
        imageUrl: "https://randomuser.me/api/portraits/women/60.jpg",
        name: "Laura Martínez",
        jobTitle: "Backend Developer",
        experience: "3 años de experiencia en Node.js y AWS.",
        matchPercentage: "92% match",
        profileUrl: "perfil.html",
      },
      {
        imageUrl: "https://randomuser.me/api/portraits/women/45.jpg",
        name: "Ana García",
        jobTitle: "Senior Frontend Developer",
        experience: "5 años de experiencia en React y TypeScript.",
        matchPercentage: "98% match",
        profileUrl: "perfil.html",
      },
      {
        imageUrl: "https://randomuser.me/api/portraits/men/32.jpg",
        name: "Carlos Ruiz",
        jobTitle: "Full Stack Developer",
        experience: "4 años de experiencia en Node.js y React.",
        matchPercentage: "95% match",
        profileUrl: "perfil.html",
      },
      {
        imageUrl: "https://randomuser.me/api/portraits/women/60.jpg",
        name: "Laura Martínez",
        jobTitle: "Backend Developer",
        experience: "3 años de experiencia en Node.js y AWS.",
        matchPercentage: "92% match",
        profileUrl: "perfil.html",
      },
    // Puedes seguir agregando más candidatos aquí
  ];

  return (
    <div className="relative w-full h-screen bg-black text-white">
      <ParticlesBackground />
      
      {/* Navbar */}
      <Navbar />

      {/* Contenedor de resultados */}
      <div className="max-w-7xl mx-auto p-8 relative z-10">
        {/* Título */}
        <header className="text-center mb-12 mt-16">
          <h1 className="text-5xl font-bold text-white mb-4">Candidatos Encontrados</h1>
          <p className="text-gray-400 text-lg">Descubre los mejores perfiles que coinciden con tu búsqueda</p>
        </header>

        {/* Contenedor de Cards con scroll personalizado */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-h-[70vh] overflow-y-auto scrollbar-custom">
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
