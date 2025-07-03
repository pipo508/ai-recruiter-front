// src/context/AuthContext.js
import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { loginUser } from '../services/api'; // Importamos la función de api.js
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode'; // Cambio aquí: importación nombrada


const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const isTokenExpired = (token) => {
    try {
      const { exp } = jwtDecode(token);
      return exp < Date.now() / 1000;
    } catch {
      return true;
    }
  };

  const logout = useCallback(() => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  }, [navigate]);

  // Cargar usuario desde localStorage al montar el componente
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const storedToken = localStorage.getItem('token');

    if (storedUser && storedToken) {
      if (isTokenExpired(storedToken)) {
        logout(); // También redirige
      } else {
        setUser(JSON.parse(storedUser));
        setToken(storedToken);
        
        // Redirigir a la ruta guardada si existe
        const redirectPath = sessionStorage.getItem('pre_token_expired_path');
        if (redirectPath) {
          navigate(redirectPath);
          sessionStorage.removeItem('pre_token_expired_path');
        }
      }
    }
  }, [logout, navigate]); // Ahora incluimos las dependencias

  const login = async ({ username, password }) => {
    setLoading(true);
    setError(null);
    try {
      const data = await loginUser(username, password);
      // Asumimos que el backend devuelve { message, user, token }
      setUser(data.user);
      setToken(data.token);
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      
      // Redirigir a la ruta guardada o a la página principal
      const redirectPath = sessionStorage.getItem('pre_token_expired_path');
      navigate(redirectPath || '/');
      if (redirectPath) {
        sessionStorage.removeItem('pre_token_expired_path');
      }
      
      return data;
    } catch (err) {
      setError(err.message || 'Error al iniciar sesión');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, loading, error }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe usarse dentro de un AuthProvider');
  }
  return context;
};