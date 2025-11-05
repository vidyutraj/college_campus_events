import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axiosInstance from '../utils/axiosConfig';
import { useAuth } from '../context/AuthContext';
import './RegisterOrganization.css';

const API_BASE_URL = '/api/organizations';

function RegisterOrganization() {
  const navigate = useNavigate();
  const { login: authLogin, isAuthenticated, userType } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    username: '',
    password: '',
    password_confirm: '',
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  // If user is already logged in as an organization, redirect to dashboard
  React.useEffect(() => {
    if (isAuthenticated && userType === 'organization_leader') {
      navigate('/leader/dashboard');
    }
  }, [isAuthenticated, userType, navigate]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!formData.name.trim()) {
      setError('Organization name is required.');
      setLoading(false);
      return;
    }

    if (!formData.username.trim()) {
      setError('Organization username is required.');
      setLoading(false);
      return;
    }

    if (formData.username.length < 3) {
      setError('Username must be at least 3 characters long.');
      setLoading(false);
      return;
    }

    if (!formData.password) {
      setError('Organization password is required.');
      setLoading(false);
      return;
    }

    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters long.');
      setLoading(false);
      return;
    }

    if (formData.password !== formData.password_confirm) {
      setError('Passwords do not match.');
      setLoading(false);
      return;
    }

    try {
      const response = await axiosInstance.post(`${API_BASE_URL}/register/`, formData);
      
      // Show success message with credentials reminder
      alert(
        `${response.data.message || 'Organization registered successfully!'}\n\n` +
        `Organization Username: ${formData.username}\n` +
        `Please save these credentials securely!\n\n` +
        `You can now sign in as an event leader using these credentials.`
      );
      
      // Redirect to login page for organization login
      navigate('/login');
    } catch (err) {
      const errorData = err.response?.data;
      if (errorData) {
        // Handle field-specific errors
        const errorMessages = [];
        Object.keys(errorData).forEach(key => {
          if (Array.isArray(errorData[key])) {
            errorMessages.push(`${key}: ${errorData[key][0]}`);
          } else {
            errorMessages.push(errorData[key]);
          }
        });
        setError(errorMessages.join('. ') || 'Registration failed. Please try again.');
      } else {
        setError('Registration failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  if (userType === 'organization_leader') {
    return null; // Will redirect
  }

  return (
    <div className="register-org-container">
      <div className="register-org-card">
        <h2>Register Your Organization</h2>
        <p className="register-org-subtitle">
          Register your student organization or club to start posting events
        </p>
        <div className="auth-notice">
          <p>Register your student organization to start posting events.</p>
          <p>You'll create login credentials that organization admins can use to sign in and manage events.</p>
        </div>
        
        {error && <div className="error-message">{error}</div>}
        
        <form onSubmit={handleSubmit} className="register-org-form">
          <div className="form-group">
            <label htmlFor="name">Organization Name *</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="e.g., Computer Science Club"
              maxLength={200}
            />
            <small>This will be the official name of your organization</small>
          </div>

          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="5"
              placeholder="Optional: Tell us about your organization's mission, activities, and goals"
            />
            <small>This will help other students learn about your organization</small>
          </div>

          <div className="form-section-divider">
            <h3>Organization Login Credentials</h3>
            <p>These credentials will be used by organization admins to sign in and manage events.</p>
          </div>

          <div className="form-group">
            <label htmlFor="username">Organization Username *</label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
              minLength={3}
              maxLength={150}
              placeholder="e.g., csclub_admin"
            />
            <small>This will be the username for organization login (min 3 characters)</small>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="password">Organization Password *</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                minLength={8}
                placeholder="Enter password"
              />
              <small>Must be at least 8 characters</small>
            </div>
            
            <div className="form-group">
              <label htmlFor="password_confirm">Confirm Password *</label>
              <input
                type="password"
                id="password_confirm"
                name="password_confirm"
                value={formData.password_confirm}
                onChange={handleChange}
                required
                minLength={8}
                placeholder="Confirm password"
              />
            </div>
          </div>
          
          <div className="form-note">
            <p><strong>Important:</strong> Save these credentials securely. Organization admins will use these to sign in. 
            Your organization will need to be verified by site administrators before it can be publicly listed.</p>
          </div>
          
          <button type="submit" disabled={loading} className="btn btn-primary btn-full">
            {loading ? 'Registering...' : 'Register Organization'}
          </button>
        </form>
        
        <div className="register-org-footer">
          <p>
            Already have organization credentials? <Link to="/login">Sign in as Event Leader</Link>
          </p>
          <p>
            <Link to="/">Back to Home</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default RegisterOrganization;

