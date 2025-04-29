import axios from 'axios';

// Création de l'instance Axios avec la configuration de base
export const API = axios.create({
  // Pour éviter le double préfixe /api/api, on utilise directement l'URL de base
  baseURL: process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': '*/*'
  }
});

// Intercepteur de requêtes - ajoute le token d'authentification aux en-têtes
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  const refreshToken = localStorage.getItem('refreshToken');
  
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  
  if (config.url.includes('/api/refresh-token') && refreshToken) {
    config.data = { refresh: refreshToken };
  }
  
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Intercepteur de réponses - gère les tokens et le rafraichissement automatique
API.interceptors.response.use(
  (response) => {
    // Extraction des données de la réponse (structure avec ou sans data imbriqué)
    const dataObj = response.data?.data || response.data;
    
    if (dataObj?.bearer) {
      localStorage.setItem('token', dataObj.bearer);
    }
    if (dataObj?.refresh) {
      localStorage.setItem('refreshToken', dataObj.refresh);
    }
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    const refreshToken = localStorage.getItem('refreshToken');
    
    // Tentative de rafraîchissement du token en cas d'erreur 401
    if (error.response?.status === 401 && 
        !originalRequest._retry && 
        refreshToken &&
        !originalRequest.url.includes('/api/refresh-token') &&
        !originalRequest.url.includes('/api/connexion')) {
      
      originalRequest._retry = true;
      
      try {
        const refreshResponse = await API.post('/api/refresh-token', { refresh: refreshToken });
        
        const dataObj = refreshResponse.data?.data || refreshResponse.data;
        
        localStorage.setItem('token', dataObj.bearer);
        localStorage.setItem('refreshToken', dataObj.refresh);
        
        originalRequest.headers.Authorization = `Bearer ${dataObj.bearer}`;
        return API(originalRequest);
      } catch (refreshError) {
        console.warn('Échec du rafraîchissement du token, redirection vers la page de connexion');
        await handleLogout();
        return Promise.reject(refreshError);
      }
    }
    
    // Gestion des différentes erreurs HTTP
    if (error.response) {
      switch (error.response.status) {
        case 401:
          console.warn('Accès non autorisé');
          if (!originalRequest._retry) {
            await handleLogout();
          }
          break;
        case 403:
          console.warn('Accès refusé');
          break;
        case 404:
          console.warn('Ressource non trouvée');
          break;
        case 500:
          console.error('Erreur serveur');
          break;
        default:
          console.error(`Erreur ${error.response.status}`);
      }
    } else if (error.request) {
      console.error('Pas de réponse du serveur');
    } else {
      console.error('Erreur de configuration de la requête');
    }
    
    return Promise.reject(error);
  }
);

/**
 * Fonction générique pour les requêtes API avec rafraîchissement automatique du token
 * @param {string} url - URL de l'endpoint
 * @param {string} method - Méthode HTTP (GET, POST, etc.)
 * @param {object} data - Données de la requête
 * @param {object} headers - En-têtes supplémentaires
 * @returns {Promise} - Réponse de l'API
 */
export const apiRequest = async (url, method = 'GET', data = null, headers = {}) => {
  try {
    // Assurer que l'URL commence par /api
    const apiUrl = url.startsWith('/api') ? url : `/api${url}`;
    
    // Log pour le débogage
    console.log(`Envoi requête ${method} à: ${apiUrl}`);
    if (data) console.log('Données:', data);
    
    const config = {
      method,
      url: apiUrl,
      data,
      headers: {
        ...headers,
        ...(data instanceof FormData ? {} : { 'Content-Type': 'application/json' })
      }
    };

    const response = await API(config);
    
    // Gestion des différentes structures de réponse
    const responseData = response.data?.data !== undefined ? response.data.data : response.data;
    
    // Vérification des erreurs dans la réponse
    if (response.data?.success === false) {
      throw new Error(response.data.message || "Erreur de serveur");
    }
    
    return responseData;
  } catch (error) {
    // Log détaillé pour faciliter le débogage
    console.error("API Error:", {
      url,
      method,
      data,
      errorStatus: error.response?.status,
      errorMessage: error.message || "Erreur inconnue",
      fullError: error.response?.data || error
    });
    
    // Extraction du message d'erreur
    const errorMessage = 
      error.response?.data?.message || 
      error.response?.data?.error ||
      error.message ||
      "Erreur de connexion au serveur";
    
    throw new Error(errorMessage);
  }
};

/**
 * Fonction de déconnexion - efface le stockage local et redirige vers la page de connexion
 */
export const handleLogout = async () => {
  try {
    const token = localStorage.getItem('token');
    if (token) {
      await apiRequest('/deconnexion', 'POST');
    }
  } catch (error) {
    console.error("Erreur de déconnexion:", error);
  } finally {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('email');
    localStorage.removeItem('role');
    
    window.location.href = '/login';
  }
};

/**
 * Fonction pour télécharger un document
 * @param {File} file - Fichier à télécharger
 * @param {string} title - Titre du document
 * @returns {Promise} - Réponse du téléchargement
 */
export const uploadDocument = async (file, title) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('title', title);

  const response = await apiRequest('/documents/upload', 'POST', formData);
  return response;
};

/**
 * Fonction auxiliaire pour décoder un JWT
 * @param {string} token - Token JWT
 * @returns {object|null} - Contenu décodé du token ou null
 */
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
    console.error('Erreur de décodage du token', e);
    return null;
  }
};

/**
 * Vérifier si le token est expiré
 * @param {string} token - Token JWT
 * @returns {boolean} - Vrai si le token est expiré
 */
export const isTokenExpired = (token) => {
  const decoded = decodeToken(token);
  if (!decoded?.exp) return true;
  return Date.now() >= decoded.exp * 1000;
};

/**
 * Initialiser le timer de rafraîchissement du token
 * Rafraîchit automatiquement le token avant expiration
 */
export const initTokenRefreshTimer = () => {
  const token = localStorage.getItem('token');
  if (!token) return;

  const decoded = decodeToken(token);
  if (!decoded?.exp) return;

  // Rafraîchir le token 1 minute avant expiration
  const expiresIn = (decoded.exp * 1000) - Date.now() - 60000;
  
  if (expiresIn > 0) {
    console.log(`Le token sera rafraîchi dans ${Math.round(expiresIn/1000)} secondes`);
    
    setTimeout(async () => {
      try {
        const refreshToken = localStorage.getItem('refreshToken');
        if (refreshToken) {
          const response = await API.post('/api/refresh-token', { refresh: refreshToken });
          
          // Extraction des données de la bonne structure
          const dataObj = response.data?.data || response.data;
          localStorage.setItem('token', dataObj.bearer);
          localStorage.setItem('refreshToken', dataObj.refresh);
          
          console.log('Token rafraîchi avec succès');
          initTokenRefreshTimer(); // Réinitialiser le timer
        }
      } catch (error) {
        console.error('Échec du rafraîchissement automatique', error);
        handleLogout();
      }
    }, expiresIn);
  } else {
    // Si le token est déjà expiré, déconnecter l'utilisateur
    console.warn('Token déjà expiré, déconnexion');
    handleLogout();
  }
};

/**
 * Vérifier l'état d'authentification au démarrage de l'application
 * @returns {boolean} - Vrai si l'utilisateur est authentifié
 */
export const checkAuthStatus = () => {
  const token = localStorage.getItem('token');
  const refreshToken = localStorage.getItem('refreshToken');
  
  if (!token && !refreshToken) {
    // Pas de tokens, l'utilisateur n'est pas connecté
    return false;
  }
  
  if (token && !isTokenExpired(token)) {
    // Token valide, initialiser le timer de rafraîchissement
    initTokenRefreshTimer();
    return true;
  }
  
  if (refreshToken) {
    // Token expiré mais refresh token disponible
    // Le rafraîchissement sera géré par l'intercepteur Axios
    return true;
  }
  
  // Aucun token valide
  return false;
};