import axios from 'axios';

// Get CSRF token from cookies
function getCookie(name: string): string | null {
  let cookieValue = null;
  if (document.cookie && document.cookie !== '') {
    const cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim();
      if (cookie.substring(0, name.length + 1) === (name + '=')) {
        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
        break;
      }
    }
  }
  return cookieValue;
}

// Create axios instance with default config
const axiosInstance = axios.create({
  baseURL: 'http://localhost:8000',
  withCredentials: true, // Important for session cookies
  headers: {
    'Content-Type': 'application/json',
  }
});

// Fetch CSRF token on app load
let csrfToken: string | null = null;

// Function to fetch CSRF token
export async function fetchCSRFToken(): Promise<void> {
  try {
    const response = await axiosInstance.get('/api/csrf-token/');
    csrfToken = response.data.csrftoken;
    // Also set it in cookies
    document.cookie = `csrftoken=${csrfToken}; path=/; SameSite=Lax`;
  } catch (err) {
    console.error('Error fetching CSRF token:', err);
  }
}

// Request interceptor to add CSRF token
axiosInstance.interceptors.request.use(
  async (config) => {
    // Only add CSRF token for non-GET requests
    if (config.method !== 'get' && config.method !== 'GET') {
      // Try to get from cookie first
      let token = getCookie('csrftoken');
      
      // If not found, try to fetch it
      if (!token && !csrfToken) {
        await fetchCSRFToken();
        token = csrfToken || getCookie('csrftoken');
      } else if (!token) {
        token = csrfToken;
      }
      
      if (token) {
        config.headers['X-CSRFToken'] = token;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Initialize CSRF token on import
fetchCSRFToken();

export default axiosInstance;
