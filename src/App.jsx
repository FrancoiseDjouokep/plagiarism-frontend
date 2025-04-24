import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import PrivateRoute from './routes/PrivateRoute';
import Navbar from './components/Navbar';


import Login from './pages/Login';
import Register from './pages/Register'; 
import Home from './pages/Home';
import Results from './pages/Results';
import Landing from './pages/Landing';

import './styles/Layout.css';
import Activation from './pages/Activation';

const App = () => {
  return (
    <Router>
      <div className="layout">
        
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/activation" element={<Activation />} />
            <Route
              path="/home"
              element={
                       <PrivateRoute>
                       <Home />
                       </PrivateRoute>
                      }
            />
            <Route path="*" element={<Landing />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
};

export default App;
