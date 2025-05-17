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
    const checkAuth = async () => {
      try {
        await refreshUser();
      } catch (err) {
        console.error('Error fetching user data:', err);
      }
    };
  
    checkAuth();
  }, []);
  

  return (
    <UserContext.Provider value={{ user, setUser, refreshUser, isLoading }}>
      {children}
    </UserContext.Provider>
  );
};
export const useUser = () => useContext(UserContext);
