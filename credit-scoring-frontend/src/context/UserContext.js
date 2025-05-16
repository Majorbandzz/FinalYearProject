// context/UserContext.js
import { createContext, useContext, useState, useEffect } from 'react';
import axios from '../api';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const refreshUser = async () => {
    try {
      const response = await axios.get('/auth/user');
      const userData = response.data;
      console.log('Fetched user:', userData);
      
      // If the response has a user object, use that, otherwise use the data directly
      const user = userData.user || userData;
      setUser(user);
    } catch (err) {
      console.error('Failed to refresh user:', err);
      setUser(null);
    }
  };

  useEffect(() => {
    refreshUser(); // Always try to fetch the current user on load
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser, refreshUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
