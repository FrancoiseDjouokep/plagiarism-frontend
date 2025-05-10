import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { apiRequest } from '../utils/api';
import Navbar from '../components/Navbar';
import '../styles/Layout.css';
import '../styles/Login.css'; 

const Register = () => {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [prenom, setPrenom] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [passwordStrength, setPasswordStrength] = useState(0);
  
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

  const handleRegister = async (e) => {
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
      const requestData = {
        nom: name,
        prenom: prenom,
        email: email,
        password: password
      };
  
      console.log('Registration payload:', requestData);
  
      const response = await apiRequest('/inscription', 'POST', requestData);
  
      // Handle successful registration
      document.querySelector('.login-container').classList.add('success-animation');
      setTimeout(() => {
        navigate('/activation', { 
          state: { 
            email, 
            message: response.message || 'Inscription réussie !' 
          } 
        });
      }, 1000);
    } catch (error) {
      console.error('Registration Error:', error);
      
      // Extract the most specific error message available
      const errorMessage = error.response?.data?.message || 
                         error.response?.data?.error ||
                         error.message ||
                         'Erreur lors de l\'inscription';
      
      setError(errorMessage);
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

  return (
    <div className="layout">
      <Navbar />
      <div className="login-page">
        <div className="login-container register-container">
          <div className="login-header">
            <h2>Rejoindre <span className="logo-text">PLAGIA<span className="logo-accent">RIX</span></span></h2>
            <p className="login-subheader">Créez votre compte pour détecter le plagiat</p>
          </div>

          {error && <div className="error-message">{error}</div>}

          <form onSubmit={handleRegister} className="login-form">
            <div className="form-group">
              <label htmlFor="name">Nom</label>
              <div className="input-wrapper">
                <svg className="input-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 12C14.21 12 16 10.21 16 8C16 5.79 14.21 4 12 4C9.79 4 8 5.79 8 8C8 10.21 9.79 12 12 12ZM12 14C9.33 14 4 15.34 4 18V20H20V18C20 15.34 14.67 14 12 14Z" />
                </svg>
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Entrez votre nom "
                  required
                />
              </div>
            </div>
            <div className="form-group">
              <label htmlFor="name">Prenom</label>
              <div className="input-wrapper">
                <svg className="input-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 12C14.21 12 16 10.21 16 8C16 5.79 14.21 4 12 4C9.79 4 8 5.79 8 8C8 10.21 9.79 12 12 12ZM12 14C9.33 14 4 15.34 4 18V20H20V18C20 15.34 14.67 14 12 14Z" />
                </svg>
                <input
                  id="name"
                  type="text"
                  value={prenom}
                  onChange={(e) => setPrenom(e.target.value)}
                  placeholder="Entrez votre prenom"
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="email">Email</label>
              <div className="input-wrapper">
                <svg className="input-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M22 6C22 4.9 21.1 4 20 4H4C2.9 4 2 4.9 2 6V18C2 19.1 2.9 20 4 20H20C21.1 20 22 19.1 22 18V6ZM20 6L12 11L4 6H20ZM20 18H4V8L12 13L20 8V18Z" />
                </svg>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Entrez votre adresse email"
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="password">Mot de passe</label>
              <div className="input-wrapper">
                <svg className="input-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M18 8H17V6C17 3.24 14.76 1 12 1C9.24 1 7 3.24 7 6V8H6C4.9 8 4 8.9 4 10V20C4 21.1 4.9 22 6 22H18C19.1 22 20 21.1 20 20V10C20 8.9 19.1 8 18 8ZM12 17C10.9 17 10 16.1 10 15C10 13.9 10.9 13 12 13C13.1 13 14 13.9 14 15C14 16.1 13.1 17 12 17ZM15 8H9V6C9 4.34 10.34 3 12 3C13.66 3 15 4.34 15 6V8Z" />
                </svg>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={handlePasswordChange}
                  placeholder="Créez un mot de passe"
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
                  <path d="M18 8H17V6C17 3.24 14.76 1 12 1C9.24 1 7 3.24 7 6V8H6C4.9 8 4 8.9 4 10V20C4 21.1 4.9 22 6 22H18C19.1 22 20 21.1 20 20V10C20 8.9 19.1 8 18 8ZM12 17C10.9 17 10 16.1 10 15C10 13.9 10.9 13 12 13C13.1 13 14 13.9 14 15C14 16.1 13.1 17 12 17ZM15 8H9V6C9 4.34 10.34 3 12 3C13.66 3 15 4.34 15 6V8Z" />
                </svg>
                <input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirmez votre mot de passe"
                  required
                />
              </div>
            </div>

            <div className="terms-privacy">
              <input type="checkbox" id="terms" required />
              <label htmlFor="terms" className="checkbox-label">
                J'accepte les <Link to="/terms" target="_blank">conditions d'utilisation</Link> et la <Link to="/privacy" target="_blank">politique de confidentialité</Link>
              </label>
            </div>

            <button 
              type="submit" 
              className="login-button register-button"
              disabled={loading}
            >
              {loading ? (
                <span className="loader"></span>
              ) : (
                'Créer mon compte'
              )}
            </button>
          </form>

          <div className="divider">
            <span>ou</span>
          </div>

          <div className="register-link">
            <p>Vous avez déjà un compte? <Link to="/login">Se connecter</Link></p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;