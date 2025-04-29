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
  // Utilisation du hook useAuth pour accéder au contexte d'authentification
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  // Afficher un indicateur de chargement pendant la vérification de l'authentification
  if (loading) {
    return (
      <div className="loading-container">
        <div className="loader"></div>
        <p>Chargement...</p>
      </div>
    );
  }

  // Si l'utilisateur n'est pas connecté, rediriger vers la page de connexion
  if (!isAuthenticated) {
    // Sauvegarder l'URL actuelle pour rediriger après connexion
    localStorage.setItem('redirectAfterLogin', location.pathname);
    
    return <Navigate to="/login" replace />;
  }

  // Utilisateur authentifié, afficher le contenu protégé
  return children;
};

export default PrivateRoute;