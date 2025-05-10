import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

/**
 * Composant PrivateRoute pour protéger les routes nécessitant une authentification
 * @param {Object} props - Propriétés du composant
 * @param {React.ReactNode} props.children - Éléments enfants à rendre si l'utilisateur est authentifié
 * @returns {React.ReactElement} - Le composant enfant ou redirection vers la page de connexion
 */
const PrivateRoute = ({ children }) => {
 
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

 
  if (loading) {
    return (
      <div className="loading-container">
        <div className="loader"></div>
        <p>Chargement...</p>
      </div>
    );
  }

 
  if (!isAuthenticated) {
   
    localStorage.setItem('redirectAfterLogin', location.pathname);
    
    return <Navigate to="/login" replace />;
  }

 
  return children;
};

export default PrivateRoute;