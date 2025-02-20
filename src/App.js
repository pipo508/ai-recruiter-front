// src/App.js
import React from 'react';
import MainSection from './components/SEARCH/MainSection';
import Navbar from './components/Navbar';
import ParticlesBackground from './components/SEARCH/ParticlesBackground';

function App() {
  return (
    <div className="relative w-full h-screen bg-black text-white">
      <ParticlesBackground />
      <div className="relative z-10">
        <Navbar />
        <MainSection />
      </div>
    </div>
  );
}

export default App;
