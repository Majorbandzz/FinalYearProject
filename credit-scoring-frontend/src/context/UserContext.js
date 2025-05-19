import { createContext, useContext, useState, useEffect } from 'react';
import axios from '../api';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const refreshUser = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get('/auth/user');
      const userData = response.data;
      console.log('Fetched user:', userData);
      
      const user = userData.user || userData;
      setUser(user);
    } catch (err) {
      console.error('Failed to refresh user:', err);
      if (err.response?.status === 401) {
        setUser(null);
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshUser();
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser, refreshUser, isLoading }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);