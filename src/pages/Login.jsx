import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { apiRequest } from '../utils/api';
import '../styles/Layout.css'
import '../styles/Login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

 
const handleLogin = async (e) => {
  e.preventDefault();

  try {
    const data = await apiRequest('/connexion', 'POST', {
      username: email,
      password: password,
    });

    localStorage.setItem('token', data.bearer);
    console.log('Token saved:', data.bearer);
    navigate('/home');
  } catch (error) {
    console.error('Erreur:', error.message);
    alert(error.message);
  }
};

  const handleGoogleLogin = () => {
    alert('Connexion Google simulée !');
  };
  return (
    <div className="layout">
    <Navbar />
    <div className="login-container">
      <h2>Connexion</h2>

      <form onSubmit={handleLogin}>
        <label>
          Email :
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </label>

        <label>
          Mot de passe :
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>
        <p className="forgot-password">
         Mot de passe oublié ? <Link to="/reinitialiser">Réinitialiser</Link>
      </p>
        <button type="submit">Se connecter</button>
      </form>

      <button onClick={handleGoogleLogin} className="google-button">
        Continuer avec Google
      </button>

      <p className="register-link">
        Vous n'avez pas de compte ? <Link to="/register">Créer un compte</Link>
      </p>
    </div>
    </div>
  );
};

export default Login;

