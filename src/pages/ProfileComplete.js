import React from 'react';
import Navbar from '../components/Navbar';
import CandidateProfile from '../components/RESULTS/CandidateProfile';

function ProfileComplete() {
  return (
    <div className="relative w-full h-screen text-white">
      {/* Fondo de partículas */}
      <div id="particles-js" className="absolute inset-0 z-0"></div>

      <div className="relative z-10">
        {/* Navbar */}
        <Navbar />

        {/* Contenedor con scroll personalizado */}
        <div className="pt-24 pb-12 px-6 max-w-screen-xl mx-auto overflow-y-auto scrollbar-custom h-full">
          <CandidateProfile />
        </div>
      </div>
    </div>
  );
}

export default ProfileComplete;
