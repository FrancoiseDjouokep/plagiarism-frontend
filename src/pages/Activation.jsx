import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import '../styles/Activation.css';
import { apiRequest } from '../utils/api'; // Use your existing apiRequest

const Activation = () => {
  const [otp, setOtp] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  const handleActivate = async (e) => {
    e.preventDefault();

    if (otp.length !== 6) {
      setMessage("Le code OTP doit contenir exactement 6 chiffres.");
      return;
    }

    try {
      const response = await apiRequest('/activation', 'POST', {
        code: otp,
        email: location.state?.email || '' // Get email from navigation state
      }, {
        'X-Requested-With': 'XMLHttpRequest' // Important for some backends
      });

      if (response.success) {
        setMessage("Compte activé avec succès !");
        setTimeout(() => navigate('/login', { 
          state: { message: "Votre compte a été activé avec succès" }
        }), 2000);
      } else {
        setMessage(response.message || "Code incorrect ou expiré.");
      }
    } catch (error) {
      console.error("Erreur d'activation:", {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message
      });
      setMessage(error.response?.data?.message || "Erreur serveur. Veuillez réessayer.");
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
