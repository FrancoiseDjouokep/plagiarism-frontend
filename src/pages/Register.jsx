import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { apiRequest } from '../utils/api';
import '../styles/Login.css'; 

const Register = () => {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  

  const handleRegister = async (e) => {
    e.preventDefault();
  
    try {
      const response = await apiRequest('/inscription', 'POST', {
            nom: name,
            email: email,
            password: password
          });
  
      let result;
      try {
        result = await response.json();
      } catch (jsonError) {
        const text = await response.text();
        result = { message: text };
      }
  
      if (response.ok) {
        alert(result.message || 'Inscription réussie ! Veuillez entrer votre code OTP.');
        navigate('/activation');
      } else {
        alert(result.error || result.message || "Erreur lors de l'inscription.");
      }
    } catch (error) {
      console.error('Erreur réseau :', error);
      alert('Erreur de connexion au serveur.');
    }
  };
  

  return (
    <div className="login-container">
      <h2>Inscription</h2>

      <form onSubmit={handleRegister}>
      <label>
          Nom :
          <input
            type="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
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
        <label>
          Email :
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </label>


    

        <button type="submit">S'inscrire</button>
      </form>

      <p className="register-link">
        Vous avez déjà un compte ? <Link to="/login">Se connecter</Link>
      </p>
    </div>
  );
};

export default Register;
