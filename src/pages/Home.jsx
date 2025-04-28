import React from 'react';
import { useNavigate } from 'react-router-dom';
import NavbarB from '../components/Navbar';
import { handleLogout } from '../utils/api';
import { isTokenExpired } from '../utils/api';
import '../styles/Home.css';
import '../styles/Layout.css';

const Home = () => {
 
    const navigate = useNavigate();

    return(
       <div className="layout">
          <NavbarB />
          <div className="home">
          <h2>Acceuil</h2>
          <section className="hfeatures">
              <div className="hfeature-box" onClick={() => navigate('/check')}>
                 <h2>Plagiarism Check</h2>
              </div>
              <div className="hfeature-box" onClick={() => navigate('/compare-one')}>
                 <h2>Compare One</h2>
              </div>
              <div className="hfeature-box" onClick={() => navigate('/upload')}>
                 <h2>Upload Document</h2>
              </div>
              <div className="hfeature-box" onClick={() => navigate('/ai_detect')}>
                 <h2>AI detect</h2>
              </div>
          </section>
          </div>
       </div>
    );
};
   export default Home;