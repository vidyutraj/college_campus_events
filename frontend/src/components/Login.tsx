import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axiosInstance from '../utils/axiosConfig';
import { useAuth } from '../context/AuthContext';

const API_BASE_URL = '/api/auth';

function Login() {
  const navigate = useNavigate();
  const { login: authLogin } = useAuth();
  const [userType, setUserType] = useState<'student' | 'leader'>('student');
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

  const handleUserTypeChange = (type: 'student' | 'leader') => {
    setUserType(type);
    setError(null);
    setFormData({ username: '', password: '' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (userType === 'leader') {
        const response = await axiosInstance.post('/api/organizations/login/', formData);
        authLogin(
          { id: response.data.organization.id, username: response.data.organization.name },
          'organization_leader',
          response.data.organization
        );
        navigate('/leader/dashboard');
      } else {
        const response = await axiosInstance.post(`${API_BASE_URL}/login/`, formData);
        authLogin(response.data.user, response.data.user_type);
        navigate('/events');
      }
    } catch (err: any) {
      setError(err.response?.data?.non_field_errors?.[0] || 
               err.response?.data?.message || 
               err.response?.data?.username?.[0] ||
               'Invalid username or password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center px-5 py-12 bg-gray-50">
      <div className="bg-white border border-gray-200 rounded-lg shadow-md p-8 w-full max-w-md">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Sign In</h2>
        <p className="text-gray-600 mb-6">Choose your account type to continue</p>
        
        {/* User Type Selector */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <button
            type="button"
            className={`flex flex-col items-center p-4 border-2 rounded-lg transition-all ${
              userType === 'student' 
                ? 'border-primary bg-blue-50' 
                : 'border-gray-300 hover:border-gray-400'
            }`}
            onClick={() => handleUserTypeChange('student')}
          >
            <span className="text-3xl mb-2">🎓</span>
            <span className="font-medium text-gray-800">Student</span>
            <span className="text-xs text-gray-600 mt-1 text-center">Browse & RSVP to events</span>
          </button>
          <button
            type="button"
            className={`flex flex-col items-center p-4 border-2 rounded-lg transition-all ${
              userType === 'leader' 
                ? 'border-primary bg-blue-50' 
                : 'border-gray-300 hover:border-gray-400'
            }`}
            onClick={() => handleUserTypeChange('leader')}
          >
            <span className="text-3xl mb-2">🏢</span>
            <span className="font-medium text-gray-800">Event Leader</span>
            <span className="text-xs text-gray-600 mt-1 text-center">Manage your organization's events</span>
          </button>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded mb-4">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
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
              className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
            />
            {userType === 'leader' && (
              <small className="text-gray-500 text-xs mt-1 block">
                Use the organization credentials set during registration
              </small>
            )}
          </div>
          
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
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
              className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          
          {userType === 'leader' && (
            <div className="bg-blue-50 border border-blue-200 p-3 rounded text-sm text-blue-800">
              ℹ️ Use the organization username and password created during registration.
            </div>
          )}
          
          <button 
            type="submit" 
            disabled={loading} 
            className="w-full bg-primary text-white py-3 rounded font-medium hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Signing in...' : `Sign in as ${userType === 'student' ? 'Student' : 'Event Leader'}`}
          </button>
        </form>
        
        <div className="mt-6 text-center space-y-2 text-sm">
          {userType === 'student' && (
            <p className="text-gray-600">
              Don't have an account? <Link to="/register/student" className="text-primary hover:text-primary-dark font-medium">Sign up as a student</Link>
            </p>
          )}
          {userType === 'leader' && (
            <p className="text-gray-600">
              Don't have organization credentials? <Link to="/register/organization" className="text-primary hover:text-primary-dark font-medium">Register your organization</Link>
            </p>
          )}
          <p className="text-gray-600">
            <Link to="/" className="text-primary hover:text-primary-dark font-medium">Back to Home</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
