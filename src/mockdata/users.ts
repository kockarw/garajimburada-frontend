import { UserProfile } from './types';

// Mock users for authentication
export const mockUsers: UserProfile[] = [
  {
    id: '1',
    username: 'admin',
    email: 'admin@example.com',
    password: 'admin123',
    avatar_url: null,
    is_admin: true,
    role: 'admin'
  },
  {
    id: '2',
    username: 'user',
    email: 'user@example.com',
    password: 'user123',
    avatar_url: null,
    is_admin: false,
    role: 'user'
  },
  {
    id: '3',
    username: 'garage',
    email: 'garage@example.com',
    password: 'garage123',
    avatar_url: null,
    is_admin: false,
    role: 'garage_owner'
  }
];

// Function to get all users (simulating database query)
export const getAllUsers = (): UserProfile[] => {
  // In a real app, we would fetch users from database
  return [...mockUsers];
};

// Function to add a new user (simulating database insert)
export const addUser = (userData: Omit<UserProfile, 'id'>): UserProfile => {
  const newUser: UserProfile = {
    ...userData,
    id: `user_${Date.now()}`,
    role: userData.role || 'user' // Default role is user if not specified
  };
  
  mockUsers.push(newUser);
  return newUser;
};

// Function to find user by email (simulating database query)
export const findUserByEmail = (email: string): UserProfile | undefined => {
  return mockUsers.find(user => user.email === email);
};

// Function to authenticate user (simulating login)
export const authenticateUser = (email: string, password: string): UserProfile | null => {
  const user = mockUsers.find(user => 
    user.email === email && user.password === password
  );
  
  return user || null;
}; 