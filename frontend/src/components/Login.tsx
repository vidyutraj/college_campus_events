import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axiosInstance from '../utils/axiosConfig';
import { useAuth } from '../context/AuthContext';

const API_BASE_URL = '/api/auth';

function Login() {
  const navigate = useNavigate();
  const { login: authLogin } = useAuth();
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await axiosInstance.post(`/api/auth/login/`, formData);
      authLogin(response.data.user, response.data.user_type, response.data.organization);
      
      if (response.data.user_type === 'organization_leader') {
        navigate('/leader/dashboard');
      } else {
        navigate('/events');
      }
    } catch (err: unknown) {
      const errorResponse = (err as any).response;
      setError(errorResponse?.data?.non_field_errors?.[0] ||
               errorResponse?.data?.message ||
               errorResponse?.data?.username?.[0] ||
               'Invalid username or password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center px-5 py-12 bg-gray-50">
      <div className="bg-white border border-gray-200 rounded-lg shadow-md p-8 w-full max-w-md">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Sign In</h2>
        <p className="text-gray-600 mb-6">Sign in with your user account</p>
        
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded mb-4">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
              Username
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
              autoComplete="username"
              placeholder="Enter your username"
              className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              autoComplete="current-password"
              placeholder="Enter your password"
              className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-white py-3 rounded font-medium hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
        
        <div className="mt-6 text-center space-y-2 text-sm">
          <p className="text-gray-600">
            Don't have an account? <Link to="/register/student" className="text-primary hover:text-primary-dark font-medium">Sign up as a student</Link>
          </p>
          <p className="text-gray-600">
            Want to register an organization? <Link to="/register/organization" className="text-primary hover:text-primary-dark font-medium">Register your organization</Link>
          </p>
          <p className="text-gray-600">
            <Link to="/" className="text-primary hover:text-primary-dark font-medium">Back to Home</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
