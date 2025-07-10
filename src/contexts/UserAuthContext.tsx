
import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  username: string;
}

interface UserAuthContextType {
  user: User | null;
  login: (username: string, password: string) => boolean;
  logout: () => void;
  isAuthenticated: boolean;
  createPassword: (password: string) => void;
  hasPassword: boolean;
}

const UserAuthContext = createContext<UserAuthContextType | undefined>(undefined);

const DEMO_USER = {
  username: 'user1',
  password: 'anshubhess'
};

export const UserAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [hasPassword, setHasPassword] = useState(false);

  useEffect(() => {
    const savedUser = localStorage.getItem('mess-user');
    const savedPassword = localStorage.getItem('mess-user-password');
    
    if (savedUser && savedPassword) {
      setUser(JSON.parse(savedUser));
      setIsAuthenticated(true);
      setHasPassword(true);
    } else if (savedPassword) {
      setHasPassword(true);
    }
  }, []);

  const createPassword = (password: string) => {
    localStorage.setItem('mess-user-password', password);
    setHasPassword(true);
  };

  const login = (username: string, password: string): boolean => {
    const savedPassword = localStorage.getItem('mess-user-password');
    
    if (username === DEMO_USER.username && 
        (password === DEMO_USER.password || password === savedPassword)) {
      const userData = { username };
      setUser(userData);
      setIsAuthenticated(true);
      localStorage.setItem('mess-user', JSON.stringify(userData));
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('mess-user');
  };

  return (
    <UserAuthContext.Provider value={{ 
      user, 
      login, 
      logout, 
      isAuthenticated, 
      createPassword, 
      hasPassword 
    }}>
      {children}
    </UserAuthContext.Provider>
  );
};

export const useUserAuth = () => {
  const context = useContext(UserAuthContext);
  if (context === undefined) {
    throw new Error('useUserAuth must be used within a UserAuthProvider');
  }
  return context;
};
