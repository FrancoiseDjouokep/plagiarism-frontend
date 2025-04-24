import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Activation.css';

const Activation = () => {
  const [otp, setOtp] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleActivate = async (e) => {
    e.preventDefault();

    if (otp.length !== 6) {
      setMessage("Le code OTP doit contenir exactement 6 chiffres.");
      return;
    }

    try {
      const response = await fetch('http://localhost:8080/activation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ code: otp}) // ou { code: otp } selon ton backend
      });

      if (response.ok) {
        setMessage("Compte activé avec succès !");
        setTimeout(() => navigate('/login'), 2000);
      } else {
        setMessage("Code incorrect ou expiré.");
      }
    } catch (error) {
      console.error("Erreur lors de l'activation :", error);
      setMessage("Erreur serveur. Veuillez réessayer.");
    }
  };

  return (
    <div className="activation-container">
      <h2>Activer votre compte</h2>
      <p>Veuillez entrer le code OTP que vous avez reçu par e-mail.</p>

      <form onSubmit={handleActivate}>
        <input
          type="text"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          maxLength={6}
          pattern="[0-9]*"
          placeholder="123456"
          required
        />
        <button type="submit">Valider</button>
      </form>

      {message && <p className="message">{message}</p>}
    </div>
  );
};

export default Activation;
