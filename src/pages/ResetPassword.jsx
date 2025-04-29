import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { apiRequest } from '../utils/api';
import '../styles/Layout.css';
import '../styles/Auth.css';

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [tokenValid, setTokenValid] = useState(true);
  const [passwordStrength, setPasswordStrength] = useState(0);
  
  // Vérification de la validité du token au chargement
  useEffect(() => {
    const verifyToken = async () => {
      try {
        // Remplacez cette URL par votre endpoint de vérification de token
        await apiRequest(`/verify-reset-token/${token}`, 'GET');
      } catch (error) {
        setTokenValid(false);
        setError("Ce lien de réinitialisation est invalide ou a expiré. Veuillez demander un nouveau lien.");
      }
    };
    
    if (token) {
      verifyToken();
    } else {
      setTokenValid(false);
      setError("Lien de réinitialisation invalide.");
    }
  }, [token]);
  
  // Vérification de la force du mot de passe
  const checkPasswordStrength = (password) => {
    let strength = 0;
    
    if (password.length >= 8) strength += 1;
    if (/[A-Z]/.test(password)) strength += 1;
    if (/[0-9]/.test(password)) strength += 1;
    if (/[^A-Za-z0-9]/.test(password)) strength += 1;
    
    setPasswordStrength(strength);
    return strength;
  };

  const handlePasswordChange = (e) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    checkPasswordStrength(newPassword);
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    // Validation
    if (password !== confirmPassword) {
      setError('Les mots de passe ne correspondent pas');
      setLoading(false);
      return;
    }
    
    if (checkPasswordStrength(password) < 3) {
      setError('Votre mot de passe n\'est pas assez sécurisé');
      setLoading(false);
      return;
    }
    
    try {
      // Remplacez cette URL par votre endpoint de réinitialisation de mot de passe
      await apiRequest('/reset-password', 'POST', {
        token: token,
        password: password
      });
      
      setSuccess(true);
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (error) {
      console.error('Erreur:', error);
      setError(error.message || "Une erreur est survenue lors de la réinitialisation du mot de passe.");
    } finally {
      setLoading(false);
    }
  };
  
  // Rendu des indicateurs de force du mot de passe
  const renderPasswordStrength = () => {
    const levels = ['Faible', 'Moyen', 'Fort', 'Très fort'];
    const colors = ['#ef4444', '#f59e0b', '#84cc16', '#10b981'];
    
    return (
      <div className="password-strength">
        <div className="strength-bars">
          {[...Array(4)].map((_, index) => (
            <div 
              key={index} 
              className={`strength-bar ${index < passwordStrength ? 'active' : ''}`}
              style={{backgroundColor: index < passwordStrength ? colors[passwordStrength - 1] : undefined}}
            ></div>
          ))}
        </div>
        {password && (
          <span style={{color: colors[passwordStrength - 1 >= 0 ? passwordStrength - 1 : 0]}}>
            {password ? levels[passwordStrength - 1 >= 0 ? passwordStrength - 1 : 0] : ''}
          </span>
        )}
      </div>
    );
  };
  
  // Si le token est invalide, afficher message d'erreur
  if (!tokenValid) {
    return (
      <div className="layout">
        <Navbar />
        <div className="auth-page">
          <div className="auth-container">
            <div className="error-container">
              <div className="error-icon">
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM13 17H11V15H13V17ZM13 13H11V7H13V13Z" fill="#ef4444"/>
                </svg>
              </div>
              <h2 className="error-title">Lien invalide</h2>
              <p className="error-message">{error}</p>
              <div className="auth-links centered">
                <Link to="/reinitialiser" className="auth-button">
                  Demander un nouveau lien
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  // Si la réinitialisation a réussi
  if (success) {
    return (
      <div className="layout">
        <Navbar />
        <div className="auth-page">
          <div className="auth-container">
            <div className="success-container">
              <div className="success-icon">
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM10 17L5 12L6.41 10.59L10 14.17L17.59 6.58L19 8L10 17Z" fill="#10b981"/>
                </svg>
              </div>
              <h2 className="success-title">Mot de passe réinitialisé !</h2>
              <p className="success-message">Votre mot de passe a été réinitialisé avec succès.</p>
              <p className="success-info">
                Vous allez être redirigé vers la page de connexion dans quelques secondes...
              </p>
              <div className="auth-links centered">
                <Link to="/login" className="auth-button">
                  Se connecter maintenant
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="layout">
      <Navbar />
      <div className="auth-page">
        <div className="auth-container">
          <div className="auth-header">
            <h2>Réinitialisation du mot de passe</h2>
            <p className="auth-subheader">
              Créez un nouveau mot de passe pour votre compte
            </p>
          </div>

          {error && <div className="error-message">{error}</div>}

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label htmlFor="password">Nouveau mot de passe</label>
              <div className="input-wrapper">
                <svg className="input-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M18 8H17V6C17 3.24 14.76 1 12 1C9.24 1 7 3.24 7 6V8H6C4.9 8 4 8.9 4 10V20C4 21.1 4.9 22 6 22H18C19.1 22 20 21.1 20 20V10C20 8.9 19.1 8 18 8ZM12 17C10.9 17 10 16.1 10 15C10 13.9 10.9 13 12 13C13.1 13 14 13.9 14 15C14 16.1 13.1 17 12 17ZM15 8H9V6C9 4.34 10.34 3 12 3C13.66 3 15 4.34 15 6V8Z" fill="currentColor" />
                </svg>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={handlePasswordChange}
                  placeholder="Créez un nouveau mot de passe"
                  required
                />
              </div>
              {renderPasswordStrength()}
              <p className="password-hint">Le mot de passe doit contenir au moins 8 caractères, une majuscule, un chiffre et un caractère spécial.</p>
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword">Confirmer le mot de passe</label>
              <div className="input-wrapper">
                <svg className="input-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M18 8H17V6C17 3.24 14.76 1 12 1C9.24 1 7 3.24 7 6V8H6C4.9 8 4 8.9 4 10V20C4 21.1 4.9 22 6 22H18C19.1 22 20 21.1 20 20V10C20 8.9 19.1 8 18 8ZM12 17C10.9 17 10 16.1 10 15C10 13.9 10.9 13 12 13C13.1 13 14 13.9 14 15C14 16.1 13.1 17 12 17ZM15 8H9V6C9 4.34 10.34 3 12 3C13.66 3 15 4.34 15 6V8Z" fill="currentColor" />
                </svg>
                <input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirmez votre nouveau mot de passe"
                  required
                />
              </div>
            </div>

            <button 
              type="submit" 
              className="auth-button"
              disabled={loading}
            >
              {loading ? (
                <span className="loader"></span>
              ) : (
                'Réinitialiser le mot de passe'
              )}
            </button>
          </form>

          <div className="auth-links">
            <Link to="/login" className="back-link">
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="back-icon">
                <path d="M20 11H7.83L13.42 5.41L12 4L4 12L12 20L13.41 18.59L7.83 13H20V11Z" fill="currentColor"/>
              </svg>
              Retour à la connexion
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;