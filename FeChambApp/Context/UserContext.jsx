import React, { createContext, useState, useEffect, useContext } from 'react';
import ServicesLogin from '../src/Services/ServicesLogin';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

   /* Obtener usuario en sesión usando el token */
  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem('access_token');
      if (!token) {
        setUser(null);
        setLoading(false);
        return;
      }

      try {
        const data = await ServicesLogin.getUserSession();
        setUser(data);
        setError(null);
      } catch (err) {
        console.error("Error al obtener usuario en sesión:", err);
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        setUser(null);
        setError("Sesión expirada o inválida.");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser, loading, error }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
