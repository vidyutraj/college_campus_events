import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axiosInstance from '../utils/axiosConfig';
import { useAuth } from '../context/AuthContext';

const API_BASE_URL = '/api/organizations';

function RegisterOrganization() {
  const navigate = useNavigate();
  const { isAuthenticated, userType } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    user_username: '',
    user_email: '',
    user_password: '',
    user_password_confirm: '',
    user_first_name: '',
    user_last_name: '',
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated && userType === 'organization_leader') {
      navigate('/leader/dashboard');
    }
  }, [isAuthenticated, userType, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!formData.name.trim()) {
      setError('Organization name is required.');
      setLoading(false);
      return;
    }

    if (!formData.user_username.trim()) {
      setError('User username is required.');
      setLoading(false);
      return;
    }

    if (formData.user_username.length < 3) {
      setError('User username must be at least 3 characters long.');
      setLoading(false);
      return;
    }

    if (!formData.user_email.trim()) {
      setError('User email is required.');
      setLoading(false);
      return;
    }

    if (!/\S+@\S+\.\S+/.test(formData.user_email)) {
      setError('Please enter a valid email address.');
      setLoading(false);
      return;
    }

    if (!formData.user_password) {
      setError('User password is required.');
      setLoading(false);
      return;
    }

    if (formData.user_password.length < 8) {
      setError('User password must be at least 8 characters long.');
      setLoading(false);
      return;
    }

    if (formData.user_password !== formData.user_password_confirm) {
      setError('User passwords do not match.');
      setLoading(false);
      return;
    }

    try {
      const response = await axiosInstance.post(`/api/organizations/register/`, formData);
      
      alert(
        `${response.data.message || 'Organization and user registered successfully!'}\n\n` +
        `User Username: ${formData.user_username}\n` +
        `Please sign in with your user credentials.`
      );
      
      navigate('/login'); // Navigate to regular user login
    } catch (err: any) {
      console.error(err);
      const errorData = err.response?.data;
      if (errorData) {
        const errorMessages: string[] = [];
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
    return null;
  }

  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center px-5 py-12 bg-gray-50">
      <div className="bg-white border border-gray-200 rounded-lg shadow-md p-8 w-full max-w-2xl">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Register Your Organization</h2>
        <p className="text-gray-600 mb-4">
          Register your student organization or club to start posting events
        </p>
        <div className="bg-blue-50 border border-blue-200 p-4 rounded mb-6 text-sm text-blue-800">
          <p className="mb-2">Register your student organization to start posting events.</p>
          <p>You'll create login credentials that organization admins can use to sign in and manage events.</p>
        </div>
        
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded mb-4">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
              Organization Name *
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="e.g., Computer Science Club"
              maxLength={200}
              className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <small className="text-gray-500 text-xs mt-1 block">
              This will be the official name of your organization
            </small>
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={5}
              placeholder="Optional: Tell us about your organization's mission, activities, and goals"
              className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <small className="text-gray-500 text-xs mt-1 block">
              This will help other students learn about your organization
            </small>
          </div>

          <div className="border-t border-gray-200 pt-4">
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Your User Account Details</h3>
            <p className="text-sm text-gray-600 mb-4">
              These credentials will be used to sign in. You will be automatically associated with this organization.
            </p>

            <div className="space-y-4">
              <div>
                <label htmlFor="user_username" className="block text-sm font-medium text-gray-700 mb-2">
                  Username *
                </label>
                <input
                  type="text"
                  id="user_username"
                  name="user_username"
                  value={formData.user_username}
                  onChange={handleChange}
                  required
                  minLength={3}
                  maxLength={150}
                  placeholder="e.g., org_admin_user"
                  className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <small className="text-gray-500 text-xs mt-1 block">
                  This will be your personal username (min 3 characters)
                </small>
              </div>

              <div>
                <label htmlFor="user_email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  id="user_email"
                  name="user_email"
                  value={formData.user_email}
                  onChange={handleChange}
                  required
                  placeholder="e.g., admin@myorg.com"
                  className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="user_first_name" className="block text-sm font-medium text-gray-700 mb-2">
                    First Name
                  </label>
                  <input
                    type="text"
                    id="user_first_name"
                    name="user_first_name"
                    value={formData.user_first_name}
                    onChange={handleChange}
                    placeholder="Optional"
                    maxLength={150}
                    className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div>
                  <label htmlFor="user_last_name" className="block text-sm font-medium text-gray-700 mb-2">
                    Last Name
                  </label>
                  <input
                    type="text"
                    id="user_last_name"
                    name="user_last_name"
                    value={formData.user_last_name}
                    onChange={handleChange}
                    placeholder="Optional"
                    maxLength={150}
                    className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="user_password" className="block text-sm font-medium text-gray-700 mb-2">
                    Password *
                  </label>
                  <input
                    type="password"
                    id="user_password"
                    name="user_password"
                    value={formData.user_password}
                    onChange={handleChange}
                    required
                    minLength={8}
                    placeholder="Enter password"
                    className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  <small className="text-gray-500 text-xs mt-1 block">Must be at least 8 characters</small>
                </div>
                
                <div>
                  <label htmlFor="user_password_confirm" className="block text-sm font-medium text-gray-700 mb-2">
                    Confirm Password *
                  </label>
                  <input
                    type="password"
                    id="user_password_confirm"
                    name="user_password_confirm"
                    value={formData.user_password_confirm}
                    onChange={handleChange}
                    required
                    minLength={8}
                    placeholder="Confirm password"
                    className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-yellow-50 border border-yellow-200 p-4 rounded text-sm text-yellow-800">
            <p><strong>Important:</strong> You will sign in with the user credentials you create above. Your organization will need to be verified by site administrators before it can be publicly listed.</p>
          </div>
          
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-white py-3 rounded font-medium hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Registering...' : 'Register Organization'}
          </button>
        </form>
        
        <div className="mt-6 text-center space-y-2 text-sm">
          <p className="text-gray-600">
            Already have an account? <Link to="/login" className="text-primary hover:text-primary-dark font-medium">Sign in</Link>
          </p>
          <p className="text-gray-600">
            <Link to="/" className="text-primary hover:text-primary-dark font-medium">Back to Home</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default RegisterOrganization;
