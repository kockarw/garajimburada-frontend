import React, { createContext, useContext, useState, useEffect } from 'react';
import { useToast } from './ToastContext';
import authService, { AuthResponse } from '../services/auth.service';

// Kullanıcı profili tipi
export interface UserProfile {
  id: string;
  username: string;
  email: string;
  role: string;
  is_admin: boolean;
  avatar_url: string | null;
  phone: string | null;
}

interface AuthContextType {
  user: UserProfile | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, username: string, phone: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Local storage key for persisting user session
const USER_STORAGE_KEY = 'user';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Initialize user state from localStorage if available
  const [user, setUser] = useState<UserProfile | null>(() => {
    const savedUser = localStorage.getItem(USER_STORAGE_KEY);
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();

  // Kullanıcı girişini kontrol et
  useEffect(() => {
    const verifyToken = async () => {
      if (authService.isAuthenticated()) {
        try {
          const currentUser = await authService.getCurrentUser();
          if (currentUser) {
            setUser(currentUser);
          }
        } catch (error) {
          // Token geçersiz olabilir, kullanıcı oturumunu sonlandır
          console.error('Token validation error:', error);
          authService.logout();
          setUser(null);
        }
      }
    };

    verifyToken();
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      
      const response = await authService.login({ email, password });
      setUser(response.user);
      
      showToast('Signed in successfully', 'success');
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to sign in';
      showToast(errorMessage, 'error');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string, password: string, username: string, phone: string) => {
    try {
      setLoading(true);
      
      // Log the data being sent to verify format
      console.log('Registration data:', { email, password, username, phone });
      
      const response = await authService.register({ email, password, username, phone });
      setUser(response.user);
      
      showToast('Account created successfully', 'success');
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to create account';
      showToast(errorMessage, 'error');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setLoading(true);
      
      authService.logout();
      setUser(null);
      
      showToast('Signed out successfully', 'success');
    } catch (error: any) {
      showToast('Failed to sign out', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signUp, signOut }}>
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