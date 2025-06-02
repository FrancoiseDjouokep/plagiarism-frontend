import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { apiRequest, handleLogout } from '../utils/api'; // Importez votre utilitaire API
import '../styles/Layout.css';
import '../styles/AccountPopup.css'; // Créez ce fichier CSS

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [accountPopupOpen, setAccountPopupOpen] = useState(false);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(false);

  const userRole = localStorage.getItem('role');

  const getHomePath = () => {
    switch (userRole) {
      case 'ETUDIANT':
        return '/home-student';
      case 'ENSEIGNANT':
        return '/home';
      case 'ADMIN':
        return '/admin';
      default:
        return '/'; 
    }
  };

  const fetchUserData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      const response = await apiRequest('/me', 'GET', null, {
        'Authorization': `Bearer ${token}`
      });

      setUserData(response);
      setAccountPopupOpen(true);
    } catch (error) {
      console.error('Erreur:', error);
      localStorage.removeItem('token');
      navigate('/login');
    } finally {
      setLoading(false);
    }
  };

  // Gestion du clic sur "Mon compte"
  const handleAccountClick = (e) => {
    e.preventDefault();
    if (accountPopupOpen) {
      setAccountPopupOpen(false);
    } else {
      fetchUserData();
    }
  };

  // Fermer le popup quand on clique ailleurs
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (accountPopupOpen && !e.target.closest('.account-link') && !e.target.closest('.account-popup')) {
        setAccountPopupOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [accountPopupOpen]);

  // Détection du scroll
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Fermer le menu mobile
  useEffect(() => {
    setMenuOpen(false);
  }, [location]);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
      <h1><b>PLAGIRIX</b></h1>

      <button className={`menu-toggle ${menuOpen ? 'active' : ''}`} onClick={toggleMenu} aria-label="Menu">
        <span></span>
        <span></span>
        <span></span>
      </button>

      <ul className={menuOpen ? 'active' : ''}>
       <li>
          <Link 
            to={getHomePath()} 
            className={location.pathname === '/home' || location.pathname === '/home-student' || location.pathname === '/admin' ? 'active' : ''}
          >
            Accueil
          </Link>
        </li>
        <li>
          <Link to="/features" className={location.pathname === '/features' ? 'active' : ''}>
            Fonctionnalités
          </Link>
        </li>
        <li>
          <Link to="/history" className={location.pathname === '/history' ? 'active' : ''}>
            Historique
          </Link>
        </li>

        <li className="account-container">
          <Link
            to="#"
            className="account-link"
            onClick={handleAccountClick}
          >
            <svg className="icon-user" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>
            Mon compte
            {loading && <span className="loading-dots">...</span>}
          </Link>

          {accountPopupOpen && (
            <div className="account-popup">
              {userData ? (
                <>
                  <div className="popup-header">
                    <h3>Mon compte</h3>
                    <button
                      className="close-popup"
                      onClick={() => setAccountPopupOpen(false)}
                      aria-label="Fermer"
                    >
                      &times;
                    </button>
                  </div>
                  <div className="user-info">
                    <div className="info-row">
                      <span className="info-label">Nom:</span>
                      <span className="info-value">{userData.nom}</span>
                    </div>
                    <div className="info-row">
                      <span className="info-label">Prénom:</span>
                      <span className="info-value">{userData.prenom}</span>
                    </div>
                    <div className="info-row">
                      <span className="info-label">Email:</span>
                      <span className="info-value">{userData.email}</span>
                    </div>
                  </div>
                  <div className="popup-footer">
                    <button
                      className="logout-button"
                      onClick={handleLogout}
                    >
                      Déconnexion
                    </button>
                  </div>
                </>
              ) : (
                <div className="loading-message">Chargement...</div>
              )}
            </div>
          )}
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;