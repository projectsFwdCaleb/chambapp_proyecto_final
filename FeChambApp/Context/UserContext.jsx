import React, { createContext, useState, useEffect, useContext, useCallback } from 'react';
import ServicesLogin from '../src/Services/ServicesLogin';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  /**
   * Función para obtener el usuario en sesión
   * authFetch (usado internamente) intentará renovar el token si está expirado
   */
  const fetchUser = useCallback(async () => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }

    try {
      // getUserSession ahora usa authFetch, que renueva el token automáticamente
      const data = await ServicesLogin.getUserSession();
      setUser(data);
      setError(null);
    } catch (err) {
      console.error("Error al obtener usuario en sesión:", err);
      // Limpiar tokens y estado
      ServicesLogin.clearTokens();
      setUser(null);
      setError("Sesión expirada o inválida.");
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Función para forzar el refresh del usuario (útil después de actualizaciones)
   */
  const refreshUser = useCallback(async () => {
    setLoading(true);
    await fetchUser();
  }, [fetchUser]);

  /**
   * Función para cerrar sesión manualmente
   */
  const logout = useCallback(() => {
    ServicesLogin.clearTokens();
    setUser(null);
    setError(null);
  }, []);

  // Cargar usuario al montar el componente
  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  // Escuchar evento de sesión expirada (disparado por authFetch)
  useEffect(() => {
    const handleSessionExpired = () => {
      console.log("🔒 Sesión expirada detectada, cerrando sesión...");
      logout();
    };

    window.addEventListener('session-expired', handleSessionExpired);

    return () => {
      window.removeEventListener('session-expired', handleSessionExpired);
    };
  }, [logout]);

  return (
    <UserContext.Provider value={{
      user,
      setUser,
      loading,
      error,
      refreshUser,
      logout
    }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);

