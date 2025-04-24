import React from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import '../styles/Landing.css';
import '../styles/Layout.css';

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="layout">
      <Navbar />
    <div className="landing">
      <div className="overlay">
        <section className="hero">
          <h1><strong>Détection de plagiat intelligente et rapide</strong></h1>
          <button onClick={() => navigate('/login')}>Commencer maintenant</button>
        </section>

        <section className="features">
          <div className="feature-box">
            <h3>🔍 Analyse rapide</h3>
            <p>Obtenez des résultats fiables en temps réel grâce à notre moteur d’analyse performant.</p>
          </div>
          <div className="feature-box">
            <h3>🌐 Support multilingue</h3>
            <p>Analyse de documents en français, anglais et d'autres langues, avec traduction intégrée.</p>
          </div>
          <div className="feature-box">
            <h3>📂 Simple à utiliser</h3>
            <p>Interface intuitive pour uploader, vérifier et consulter vos analyses sans prise de tête.</p>
          </div>
        </section>

        <section className="why-us">
          <h2>Pourquoi utiliser notre plateforme ?</h2>
          <p>Que vous soyez étudiant ou enseignant, notre outil vous aide à garantir l'originalité de vos travaux. Avec une interface claire, des résultats précis et une expérience fluide, vous êtes entre de bonnes mains.</p>
        </section>
      </div>
    </div>
    </div>
  );
};

export default Landing;

