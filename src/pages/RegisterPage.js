import React, { useState } from "react";
import ParticlesBackground from "../components/ParticlesBackground";
import Navbar from "../components/Navbar";
import RegisterForm from "../components/REGISTER/RegisterForm";
import { registerUser } from "../services/api"; // Importar la función de registro

const RegisterPage = () => {
  const [loading, setLoading] = useState(false);

  const handleRegister = async ({ username, email, password }) => {
  setLoading(true);
  try {
    // ✅ ESTO ES LO QUE FALTA - llamar a registerUser
    const result = await registerUser(username, email, password);
    console.log('✅ Registro exitoso:', result);
    return result; // Importante: devolver el resultado para que RegisterForm detecte el éxito
  } catch (error) {
    console.error('Error en registro:', error.message);
    throw error; // Re-lanzar el error para que RegisterForm lo maneje
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
