// src/pages/LoginPage.jsx
import React from 'react';
import ParticlesBackground from '../components/ParticlesBackground';
import Navbar from '../components/Navbar';
import LoginForm from '../components/LOGIN/LoginForm';
import { useAuth } from '../context/AuthContext'; // Asegúrate de que la ruta sea correcta

const LoginPage = () => {
  const { login, loading, error } = useAuth();

  const handleLogin = async ({ username, password }) => {
    try {
      await login({ username, password });
    } catch (err) {
      console.error('Error en LoginPage:', err);
    }
  };

  return (
    <div className="relative w-full h-screen bg-black text-white">
      <ParticlesBackground />
      <div className="relative z-10 flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] px-4">
        <Navbar />
        <LoginForm onLogin={handleLogin} loading={loading} />
        {error && (
          <p className="text-red-500 text-center mt-4">{error}</p>
        )}
      </div>
    </div>
  );
};

export default LoginPage;