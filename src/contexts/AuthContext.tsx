
import React, { createContext, useContext, useState, useEffect } from 'react';
import { AuthContextType, User } from '@/types';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock data pour la démo
const mockUsers: (User & { password: string })[] = [
  {
    id: '1',
    email: 'admin@institut.com',
    firstName: 'Marie',
    lastName: 'Dupont',
    phone: '0123456789',
    isAdmin: true,
    loyaltyPoints: 0,
    password: 'admin123'
  },
  {
    id: '2',
    email: 'client@example.com',
    firstName: 'Sophie',
    lastName: 'Martin',
    phone: '0987654321',
    isAdmin: false,
    loyaltyPoints: 85,
    password: 'client123'
  }
];

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simuler le chargement de la session
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    // Simulation d'une API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const foundUser = mockUsers.find(u => u.email === email && u.password === password);
    
    if (foundUser) {
      const { password: _, ...userWithoutPassword } = foundUser;
      setUser(userWithoutPassword);
      localStorage.setItem('user', JSON.stringify(userWithoutPassword));
      setIsLoading(false);
      return true;
    }
    
    setIsLoading(false);
    return false;
  };

  const register = async (userData: Omit<User, 'id' | 'isAdmin' | 'loyaltyPoints'> & { password: string }): Promise<boolean> => {
    setIsLoading(true);
    
    // Simulation d'une API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const newUser: User = {
      id: Date.now().toString(),
      ...userData,
      isAdmin: false,
      loyaltyPoints: 0
    };
    
    // En production, ceci serait sauvé en base de données
    mockUsers.push({ ...newUser, password: userData.password });
    
    const { password: _, ...userWithoutPassword } = newUser;
    setUser(userWithoutPassword);
    localStorage.setItem('user', JSON.stringify(userWithoutPassword));
    setIsLoading(false);
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, isLoading }}>
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
