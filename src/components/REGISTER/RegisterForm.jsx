import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Importar useNavigate
import { PDF_PROCESSOR_CONSTANTS } from "../../constants/constants";
import { User, Mail, Lock, CheckCircle } from "lucide-react";
import SuccessRegistrationModal from "./SuccessRegistrationModal"; // Importar el modal

const RegisterForm = ({ onRegister, loading }) => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [registeredUsername, setRegisteredUsername] = useState("");
  const [passwordError, setPasswordError] = useState("");
  
  const navigate = useNavigate(); // Hook para navegación

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;
    
    // Limpiar error previo
    setPasswordError("");
    
    if (password !== passwordConfirm) {
      setPasswordError("Las contraseñas no coinciden");
      return;
    }
    
    try {
      // Llamar a la función de registro
      await onRegister({ username, email, password });
      
      // Si el registro es exitoso, mostrar el modal
      setRegisteredUsername(username);
      setShowSuccessModal(true);
      
      // Limpiar el formulario
      setUsername("");
      setEmail("");
      setPassword("");
      setPasswordConfirm("");
      
    } catch (error) {
      // El error se maneja en el componente padre
      console.error("Error en registro:", error);
    }
  };

  const handleAcceptAndRedirect = () => {
    setShowSuccessModal(false);
    navigate("/login"); // Redirigir automáticamente al login
  };

  return (
    <>
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-xl min-h-[580px] p-10 rounded-2xl bg-gradient-to-br from-[#0a0f1c] via-[#0d1728] to-[#07111d] border border-blue-800 shadow-lg ring-1 ring-blue-500/30 backdrop-blur-md space-y-8 flex flex-col justify-start"
      >
        <h2 className="text-white text-4xl font-bold text-center flex items-center justify-center gap-3">
          <CheckCircle className="w-7 h-7 text-blue-400" />
          Crear Cuenta
        </h2>

        <div className="space-y-6 mt-12">
          <div className="relative">
            <User className="absolute left-3 top-3.5 text-blue-400" />
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-lg bg-[#1b2737] text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:shadow-blue-500/40 shadow-inner"
              placeholder="Usuario"
              disabled={loading}
              required
            />
          </div>

          <div className="relative">
            <Mail className="absolute left-3 top-3.5 text-blue-400" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-lg bg-[#1b2737] text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:shadow-blue-500/40 shadow-inner"
              placeholder="Correo electrónico"
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

          <div className="relative">
            <Lock className="absolute left-3 top-3.5 text-blue-400" />
            <input
              type="password"
              value={passwordConfirm}
              onChange={(e) => setPasswordConfirm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-lg bg-[#1b2737] text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:shadow-blue-500/40 shadow-inner"
              placeholder="Confirmar contraseña"
              disabled={loading}
              required
            />
          </div>

          {/* Mostrar error de contraseña */}
          {passwordError && (
            <div className="text-red-400 text-sm text-center bg-red-500/10 border border-red-500/20 rounded-lg p-2">
              {passwordError}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded-lg font-semibold text-white transition duration-200 ${
              loading ? "bg-blue-400 cursor-not-allowed" : PDF_PROCESSOR_CONSTANTS.COLORS.PRIMARY
            } shadow-md hover:shadow-blue-500/30`}
          >
            {loading ? "Registrando..." : "Registrarse"}
          </button>
        </div>

        <p className="text-sm text-gray-400 text-center mt-6">
          ¿Ya tienes cuenta?{" "}
          <span 
            className="text-blue-400 hover:underline cursor-pointer"
            onClick={() => navigate("/login")}
          >
            Iniciar sesión
          </span>
        </p>
      </form>

      {/* Modal de éxito */}
      <SuccessRegistrationModal
        isOpen={showSuccessModal}
        onAccept={handleAcceptAndRedirect}
        username={registeredUsername}
      />
    </>
  );
};

export default RegisterForm;