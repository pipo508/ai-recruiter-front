// src/context/TokenExpirationContext.js
import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { useAuth } from './AuthContext';
import { jwtDecode } from 'jwt-decode';
import TokenExpiredModal from '../components/TokenExpiredModal';

const TokenExpirationContext = createContext();

export const TokenExpirationProvider = ({ children }) => {
  const { token, logout } = useAuth();
  const [modalOpen, setModalOpen] = useState(false);

  const checkTokenExpiration = useCallback(() => {
    if (!token) return;

    try {
      const decoded = jwtDecode(token);
      const currentTime = Date.now() / 1000;
      
      // Verificar si el token está expirado
      if (decoded.exp < currentTime) {
        console.log('Token expirado, mostrando modal...');
        
        // Guardar la ruta actual antes de hacer logout
        const currentPath = window.location.pathname;
        if (currentPath !== '/login' && currentPath !== '/register') {
          sessionStorage.setItem('pre_token_expired_path', currentPath);
        }
        
        // Mostrar modal en lugar de hacer logout inmediatamente
        setModalOpen(true);
      }
    } catch (error) {
      console.error('Error al verificar el token:', error);
      // Si hay error decodificando, mostrar modal también
      setModalOpen(true);
    }
  }, [token]); // Solo depende del token

  // Función para manejar cuando el usuario confirma en el modal
  const handleRelogin = useCallback(() => {
    setModalOpen(false);
    
    // Limpiar localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
    // Usar logout del AuthContext para mantener consistencia
    logout();
  }, [logout]);

  // Función para cerrar el modal sin hacer nada (opcional)
  const handleCloseModal = useCallback(() => {
    // Podrías permitir cerrar el modal pero el token seguirá expirado
    // Por seguridad, es mejor forzar el relogin
    handleRelogin();
  }, [handleRelogin]);

  useEffect(() => {
    // Verificar inmediatamente al montar
    checkTokenExpiration();

    // Configurar verificación periódica cada 30 segundos
    const interval = setInterval(checkTokenExpiration, 30000);

    return () => clearInterval(interval);
  }, [token, checkTokenExpiration]); // Agregamos checkTokenExpiration como dependencia

  // Escuchar eventos personalizados de token expirado (por si los lanzas desde otros lugares)
  useEffect(() => {
    const handleTokenExpiredEvent = () => {
      setModalOpen(true);
    };

    window.addEventListener('tokenExpired', handleTokenExpiredEvent);
    return () => {
      window.removeEventListener('tokenExpired', handleTokenExpiredEvent);
    };
  }, []);

  return (
    <TokenExpirationContext.Provider value={{ checkTokenExpiration }}>
      {children}
      <TokenExpiredModal
        isOpen={modalOpen}
        onConfirm={handleRelogin}
        onClose={handleCloseModal}
      />
    </TokenExpirationContext.Provider>
  );
};

export const useTokenExpiration = () => {
  const context = useContext(TokenExpirationContext);
  if (!context) {
    throw new Error('useTokenExpiration debe usarse dentro de un TokenExpirationProvider');
  }
  return context;
};