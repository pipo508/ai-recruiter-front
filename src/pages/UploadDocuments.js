import React from 'react';
import Navbar from '../components/Navbar';
import ParticlesBackground from '../components/ParticlesBackground';
import UploadForm from '../components/UPLOAD/UploadForm';

function UploadDocuments() {
  return (
    <div className="relative w-full h-screen bg-black text-white">
      <ParticlesBackground />
      <div className="relative z-10">
        <Navbar />
        <UploadForm/>

      </div>
    </div>
  );
}

export default UploadDocuments;