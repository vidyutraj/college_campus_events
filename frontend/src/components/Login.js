import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axiosInstance from '../utils/axiosConfig';
import { useAuth } from '../context/AuthContext';
import './Login.css';

const API_BASE_URL = '/api/auth';

function Login() {
  const navigate = useNavigate();
  const { login: authLogin } = useAuth();
  const [userType, setUserType] = useState('student'); // 'student' or 'leader'
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError(null);
  };

  const handleUserTypeChange = (type) => {
    setUserType(type);
    setError(null);
    setFormData({ username: '', password: '' }); // Clear form when switching
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (userType === 'leader') {
        // Use organization login endpoint
        const response = await axiosInstance.post('/api/organizations/login/', formData);
        authLogin(
          { username: response.data.organization.name },
          'organization_leader',
          response.data.organization
        );
        navigate('/leader/dashboard');
      } else {
        // Use regular user login
        const response = await axiosInstance.post(`${API_BASE_URL}/login/`, formData);
        authLogin(response.data.user, response.data.user_type);
        navigate('/events');
      }
    } catch (err) {
      setError(err.response?.data?.non_field_errors?.[0] || 
               err.response?.data?.message || 
               err.response?.data?.username?.[0] ||
               'Invalid username or password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2>Sign In</h2>
        <p className="login-subtitle">Choose your account type to continue</p>
        
        {/* User Type Selector */}
        <div className="user-type-selector">
          <button
            type="button"
            className={`user-type-btn ${userType === 'student' ? 'active' : ''}`}
            onClick={() => handleUserTypeChange('student')}
          >
            <span className="user-type-icon">🎓</span>
            <span className="user-type-label">Student</span>
            <span className="user-type-desc">Browse & RSVP to events</span>
          </button>
          <button
            type="button"
            className={`user-type-btn ${userType === 'leader' ? 'active' : ''}`}
            onClick={() => handleUserTypeChange('leader')}
          >
            <span className="user-type-icon">🏢</span>
            <span className="user-type-label">Event Leader</span>
            <span className="user-type-desc">Manage your organization's events</span>
          </button>
        </div>

        {error && <div className="error-message">{error}</div>}
        
        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="username">
              {userType === 'leader' ? 'Organization Username' : 'Username'}
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
              autoComplete="username"
              placeholder={userType === 'leader' ? 'Enter organization username' : 'Enter your username'}
            />
            {userType === 'leader' && (
              <small>Use the organization credentials set during registration</small>
            )}
          </div>
          
          <div className="form-group">
            <label htmlFor="password">
              {userType === 'leader' ? 'Organization Password' : 'Password'}
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              autoComplete="current-password"
              placeholder={userType === 'leader' ? 'Enter organization password' : 'Enter your password'}
            />
          </div>
          
          {userType === 'leader' && (
            <div className="login-info">
              <p>ℹ️ Use the organization username and password created during registration.</p>
            </div>
          )}
          
          <button type="submit" disabled={loading} className="btn btn-primary btn-full">
            {loading ? 'Signing in...' : `Sign in as ${userType === 'student' ? 'Student' : 'Event Leader'}`}
          </button>
        </form>
        
        <div className="login-footer">
          {userType === 'student' && (
            <p>
              Don't have an account? <Link to="/register/student">Sign up as a student</Link>
            </p>
          )}
          {userType === 'leader' && (
            <p>
              Don't have organization credentials? <Link to="/register/organization">Register your organization</Link>
            </p>
          )}
          <p>
            <Link to="/">Back to Home</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
