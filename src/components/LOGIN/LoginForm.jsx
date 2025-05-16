import React, { useState } from "react";
import { PDF_PROCESSOR_CONSTANTS } from "../../constants/constants";
import { LogIn, User, Lock } from "lucide-react";

const LoginForm = ({ onLogin, loading }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (loading) return; // evitar envíos múltiples
    onLogin({ username, password });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-xl min-h-[520px] p-10 rounded-2xl bg-gradient-to-br from-[#0a0f1c] via-[#0d1728] to-[#07111d] border border-blue-800 shadow-lg ring-1 ring-blue-500/30 backdrop-blur-md flex flex-col justify-start"
    >
      <h2 className="text-white text-4xl font-bold text-center flex items-center justify-center gap-3">
        <LogIn className="w-7 h-7 text-blue-400" />
        Iniciar Sesión
      </h2>

      <div className="space-y-6 mt-16">
        <div className="relative">
          <User className="absolute left-3 top-3.5 text-blue-400" />
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-lg bg-[#1b2737] text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:shadow-blue-500/40 shadow-inner"
            placeholder="Usuario o email"
            disabled={loading}
            required
          />
        </div>

        <div className="relative">
          <Lock className="absolute left-3 top-3.5 text-blue-400" />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-lg bg-[#1b2737] text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:shadow-blue-500/40 shadow-inner"
            placeholder="Contraseña"
            disabled={loading}
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-3 rounded-lg font-semibold text-white transition duration-200 ${
            loading ? "bg-blue-400 cursor-not-allowed" : PDF_PROCESSOR_CONSTANTS.COLORS.PRIMARY
          } shadow-md hover:shadow-blue-500/30`}
        >
          {loading ? "Cargando..." : "Iniciar Sesión"}
        </button>
      </div>

      <p className="text-sm text-gray-400 text-center mt-6">
        ¿No tienes cuenta?{" "}
        <span className="text-blue-400 hover:underline cursor-pointer">Regístrate</span>
      </p>
    </form>
  );
};

export default LoginForm;
