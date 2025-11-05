import React, { createContext, useState, useContext, useEffect } from 'react';
import axiosInstance from '../utils/axiosConfig';

const AuthContext = createContext(null);

const API_BASE_URL = '/api/auth';
const ORG_API_BASE_URL = '/api/organizations';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [userType, setUserType] = useState(null);
  const [organization, setOrganization] = useState(null);
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
        setUser({ username: orgResponse.data.organization.name });
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

  const login = (userData, userTypeData, orgData = null) => {
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

  const value = {
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

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

