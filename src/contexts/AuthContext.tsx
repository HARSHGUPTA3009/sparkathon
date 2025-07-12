
import React, { createContext, useContext, useState, useEffect } from 'react';

interface AuthUser {
  id: string;
  email: string;
  username?: string;
  role: 'admin' | 'user';
  avatar_url?: string;
  first_login?: boolean;
}

interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signUp: (email: string, password: string, username?: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
  updatePassword: (newPassword: string) => Promise<{ error: Error | null }>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Hardcoded users
const HARDCODED_USERS = [
  // Admin users
  { id: 'admin1', email: 'anshu@adminecomess.com', password: '12345678', username: 'anshu', role: 'admin' as const },
  { id: 'admin2', email: 'harsh@adminecomess.com', password: '12345678', username: 'harsh', role: 'admin' as const },
  { id: 'admin3', email: 'vishwas@adminecomess.com', password: '12345678', username: 'vishwas', role: 'admin' as const },
  // Regular users
  { id: 'user1', email: 'userA@ecomess.com', password: '12345', username: 'userA', role: 'user' as const },
  { id: 'user2', email: 'userB@ecomess.com', password: '12345', username: 'userB', role: 'user' as const },
  { id: 'user3', email: 'userC@ecomess.com', password: '12345', username: 'userC', role: 'user' as const },
];

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing session in localStorage
    const savedUser = localStorage.getItem('ecomess-auth-user');
    if (savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser);
        setUser(parsedUser);
      } catch (error) {
        console.error('Error parsing saved user:', error);
        localStorage.removeItem('ecomess-auth-user');
      }
    }
    setLoading(false);
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      const foundUser = HARDCODED_USERS.find(u => u.email === email && u.password === password);
      
      if (!foundUser) {
        return { error: new Error('Invalid email or password') };
      }

      const authUser: AuthUser = {
        id: foundUser.id,
        email: foundUser.email,
        username: foundUser.username,
        role: foundUser.role,
        first_login: false
      };

      setUser(authUser);
      localStorage.setItem('ecomess-auth-user', JSON.stringify(authUser));
      
      return { error: null };
    } catch (error) {
      return { error: error as Error };
    }
  };

  const signUp = async (email: string, password: string, username?: string) => {
    // For this hardcoded system, signup is not allowed
    return { error: new Error('Registration is not available. Please contact administrator.') };
  };

  const updatePassword = async (newPassword: string) => {
    if (!user) {
      return { error: new Error('No user logged in') };
    }

    // In a real system, you'd update the password in the backend
    // For this localStorage system, we'll just update the first_login flag
    const updatedUser = { ...user, first_login: false };
    setUser(updatedUser);
    localStorage.setItem('ecomess-auth-user', JSON.stringify(updatedUser));
    
    return { error: null };
  };

  const signOut = async () => {
    setUser(null);
    localStorage.removeItem('ecomess-auth-user');
  };

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      signIn,
      signUp,
      signOut,
      updatePassword,
      isAuthenticated: !!user,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
