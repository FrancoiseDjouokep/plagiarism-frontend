import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/Layout.css';

const Navbar = () => {
  const navigate = useNavigate();


  return (
    <nav className="navbar">
      <h1><b>PLAGIRIX</b></h1>
      <ul>
        <li><Link to="/home">Accueil</Link></li>
        <li><Link to="/account">Mon compte</Link></li>
        
      </ul>
    </nav>
  );
};

export default Navbar;
