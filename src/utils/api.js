import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:8080',
  headers: {
    'Content-Type': 'application/json',
  },
});


API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const apiRequest = async (url, method = 'GET', data = null, auth = false) => {
  try {
    const config = {
      method,
      url,
      data,
    };

    if (!auth) {
      delete config.headers?.Authorization;
    }

    const response = await API(config);
    return response.data; 
  } catch (error) {
    console.error("API error:", error);
    const message =
      error.response?.data?.message ||
      error.response?.data ||
      "Erreur lors de la requête";
    throw new Error(message);
  }
};


export const handleLogout = async () => {
    try {
      await apiRequest('/deconnexion', 'POST', null, true);

      localStorage.removeItem('token');
      localStorage.removeItem('email');
      localStorage.removeItem('role');
  
      window.location.href = '/login'; 
    } catch (error) {
      console.error("Erreur lors de la déconnexion :", error);
      alert("Échec de la déconnexion");
    }
  };
  export const uploadDocument = async (file, title) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('title', title);
  
    const token = localStorage.getItem('token');
  console.log("hello");
    const response = await axios.post('http://localhost:8080/api/documents/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        'Authorization': `Bearer ${token}`
      }
    });
  console.log(response);
    return response.data;
  };
  
