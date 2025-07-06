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
  const [role, setRole] = useState('ETUDIANT'); // Nouvel état pour le rôle
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);


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
        password: password,
        role: role // Ajout du rôle dans les données envoyées
      };

      console.log('Registration payload:', requestData);

      const response = await apiRequest('/inscription', 'POST', requestData);

      // Animation de succès
      document.querySelector('.login-container').classList.add('success-animation');

      setTimeout(() => {
        if (role === 'ETUDIANT') {
          navigate('/activation', {
            state: {
              email,
              message: response.message || 'Inscription réussie !'
            }
          });
        } else {
          navigate('/validation', {
            state: {
              email,
              message: response.message || 'Inscription réussie !'
            }
          });
        }
      }, 1000);
    }
    catch (error) {
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
              style={{ backgroundColor: index < passwordStrength ? colors[passwordStrength - 1] : undefined }}
            ></div>
          ))}
        </div>
        {password && (
          <span style={{ color: colors[passwordStrength - 1 >= 0 ? passwordStrength - 1 : 0] }}>
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
                  placeholder="Entrez votre nom"
                  required
                />
              </div>
            </div>
            <div className="form-group">
              <label htmlFor="prenom">Prénom</label>
              <div className="input-wrapper">
                <svg className="input-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 12C14.21 12 16 10.21 16 8C16 5.79 14.21 4 12 4C9.79 4 8 5.79 8 8C8 10.21 9.79 12 12 12ZM12 14C9.33 14 4 15.34 4 18V20H20V18C20 15.34 14.67 14 12 14Z" />
                </svg>
                <input
                  id="prenom"
                  type="text"
                  value={prenom}
                  onChange={(e) => setPrenom(e.target.value)}
                  placeholder="Entrez votre prénom"
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

            {/* Nouveau champ pour la sélection du rôle */}
            <div className="form-group">
              <label htmlFor="role">Rôle</label>
              <div className="input-wrapper">
                <svg className="input-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.59 20 4 16.41 4 12C4 7.59 7.59 4 12 4C16.41 4 20 7.59 20 12C20 16.41 16.41 20 12 20Z" />
                  <path d="M12 6C9.79 6 8 7.79 8 10C8 12.21 9.79 14 12 14C14.21 14 16 12.21 16 10C16 7.79 14.21 6 12 6ZM12 12C10.9 12 10 11.1 10 10C10 8.9 10.9 8 12 8C13.1 8 14 8.9 14 10C14 11.1 13.1 12 12 12Z" />
                </svg>
                <select
                  id="role"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="role-select"
                >
                  <option value="ETUDIANT">Étudiant</option>
                  <option value="ENSEIGNANT">Enseignant</option>
                </select>
              </div>
              <p className="role-hint">
                {role === 'ETUDIANT'
                  ? "Les comptes étudiants sont activés immédiatement"
                  : "Les comptes enseignants nécessitent une validation administrative"}
              </p>
            </div>

            <div className="form-group">
              <label htmlFor="password">Mot de passe</label>
              <div className="input-wrapper">
                <svg className="input-icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M18 8H17V6C17 3.24 14.76 1 12 1C9.24 1 7 3.24 7 6V8H6C4.9 8 4 8.9 4 10V20C4 21.1 4.9 22 6 22H18C19.1 22 20 21.1 20 20V10C20 8.9 19.1 8 18 8ZM12 17C10.9 17 10 16.1 10 15C10 13.9 10.9 13 12 13C13.1 13 14 13.9 14 15C14 16.1 13.1 17 12 17ZM15 8H9V6C9 4.34 10.34 3 12 3C13.66 3 15 4.34 15 6V8Z" />
                </svg>
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={handlePasswordChange}
                  placeholder="Créez un mot de passe"
                  required
                />
                <span
                  className="toggle-password"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? "👁️" : "🙈"}
                </span>
              </div>

              {renderPasswordStrength()}
              <p className="password-hint">Le mot de passe doit contenir au moins 8 caractères, une majuscule, un chiffre et un caractère spécial.</p>
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword">Confirmer le mot de passe</label>
              <div className="input-wrapper">
                <svg className="input-icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M18 8H17V6C17 3.24 14.76 1 12 1C9.24 1 7 3.24 7 6V8H6C4.9 8 4 8.9 4 10V20C4 21.1 4.9 22 6 22H18C19.1 22 20 21.1 20 20V10C20 8.9 19.1 8 18 8ZM12 17C10.9 17 10 16.1 10 15C10 13.9 10.9 13 12 13C13.1 13 14 13.9 14 15C14 16.1 13.1 17 12 17ZM15 8H9V6C9 4.34 10.34 3 12 3C13.66 3 15 4.34 15 6V8Z" />
                </svg>
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirmez votre mot de passe"
                  required
                />
                <span
                  className="toggle-password"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? "👁️" : "🙈"}
                </span>
              </div>

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
          <div className="register-link">
            <p>Vous avez déjà un compte? <Link to="/login">Se connecter</Link></p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;