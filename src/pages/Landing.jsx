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
          {/* Hero Section */}
          <section className="hero">
            <div className="hero-content">
             
              <h1><span className="gradient-text">Détection de plagiat</span><br /><span className="subtitle">intelligente et rapide</span></h1>
              <p className="hero-description">Protégez l'intégrité de vos travaux académiques et professionnels grâce à notre technologie IA de pointe</p>
              <div className="cta-group">
                <button onClick={() => navigate('/login')} className="cta-button">
                  <span>Commencer </span>
                  <i className="arrow-icon">→</i>
                </button>
                <button onClick={() => navigate('/demo')} className="secondary-button">
                  <span>Voir une démo</span>
                </button>
              </div>
              <div className="stats-bar">
                <div className="stat-item">
                  <span className="stat-number">99.8%</span>
                  <span className="stat-label">Précision</span>
                </div>
                <div className="divider-vertical"></div>
                <div className="stat-item">
                  <span className="stat-number">2M+</span>
                  <span className="stat-label">Documents analysés</span>
                </div>
                <div className="divider-vertical"></div>
                <div className="stat-item">
                  <span className="stat-number">5s</span>
                  <span className="stat-label">Temps moyen d'analyse</span>
                </div>
              </div>
            </div>
          </section>
          
          {/* Comment ça marche */}
          <section className="how-it-works">
            <h2 className="section-title">Comment ça marche</h2>
            <div className="divider"></div>
            <div className="steps-container">
              <div className="step">
                <div className="step-number">1</div>
                <h3>Importez votre document</h3>
                <p>Téléchargez votre fichier dans les formats courants (PDF, DOCX, TXT) ou copiez-collez votre texte directement.</p>
              </div>
              <div className="step-arrow">→</div>
              <div className="step">
                <div className="step-number">2</div>
                <h3>Analyse intelligente</h3>
                <p>Notre algorithme IA analyse votre contenu et le compare à des milliards de sources en ligne et académiques.</p>
              </div>
              <div className="step-arrow">→</div>
              <div className="step">
                <div className="step-number">3</div>
                <h3>Résultats détaillés</h3>
                <p>Recevez un rapport complet avec surlignage des passages similaires et liens vers les sources originales.</p>
              </div>
            </div>
          </section>
          
          {/* Features section */}
          <section className="features-section">
            <h2 className="section-title">Fonctionnalités avancées</h2>
            <div className="divider"></div>
            <div className="features">
              <div className="feature-box">
                <div className="feature-icon">🔍</div>
                <h3>Analyse rapide</h3>
                <p>Obtenez des résultats fiables en temps réel grâce à notre moteur d'analyse performant qui traite votre texte en quelques secondes.</p>
              </div>
              <div className="feature-box">
                <div className="feature-icon">🌐</div>
                <h3>Support multilingue</h3>
                <p>Analyse de documents en français, anglais et 30+ autres langues, avec traduction intégrée et détection de plagiat inter-langues.</p>
              </div>
              <div className="feature-box">
                <div className="feature-icon">📊</div>
                <h3>Rapports détaillés</h3>
                <p>Visualisez clairement les passages similaires, accédez aux sources originales et obtenez un score global d'originalité.</p>
              </div>
              <div className="feature-box">
                <div className="feature-icon">🧠</div>
                <h3>IA avancée</h3>
                <p>Notre technologie détecte même le plagiat paraphrasé et les tentatives de dissimulation grâce à nos algorithmes de pointe.</p>
              </div>
              <div className="feature-box">
                <div className="feature-icon">📂</div>
                <h3>Simple à utiliser</h3>
                <p>Interface intuitive pour uploader, vérifier et consulter vos analyses sans prise de tête, même pour les débutants.</p>
              </div>
              <div className="feature-box">
                <div className="feature-icon">🔒</div>
                <h3>Sécurité garantie</h3>
                <p>Vos documents sont traités avec la plus grande confidentialité, chiffrés de bout en bout et supprimés après analyse.</p>
              </div>
            </div>
          </section>
          
          {/* Use Cases */}
          <section className="use-cases">
            <h2 className="section-title">Pour qui ?</h2>
            <div className="divider"></div>
            <div className="cases-container">
              <div className="case-card">
                <div className="case-icon">👩‍🎓</div>
                <h3>Étudiants</h3>
                <p>Vérifiez l'originalité de vos dissertations, mémoires et thèses avant de les soumettre pour éviter les sanctions académiques.</p>
              </div>
              <div className="case-card">
                <div className="case-icon">👨‍🏫</div>
                <h3>Enseignants</h3>
                <p>Identifiez rapidement les cas de plagiat dans les travaux de vos étudiants pour maintenir l'intégrité académique.</p>
              </div>
              <div className="case-card">
                <div className="case-icon">👩‍💼</div>
                <h3>Chercheurs</h3>
                <p>Assurez-vous que vos publications scientifiques sont exemptes de contenu plagié et respectent les normes d'intégrité.</p>
              </div>
              <div className="case-card">
                <div className="case-icon">👨‍💻</div>
                <h3>Rédacteurs</h3>
                <p>Garantissez l'originalité de vos contenus web, articles et publications pour préserver votre réputation.</p>
              </div>
            </div>
          </section>
          
          {/* Testimonials */}
          <section className="testimonials">
            <h2 className="section-title">Ce que disent nos utilisateurs</h2>
            <div className="divider"></div>
            <div className="testimonials-container">
              <div className="testimonial-card">
                <div className="quote">"Ce service a sauvé ma thèse ! J'ai pu identifier et corriger des passages problématiques avant de soumettre mon travail."</div>
                <div className="testimonial-author">
                  <div className="author-name">Sophie M.</div>
                  <div className="author-title">Doctorante en Sociologie</div>
                </div>
              </div>
              <div className="testimonial-card">
                <div className="quote">"En tant que professeur, cet outil m'a fait gagner un temps précieux dans l'évaluation des travaux de mes étudiants. Simple et précis."</div>
                <div className="testimonial-author">
                  <div className="author-name">Marc L.</div>
                  <div className="author-title">Professeur d'université</div>
                </div>
              </div>
              <div className="testimonial-card">
                <div className="quote">"La détection multilingue est remarquable. J'ai pu vérifier des contenus en trois langues différentes sans aucun problème."</div>
                <div className="testimonial-author">
                  <div className="author-name">Thomas D.</div>
                  <div className="author-title">Rédacteur web</div>
                </div>
              </div>
            </div>
          </section>
          
          
          {/* FAQ */}
          <section className="faq-section">
            <h2 className="section-title">Questions fréquentes</h2>
            <div className="divider"></div>
            <div className="faq-container">
              <div className="faq-item">
                <h3>Comment fonctionne la détection de plagiat ?</h3>
                <p>Notre système compare votre texte avec des milliards de sources en ligne, publications académiques et documents précédemment soumis. Il identifie les correspondances exactes et les paraphrases pour déterminer l'originalité du contenu.</p>
              </div>
              <div className="faq-item">
                <h3>Quels formats de documents acceptez-vous ?</h3>
                <p>Nous acceptons les formats PDF, DOCX, DOC, TXT, RTF et ODT. Vous pouvez également copier-coller directement votre texte dans notre éditeur en ligne.</p>
              </div>
              <div className="faq-item">
                <h3>Mes documents sont-ils conservés après l'analyse ?</h3>
                <p>Non, vos documents sont automatiquement supprimés de nos serveurs après l'analyse, garantissant ainsi la confidentialité totale de vos travaux.</p>
              </div>
              <div className="faq-item">
                <h3>Puis-je exclure certaines sources de la vérification ?</h3>
                <p>Oui, nos forfaits premium permettent d'exclure des sources spécifiques ou d'ajouter des documents de référence que vous ne souhaitez pas considérer comme du plagiat.</p>
              </div>
            </div>
          </section>
          
          {/* CTA Final */}
          <section className="cta-final">
            <div className="cta-content">
              <h2>Prêt à garantir l'originalité de vos travaux ?</h2>
              <p>Rejoignez des milliers d'utilisateurs satisfaits et commencez à utiliser notre solution dès aujourd'hui.</p>
              <button onClick={() => navigate('/signup')} className="cta-button large">
                <span>Créer un compte </span>
                <i className="arrow-icon">→</i>
              </button>
            </div>
          </section>
        </div>
      </div>
      
      {/* Footer */}
      <footer className="footer">
        <div className="footer-content">
          <div className="footer-column">
            <h3 className="footer-title">PlagiaGuard</h3>
            <p className="footer-description">Solution intelligente de détection de plagiat, basée sur l'IA pour garantir l'originalité de vos travaux.</p>
          </div>
          <div className="footer-column">
            <h3 className="footer-title">Navigation</h3>
            <ul className="footer-links">
              <li><a href="/">Accueil</a></li>
              <li><a href="/features">Fonctionnalités</a></li>
              <li><a href="/blog">Blog</a></li>
            </ul>
          </div>
          <div className="footer-column">
            <h3 className="footer-title">Support</h3>
            <ul className="footer-links">
              <li><a href="/contact">Contact</a></li>
              <li><a href="/faq">FAQ</a></li>
              <li><a href="/documentation">Documentation</a></li>
              <li><a href="/tutorials">Tutoriels</a></li>
            </ul>
          </div>
          <div className="footer-column">
            <h3 className="footer-title">Légal</h3>
            <ul className="footer-links">
              <li><a href="/terms">Conditions d'utilisation</a></li>
              <li><a href="/privacy">Politique de confidentialité</a></li>
              <li><a href="/gdpr">Conformité RGPD</a></li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} PlagiaGuard. Tous droits réservés.</p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;