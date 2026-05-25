import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, AuthContextType, AuthResponse } from '../types';
import { authService } from '../services/api';

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const loadedUser = await authService.getProfile();
        setUser(loadedUser);
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  const register = async (
    fullName: string,
    email: string,
    password: string,
    confirmPassword: string
  ): Promise<AuthResponse> => {
    const response = await authService.register(fullName, email, password, confirmPassword);
    setUser(response.user);
    return response;
  };

  const login = async (email: string, password: string): Promise<AuthResponse> => {
    const response = await authService.login(email, password);
    setUser(response.user);
    return response;
  };

  const logout = async (): Promise<void> => {
    try {
      await authService.logout();
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      setUser(null);
    }
  };

  const value: AuthContextType = {
    user,
    loading,
    isAuthenticated: !!user,
    register,
    login,
    logout,
    setUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
