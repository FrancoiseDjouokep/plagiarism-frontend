import React from 'react';
import '../styles/FeaturesPage.css';
import Navbar from '../components/Navbar';
import '../styles/Layout.css';
const FeaturesPage = () => {
  return (
    <div className="layout">
      <Navbar />
      <div className="features-container">
        <h1 className="features-title">Fonctionnalités de Plagirix</h1>
        <p className="features-intro">
          Plagirix est une plateforme avancée conçue pour détecter le plagiat et les contenus générés par intelligence artificielle. Voici les principales fonctionnalités que nous proposons :
        </p>

        <div className="feature-section">
          <h2>📄 Analyse de plagiat</h2>
          <p>
            Téléversez un ou plusieurs documents pour détecter les similitudes avec d'autres documents existants dans notre base. Grâce à l’analyse par n-grammes et à la mesure de similarité de Jaccard, nous identifions avec précision les phrases suspectes de plagiat, même partiel ou paraphrasé.
          </p>
        </div>

        <div className="feature-section">
          <h2>📁 Comparaison ciblée</h2>
          <p>
            Comparez un document spécifique avec un autre document précis pour évaluer leur taux de similarité. Idéal pour des vérifications entre copies d'étudiants ou versions d'un même texte.
          </p>
        </div>

        <div className="feature-section">
          <h2>🧠 Détection de texte généré par IA</h2>
          <p>
            Analysez un texte pour détecter s’il a été potentiellement généré par une intelligence artificielle, grâce à l’intégration d’un détecteur de texte IA de pointe comme ZeroGPT. Cette fonctionnalité est essentielle pour maintenir l’intégrité académique.
          </p>
        </div>

        <div className="feature-section">
          <h2>📜 Historique des analyses</h2>
          <p>
            Accédez à l’historique complet de vos analyses précédentes avec les résultats détaillés, les scores de similarité, et les phrases identifiées comme plagiées ou générées.
          </p>
        </div>

        <div className="feature-section">
          <h2>🔐 Gestion des utilisateurs</h2>
          <p>
            Trois profils sont disponibles : <b>Administrateur</b> (gestion des utilisateurs), <b>Enseignant</b> (analyse de documents étudiants), et <b>Étudiant</b> (vérification personnelle). Chaque rôle dispose d’un tableau de bord adapté.
          </p>
        </div>

        <div className="feature-section">
          <h2>⚙️ Interface intuitive</h2>
          <p>
            Une interface claire, moderne et responsive permet à tout utilisateur d’exploiter facilement les fonctionnalités de Plagirix, que ce soit sur ordinateur ou mobile.
          </p>
        </div>
      </div>
    </div>
  );
};

export default FeaturesPage;
