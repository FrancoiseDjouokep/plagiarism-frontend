import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import '../styles/Layout.css';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  
  // Détection du scroll pour changer l'apparence de la navbar
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
  
  // Fermer le menu mobile lors du changement de page
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
            to="/home" 
            className={location.pathname === '/home' ? 'active' : ''}
          >
            Accueil
          </Link>
        </li>
        <li>
          <Link 
            to="/features" 
            className={location.pathname === '/features' ? 'active' : ''}
          >
            Fonctionnalités
          </Link>
        </li>
        <li>
          <Link 
            to="/account" 
            className="account-link"
          >
            <svg className="icon-user" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>
            Mon compte
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;