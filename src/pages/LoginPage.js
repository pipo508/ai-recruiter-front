import React, { useState } from "react";
import ParticlesBackground from "../components/ParticlesBackground";
import Navbar from "../components/Navbar";
import LoginForm from "../components/LOGIN/LoginForm";
import { loginUser } from "../services/api";

const LoginPage = () => {
  const [loading, setLoading] = useState(false);

  const handleLogin = async ({ username, password }) => {
    setLoading(true);
    try {
      const data = await loginUser(username, password);
      alert(`Bienvenido ${data.user.username}`);
      localStorage.setItem("token", data.token);
      // Redirige o actualiza estado según tu app
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
        <LoginForm onLogin={handleLogin} loading={loading} />
      </div>
    </div>
  );
};

export default LoginPage;
