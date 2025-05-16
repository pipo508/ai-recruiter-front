import React, { useState } from "react";
import ParticlesBackground from "../components/ParticlesBackground";
import Navbar from "../components/Navbar";
import RegisterForm from "../components/REGISTER/RegisterForm";
import { registerUser } from "../services/api";

const RegisterPage = () => {
  const [loading, setLoading] = useState(false);

  const handleRegister = async ({ username, email, password }) => {
    setLoading(true);
    try {
      const data = await registerUser(username, email, password);
      alert(`Registro exitoso: ${data.user.username}`);
      // Aquí redirige o limpia formulario si quieres
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative w-full h-screen bg-black text-white">
      <ParticlesBackground />
      <div className="relative z-10 flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] px-4">
        <Navbar />
        <RegisterForm onRegister={handleRegister} loading={loading} />
      </div>
    </div>
  );
};

export default RegisterPage;
