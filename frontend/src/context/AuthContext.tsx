import { createContext, useState, useContext, useEffect } from 'react';
import type { ReactNode } from 'react';
import axiosInstance from '../utils/axiosConfig';
import type { User, Organization, UserType } from '../types';

interface AuthContextType {
  user: User | null;
  userType: UserType | null;
  organization: Organization | null;
  loading: boolean;
  login: (userData: User, userTypeData: UserType, orgData?: Organization | null) => void;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
  isAuthenticated: boolean;
  isStudent: boolean;
  isOrganizationLeader: boolean;
  isSiteAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

const API_BASE_URL = '/api/auth';
const ORG_API_BASE_URL = '/api/organizations';

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [userType, setUserType] = useState<UserType | null>(null);
  const [organization, setOrganization] = useState<Organization | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is authenticated on mount
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      // Check both user auth and organization auth
      const [userResponse, orgResponse] = await Promise.all([
        axiosInstance.get(`${API_BASE_URL}/check/`).catch(() => ({ data: { is_authenticated: false } })),
        axiosInstance.get(`${ORG_API_BASE_URL}/check-auth/`).catch(() => ({ data: { is_authenticated: false } }))
      ]);
      
      if (orgResponse.data.is_authenticated) {
        // Organization login takes precedence
        setOrganization(orgResponse.data.organization);
        setUser({ id: 0, username: orgResponse.data.organization.name });
        setUserType('organization_leader');
      } else if (userResponse.data.is_authenticated) {
        // Regular user login
        setUser(userResponse.data.user);
        setUserType(userResponse.data.user_type);
        setOrganization(null);
      } else {
        setUser(null);
        setUserType(null);
        setOrganization(null);
      }
    } catch (err) {
      console.error('Error checking auth:', err);
      setUser(null);
      setUserType(null);
      setOrganization(null);
    } finally {
      setLoading(false);
    }
  };

  const login = (userData: User, userTypeData: UserType, orgData: Organization | null = null) => {
    setUser(userData);
    setUserType(userTypeData);
    setOrganization(orgData);
  };

  const logout = async () => {
    try {
      // Logout from both user and organization accounts
      await Promise.all([
        axiosInstance.post(`${API_BASE_URL}/logout/`, {}).catch(() => {}),
        axiosInstance.post(`${ORG_API_BASE_URL}/logout/`, {}).catch(() => {})
      ]);
    } catch (err) {
      console.error('Error logging out:', err);
    } finally {
      setUser(null);
      setUserType(null);
      setOrganization(null);
    }
  };

  const value: AuthContextType = {
    user,
    userType,
    organization,
    loading,
    login,
    logout,
    checkAuth,
    isAuthenticated: !!user || !!organization,
    isStudent: userType === 'student',
    isOrganizationLeader: userType === 'organization_leader',
    isSiteAdmin: userType === 'site_admin',
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
