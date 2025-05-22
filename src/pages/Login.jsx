import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { apiRequest, initTokenRefreshTimer, isTokenExpired } from '../utils/api';
import '../styles/Layout.css';
import '../styles/Login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  
  // Vérification si l'utilisateur est déjà connecté au chargement
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token && !isTokenExpired(token)) {
      const role = localStorage.getItem('role');
      redirectBasedOnRole(role);
    }
  }, [navigate]);

  const redirectBasedOnRole = (role) => {
    const normalizedRole = role?.trim().toUpperCase();
    if (normalizedRole === 'ETUDIANT') {
      navigate('/home-student');
    } 
    if (normalizedRole === 'ENSEIGNANT') {
      navigate('/home');
    } 
    if (normalizedRole === 'ADMIN') {
      navigate('/admin');
    } 
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const data = await apiRequest('/connexion', 'POST', {
        username: email,
        password: password,
      });

      const token = data.bearer || (data.data && data.data.bearer);
      const refresh = data.refresh || (data.data && data.data.refresh);
      const role = data.role || (data.data && data.data.role);

      if (!token || !refresh) {
        throw new Error("Format de réponse invalide");
      }

      localStorage.setItem('token', token);
      localStorage.setItem('refreshToken', refresh);
      localStorage.setItem('email', email);
      localStorage.setItem('role', role);

      initTokenRefreshTimer();
      redirectBasedOnRole(role);
      
    } catch (error) {
      console.error('Erreur de connexion:', error);
      setError(error.message || 'Une erreur est survenue lors de la connexion');
    } finally {
      setLoading(false);
    }
  };

  // Check for OAuth success/failure
  useEffect(() => {
    const query = new URLSearchParams(location.search);
    const error = query.get('error');
    
    if (error === 'oauth_failed') {
      setError('OAuth authentication failed. Please try again.');
    }
  }, [location]);

  const handleGoogleLogin = () => {
    // Clear any existing errors
    setError('');
    // Redirect to backend OAuth endpoint
    window.location.href = "http://localhost:8080/oauth2/authorization/google";
  };

  const handleGithubLogin = () => {
    setError('');
    window.location.href = "http://localhost:8080/oauth2/authorization/github";
  };

  // Check for cookies on initial load
  useEffect(() => {
    const checkAuth = () => {
      const token = getCookie('token');
      if (token && !isTokenExpired(token)) {
        // Store token in localStorage for React access
        localStorage.setItem('token', token);
        const refreshToken = getCookie('refresh');
        if (refreshToken) {
          localStorage.setItem('refreshToken', refreshToken);
        }
        navigate('/home');
      }
    };
    
    checkAuth();
  }, [navigate]);

  // Helper function to get cookies
  const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
  };

  return (
    <div className="layout">
      <Navbar />
      <div className="login-page">
        <div className="login-container">
          <div className="login-header">
            <h2>Connexion à <span className="logo-text">PLAGIA<span className="logo-accent">RIX</span></span></h2>
            <p className="login-subheader">Accédez à votre espace personnel</p>
          </div>

          {error && <div className="error-message">{error}</div>}

          <form onSubmit={handleLogin} className="login-form">
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
                  placeholder="Entrez votre email"
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
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Entrez votre mot de passe"
                  required
                />
              </div>
            </div>

            <div className="form-actions">
              <div className="remember-me">
                <input 
                  type="checkbox" 
                  id="remember"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)} 
                />
                <label htmlFor="remember" className="checkbox-label">Se souvenir de moi</label>
              </div>
              <Link to="/reinitialiser" className="forgot-password">
                Mot de passe oublié?
              </Link>
            </div>

            <button 
              type="submit" 
              className="login-button"
              disabled={loading}
            >
              {loading ? (
                <span className="loader"></span>
              ) : (
                'Se connecter'
              )}
            </button>
          </form>

          <div className="divider">
            <span>ou</span>
          </div>

          <div className="social-login-icons">
            <button onClick={handleGoogleLogin} className="icon-button" aria-label="Se connecter avec Google">
              <svg className="social-icon" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
              </svg>
            </button>

            <button onClick={handleGithubLogin} className="icon-button" aria-label="Se connecter avec GitHub">
              <svg className="social-icon" viewBox="0 0 24 24">
                <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" fill="#181717"/>
              </svg>
            </button>
          </div>

          <div className="register-link">
            <p>Vous n'avez pas de compte? <Link to="/register">Créer un compte</Link></p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;