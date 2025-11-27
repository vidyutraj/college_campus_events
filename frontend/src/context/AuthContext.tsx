import { createContext, useState, useContext, useEffect } from 'react';
import type { ReactNode } from 'react';
import axiosInstance from '../utils/axiosConfig';
import type { Organization, User } from '../types';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (userData: User, organizationsData?: Organization[]) => void;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
  isAuthenticated: boolean;
  organizations: Organization[]; // New field for organization name
}

const AuthContext = createContext<AuthContextType | null>(null);

const API_BASE_URL = '/api/auth';

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const userResponse = await axiosInstance.get(`/api/auth/check/`).catch(() => ({ data: { is_authenticated: false } }));

      if (userResponse.data.is_authenticated) {
        setUser(userResponse.data.user);
        setOrganizations(userResponse.data.organizations);
      } else {
        setUser(null);
        setOrganizations([]);
      }
    } catch (err) {
      console.error('Error checking auth:', err);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = (userData: User, organizations?: Organization[]) => {
    setUser(userData);
    setOrganizations(organizations ?? []);
  };

  const logout = async () => {
    try {
      await axiosInstance.post(`${API_BASE_URL}/logout/`, {}).catch(() => {});
    } catch (err) {
      console.error('Error logging out:', err);
    } finally {
      setUser(null);
    }
  };

  const value: AuthContextType = {
    user,
    loading,
    login,
    logout,
    checkAuth,
    isAuthenticated: !!user,
    organizations: organizations,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
