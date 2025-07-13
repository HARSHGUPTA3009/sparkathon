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
  { id: 'admin1', email: 'anshu@adminecomess.com', password: '12345678', username: 'anshu', role: 'admin' as const },
  { id: 'admin2', email: 'harsh@adminecomess.com', password: '12345678', username: 'harsh', role: 'admin' as const },
  { id: 'admin3', email: 'vishwas@adminecomess.com', password: '12345678', username: 'vishwas', role: 'admin' as const },
  { id: 'user1', email: 'userA@ecomess.com', password: '12345', username: 'userA', role: 'user' as const },
  { id: 'user2', email: 'userB@ecomess.com', password: '12345', username: 'userB', role: 'user' as const },
  { id: 'user3', email: 'userC@ecomess.com', password: '12345', username: 'userC', role: 'user' as const },
];

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // ✅ Always clear saved user on load
    localStorage.removeItem('ecomess-auth-user');
    setLoading(false);
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      const foundUser = HARDCODED_USERS.find(u => u.email === email && u.password === password);
      if (!foundUser) {
        setLoading(false);
        return { error: new Error('Invalid email or password') };
      }

      if (foundUser.role !== 'admin') {
        setLoading(false);
        return { error: new Error('Access denied. Admin credentials required.') };
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
      setLoading(false);

      return { error: null };
    } catch (error) {
      setLoading(false);
      return { error: error as Error };
    }
  };

  const signUp = async (email: string, password: string, username?: string) => {
    return { error: new Error('Registration is not available. Please contact administrator.') };
  };

  const updatePassword = async (newPassword: string) => {
    if (!user) {
      return { error: new Error('No user logged in') };
    }
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
