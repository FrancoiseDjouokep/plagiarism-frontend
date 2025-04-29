import React, { createContext, useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  isTokenExpired, 
  decodeToken, 
  initTokenRefreshTimer, 
  apiRequest 
} from '../utils/api';

// Création du contexte d'authentification
const AuthContext = createContext();

// Hook personnalisé pour utiliser le contexte d'authentification
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Fonction pour rafraîchir le token
  const refreshToken = async () => {
    try {
      const refresh = localStorage.getItem('refreshToken');
      if (!refresh) throw new Error("Pas de token de rafraîchissement");
      
      const response = await apiRequest('/refresh-token', 'POST', {
        refresh: refresh
      });
      
      // Extraction des données
      const token = response.bearer || (response.data && response.data.bearer);
      const newRefresh = response.refresh || (response.data && response.data.refresh);
      
      if (!token || !newRefresh) {
        throw new Error("Format de réponse de rafraîchissement invalide");
      }
      
      localStorage.setItem('token', token);
      localStorage.setItem('refreshToken', newRefresh);
      
      return true;
    } catch (err) {
      console.error('Échec du rafraîchissement du token:', err);
      throw err;
    }
  };

  // Fonction de connexion
  const login = async (username, password) => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await apiRequest('/connexion', 'POST', { 
        username, 
        password 
      });
      
      // Extraction des données
      const token = data.bearer || (data.data && data.data.bearer);
      const refresh = data.refresh || (data.data && data.data.refresh);
      const role = data.role || (data.data && data.data.role);
      
      if (!token || !refresh) {
        throw new Error("Format de réponse d'authentification invalide");
      }
      
      // Stockage des informations d'authentification
      localStorage.setItem('token', token);
      localStorage.setItem('refreshToken', refresh);
      localStorage.setItem('email', username);
      
      if (role) {
        localStorage.setItem('role', role);
        setUserRole(role);
      }
      
      // Extraction des informations utilisateur du token
      const decoded = decodeToken(token);
      setCurrentUser(username || decoded?.sub);
      
      // Initialisation du timer de rafraîchissement
      initTokenRefreshTimer();
      
      return { success: true };
    } catch (err) {
      setError(err.message || "Échec de la connexion");
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  // Fonction de déconnexion
  const logout = async () => {
    setLoading(true);
    try {
      // Appel de l'API de déconnexion si l'utilisateur est connecté
      const token = localStorage.getItem('token');
      if (token) {
        await apiRequest('/deconnexion', 'POST');
      }
    } catch (err) {
      console.error('Erreur lors de la déconnexion:', err);
    } finally {
      // Nettoyage du stockage local
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('email');
      localStorage.removeItem('role');
      
      // Réinitialisation de l'état
      setCurrentUser(null);
      setUserRole(null);
      setLoading(false);
      
      // Redirection vers la page de connexion
      navigate('/login');
    }
  };

  // Vérification de l'état d'authentification au chargement
  useEffect(() => {
    const checkAuth = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('token');
        const email = localStorage.getItem('email');
        const role = localStorage.getItem('role');
        
        if (!token) {
          setCurrentUser(null);
          setUserRole(null);
          setLoading(false);
          return;
        }
        
        // Vérification si le token est expiré
        if (isTokenExpired(token)) {
          const refreshTokenValue = localStorage.getItem('refreshToken');
          if (!refreshTokenValue) {
            // Pas de refresh token, déconnexion nécessaire
            logout();
            return;
          }
          
          try {
            // Tentative de rafraîchissement du token
            await refreshToken();
          } catch (refreshError) {
            // Échec du rafraîchissement, déconnexion
            console.error('Échec du rafraîchissement du token:', refreshError);
            logout();
            return;
          }
        }
        
        // Token valide, initialisation des données utilisateur
        const decoded = decodeToken(token);
        setCurrentUser(email || decoded?.sub || null);
        setUserRole(role || decoded?.role || null);
        
        // Initialisation du timer de rafraîchissement automatique
        initTokenRefreshTimer();
      } catch (err) {
        console.error('Erreur de vérification d\'authentification:', err);
        setError(err.message);
        setCurrentUser(null);
        setUserRole(null);
      } finally {
        setLoading(false);
      }
    };
    
    checkAuth();
  }, [navigate]);

  // Vérification si l'utilisateur est autorisé selon son rôle
  const isAuthorized = (requiredRoles = []) => {
    if (requiredRoles.length === 0) return !!currentUser;
    return currentUser && requiredRoles.includes(userRole);
  };

  // Valeur du contexte
  const value = {
    currentUser,
    userRole,
    loading,
    error,
    isAuthenticated: !!currentUser,
    login,
    logout,
    refreshToken,
    isAuthorized
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;