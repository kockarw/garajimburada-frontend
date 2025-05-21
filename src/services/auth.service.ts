import api from './api';

// Auth yanıt tipleri
export interface AuthResponse {
  user: {
    id: string;
    username: string;
    email: string;
    role: string;
    is_admin: boolean;
    avatar_url: string | null;
    phone: string | null;
  };
  token: string;
  message: string;
}

// Login request için tip
export interface LoginRequest {
  email: string;
  password: string;
}

// Register request için tip
export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  phone: string;
}

/**
 * Kullanıcı giriş servisi
 */
export const login = async (credentials: LoginRequest): Promise<AuthResponse> => {
  const response = await api.post<AuthResponse>('/auth/login', credentials);
  
  // Token ve kullanıcı bilgilerini localStorage'a kaydet
  if (response.data.token) {
    localStorage.setItem('token', response.data.token);
    localStorage.setItem('user', JSON.stringify(response.data.user));
  }
  
  return response.data;
};

/**
 * Kullanıcı kayıt servisi
 */
export const register = async (userData: RegisterRequest): Promise<AuthResponse> => {
  const response = await api.post<AuthResponse>('/auth/register', userData);
  
  // Token ve kullanıcı bilgilerini localStorage'a kaydet
  if (response.data.token) {
    localStorage.setItem('token', response.data.token);
    localStorage.setItem('user', JSON.stringify(response.data.user));
  }
  
  return response.data;
};

/**
 * Kullanıcı çıkış servisi
 */
export const logout = (): void => {
  // Token ve kullanıcı bilgilerini localStorage'dan sil
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

/**
 * Mevcut kullanıcı bilgilerini getir
 */
export const getCurrentUser = async (): Promise<AuthResponse['user'] | null> => {
  try {
    const response = await api.get<{user: AuthResponse['user']}>('/auth/me');
    return response.data.user;
  } catch (error) {
    return null;
  }
};

/**
 * Kullanıcının giriş yapmış olup olmadığını kontrol et
 */
export const isAuthenticated = (): boolean => {
  const token = localStorage.getItem('token');
  return !!token;
};

const authService = {
  login,
  register,
  logout,
  getCurrentUser,
  isAuthenticated
};

export default authService; 