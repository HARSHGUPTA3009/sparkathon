
import React, { createContext, useContext, useState, useEffect } from 'react';

interface UserAuthUser {
  id: string;
  username: string;
  email: string;
  role: 'user';
}

interface UserAuthContextType {
  user: UserAuthUser | null;
  login: (username: string, password: string) => boolean;
  logout: () => void;
  createPassword: (password: string) => void;
  isAuthenticated: boolean;
  hasPassword: boolean;
}

const UserAuthContext = createContext<UserAuthContextType | undefined>(undefined);

// Hardcoded users
const HARDCODED_USERS = [
  { id: 'user1', username: 'userA', email: 'userA@ecomess.com', password: '12345', role: 'user' as const },
  { id: 'user2', username: 'userB', email: 'userB@ecomess.com', password: '12345', role: 'user' as const },
  { id: 'user3', username: 'userC', email: 'userC@ecomess.com', password: '12345', role: 'user' as const },
];

export const UserAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserAuthUser | null>(null);
  const [hasPassword, setHasPassword] = useState(true); // Always true since we have hardcoded users

  useEffect(() => {
    // Check for existing session in localStorage
    const savedUser = localStorage.getItem('ecomess-user-auth');
    if (savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser);
        setUser(parsedUser);
      } catch (error) {
        console.error('Error parsing saved user:', error);
        localStorage.removeItem('ecomess-user-auth');
      }
    }
  }, []);

  const login = (usernameOrEmail: string, password: string): boolean => {
    console.log('Attempting login with:', usernameOrEmail, password);
    
    const foundUser = HARDCODED_USERS.find(u => 
      (u.username === usernameOrEmail || u.email === usernameOrEmail) && u.password === password
    );
    
    console.log('Found user:', foundUser);
    
    if (!foundUser) {
      return false;
    }

    const authUser: UserAuthUser = {
      id: foundUser.id,
      username: foundUser.username,
      email: foundUser.email,
      role: foundUser.role
    };

    setUser(authUser);
    localStorage.setItem('ecomess-user-auth', JSON.stringify(authUser));
    
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('ecomess-user-auth');
  };

  const createPassword = (password: string) => {
    // This is a placeholder for the password creation flow
    // Since we're using hardcoded users, this doesn't actually create anything
    console.log('Password creation called with:', password);
  };

  return (
    <UserAuthContext.Provider value={{
      user,
      login,
      logout,
      createPassword,
      isAuthenticated: !!user,
      hasPassword,
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
