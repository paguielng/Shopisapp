
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { apiService } from '@/services/api';

interface User {
  id: string;
  name: string;
  email: string;
  listsCount?: number;
  completedItemsCount?: number;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (name: string, email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStoredAuth();
  }, []);

  const loadStoredAuth = async () => {
    try {
      // Sur le web, nettoyer le stockage pour forcer une nouvelle connexion
      if (Platform.OS === 'web') {
        await AsyncStorage.removeItem('authToken');
        await AsyncStorage.removeItem('user');
        setLoading(false);
        return;
      }

      const storedToken = await AsyncStorage.getItem('authToken');
      const storedUser = await AsyncStorage.getItem('user');

      if (storedToken && storedUser) {
        // Vérifier si le token est valide avant de l'utiliser
        try {
          const userData = JSON.parse(storedUser);
          setToken(storedToken);
          setUser(userData);
          apiService.setToken(storedToken);
          
          // Refresh user data pour vérifier si le token est encore valide
          await refreshUser();
        } catch (parseError) {
          console.error('Error parsing stored user data:', parseError);
          // Nettoyer les données corrompues
          await AsyncStorage.removeItem('authToken');
          await AsyncStorage.removeItem('user');
        }
      }
    } catch (error) {
      console.error('Error loading stored auth:', error);
      // En cas d'erreur, nettoyer le stockage
      try {
        await AsyncStorage.removeItem('authToken');
        await AsyncStorage.removeItem('user');
      } catch (cleanupError) {
        console.error('Error cleaning up storage:', cleanupError);
      }
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const response = await apiService.login(email, password);
      
      if (response.error) {
        return { success: false, error: response.error };
      }

      if (response.data) {
        const { token: newToken, user: userData } = response.data;
        
        await AsyncStorage.setItem('authToken', newToken);
        await AsyncStorage.setItem('user', JSON.stringify(userData));
        
        setToken(newToken);
        setUser(userData);
        apiService.setToken(newToken);
        
        return { success: true };
      }

      return { success: false, error: 'Invalid response' };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: 'Login failed' };
    }
  };

  const register = async (name: string, email: string, password: string) => {
    try {
      const response = await apiService.register(name, email, password);
      
      if (response.error) {
        return { success: false, error: response.error };
      }

      if (response.data) {
        const { token: newToken, user: userData } = response.data;
        
        await AsyncStorage.setItem('authToken', newToken);
        await AsyncStorage.setItem('user', JSON.stringify(userData));
        
        setToken(newToken);
        setUser(userData);
        apiService.setToken(newToken);
        
        return { success: true };
      }

      return { success: false, error: 'Invalid response' };
    } catch (error) {
      console.error('Register error:', error);
      return { success: false, error: 'Registration failed' };
    }
  };

  const logout = async () => {
    try {
      await AsyncStorage.removeItem('authToken');
      await AsyncStorage.removeItem('user');
      
      setToken(null);
      setUser(null);
      apiService.clearToken();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const refreshUser = async () => {
    try {
      const response = await apiService.getUserProfile();
      
      if (response.data) {
        setUser(response.data);
        await AsyncStorage.setItem('user', JSON.stringify(response.data));
      } else if (response.error === 'Invalid token' || response.error === 'Unauthorized') {
        // Token invalide, déconnecter l'utilisateur
        await logout();
      }
    } catch (error) {
      console.error('Error refreshing user:', error);
      // En cas d'erreur réseau ou de token invalide, déconnecter
      await logout();
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        register,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
