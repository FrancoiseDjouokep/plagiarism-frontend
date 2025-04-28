import axios from 'axios';

export const API = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080',
  timeout: 10000, 
});


API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  const refreshToken = localStorage.getItem('refreshToken');
  
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  
  if (config.url.includes('/refresh-token') && refreshToken) {
    config.data = { refresh: refreshToken };
  }
  
  return config;
}, (error) => {
  return Promise.reject(error);
});

API.interceptors.response.use(
  (response) => {
    if (response.data?.bearer) {
      localStorage.setItem('token', response.data.bearer);
    }
    if (response.data?.refresh) {
      localStorage.setItem('refreshToken', response.data.refresh);
    }
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    const refreshToken = localStorage.getItem('refreshToken');
    
    if (error.response?.status === 401 && 
        !originalRequest._retry && 
        refreshToken &&
        !originalRequest.url.includes('/refresh-token') &&
        !originalRequest.url.includes('/login')) {
      
      originalRequest._retry = true;
      
      try {
        const refreshResponse = await API.post('/refresh-token', { refresh: refreshToken });
        
        localStorage.setItem('token', refreshResponse.data.bearer);
        localStorage.setItem('refreshToken', refreshResponse.data.refresh);
        
        originalRequest.headers.Authorization = `Bearer ${refreshResponse.data.bearer}`;
        return API(originalRequest);
      } catch (refreshError) {
        console.warn('Refresh token failed, redirecting to login');
        await handleLogout();
        return Promise.reject(refreshError);
      }
    }
    
    if (error.response) {
      switch (error.response.status) {
        case 401:
          console.warn('Unauthorized access');
          if (!originalRequest._retry) {
            await handleLogout();
          }
          break;
        case 403:
          console.warn('Access denied');
          break;
        case 404:
          console.warn('Resource not found');
          break;
        case 500:
          console.error('Server error');
          break;
        default:
          console.error(`Error ${error.response.status}`);
      }
    } else if (error.request) {
      console.error('No response from server');
    } else {
      console.error('Request configuration error');
    }
    
    return Promise.reject(error);
  }
);

/**
 * Generic API request function with automatic token refresh
 * @param {string} url - Endpoint URL
 * @param {string} method - HTTP method (GET, POST, etc.)
 * @param {object} data - Request payload
 * @param {object} headers - Additional headers
 * @returns {Promise} - API response
 */
export const apiRequest = async (url, method = 'GET', data = null, headers = {}) => {
  try {
    const config = {
      method,
      url,
      data,
      headers: {
        ...headers,
        ...(data instanceof FormData ? {} : { 'Content-Type': 'application/json' })
      }
    };

    const response = await API(config);
    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.message ||
      error.message ||
      "Request error";
    throw new Error(errorMessage);
  }
};

export const handleLogout = async () => {
  try {
    await apiRequest('/deconnexion', 'POST');
  } catch (error) {
    console.error("Logout error:", error);
  } finally {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('email');
    localStorage.removeItem('role');
    
    window.location.href = '/login';
  }
};

export const uploadDocument = async (file, title) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('title', title);

  const response = await API.post('/api/documents/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });

  return response.data;
};

// Helper function to decode JWT (install jwt-decode package)
export const decodeToken = (token) => {
  try {
    if (!token) return null;
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (e) {
    console.error('Error decoding token', e);
    return null;
  }
};

export const isTokenExpired = (token) => {
  const decoded = decodeToken(token);
  if (!decoded?.exp) return true;
  return Date.now() >= decoded.exp * 1000;
};

export const initTokenRefreshTimer = () => {
  const token = localStorage.getItem('token');
  if (!token) return;

  const decoded = decodeToken(token);
  if (!decoded?.exp) return;

  const expiresIn = (decoded.exp * 1000) - Date.now() - 60000;
  if (expiresIn > 0) {
    setTimeout(async () => {
      try {
        const refreshToken = localStorage.getItem('refreshToken');
        if (refreshToken) {
          const response = await API.post('/refresh', { refresh: refreshToken });
          localStorage.setItem('token', response.data.bearer);
          localStorage.setItem('refreshToken', response.data.refresh);
          initTokenRefreshTimer(); 
        }
      } catch (error) {
        console.error('Auto-refresh failed', error);
        handleLogout();
      }
    }, expiresIn);
  }
};

// Call this when your app initializes
initTokenRefreshTimer();