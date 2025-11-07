import { createContext, useState, useContext, useEffect } from 'react';
import type { ReactNode } from 'react';
import axiosInstance from '../utils/axiosConfig';
import type { Organization, User, UserType } from '../types';

interface AuthContextType {
  user: User | null;
  userType: UserType | null;
  loading: boolean;
  login: (userData: User, userTypeData: UserType, organizationData: Organization) => void;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
  isAuthenticated: boolean;
  isStudent: boolean;
  isOrganizationLeader: boolean;
  isSiteAdmin: boolean;
  organization: Organization | null; // New field for organization name
}

const AuthContext = createContext<AuthContextType | null>(null);

const API_BASE_URL = '/api/auth';

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [userType, setUserType] = useState<UserType | null>(null);
  const [organization, setOrganization] = useState<Organization | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const userResponse = await axiosInstance.get(`/api/auth/check/`).catch(() => ({ data: { is_authenticated: false } }));

      if (userResponse.data.is_authenticated) {
        setUser(userResponse.data.user);
        setUserType(userResponse.data.user_type);
        setOrganization(userResponse.data.organization);
      } else {
        setUser(null);
        setUserType(null);
        setOrganization(null);
      }
    } catch (err) {
      console.error('Error checking auth:', err);
      setUser(null);
      setUserType(null);
    } finally {
      setLoading(false);
    }
  };

  const login = (userData: User, userTypeData: UserType, organization: Organization) => {
    setUser(userData);
    setUserType(userTypeData);
    setOrganization(organization);
  };

  const logout = async () => {
    try {
      await axiosInstance.post(`${API_BASE_URL}/logout/`, {}).catch(() => {});
    } catch (err) {
      console.error('Error logging out:', err);
    } finally {
      setUser(null);
      setUserType(null);
    }
  };

  const value: AuthContextType = {
    user,
    userType,
    loading,
    login,
    logout,
    checkAuth,
    isAuthenticated: !!user,
    isStudent: userType === 'student',
    isOrganizationLeader: userType === 'organization_leader',
    isSiteAdmin: userType === 'site_admin',
    organization: organization,
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
