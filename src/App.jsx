import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import PrivateRoute from './routes/PrivateRoute';
import Navbar from './components/Navbar';


import Login from './pages/Login';
import Register from './pages/Register'; 
import Home from './pages/Home';
import Results from './pages/Results';
import Landing from './pages/Landing';
import PlagiarismCheck from './pages/PlagiarismCheck';
import FileUploadComponent from './pages/FileUploadComponent';
import Ai_detect from './pages/Ai_detect';
import './styles/Layout.css';
import Activation from './pages/Activation';
import CompareOne from './pages/CompareOne';
import ForgotPassword from './pages/ForgotPassword';

const App = () => {
  return (
    <Router>
      <div className="layout">
        
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/reinitialiser" element ={<ForgotPassword/>}/>
            <Route path="/activation" element={<Activation />} />
            <Route path="/home" element={<PrivateRoute> <Home /> </PrivateRoute>  }/>
            <Route path="/check" element={<PrivateRoute> <PlagiarismCheck /> </PrivateRoute> }/>
            <Route path="/compare-one" element={<PrivateRoute> <CompareOne /> </PrivateRoute> }/>
            <Route path="/upload" element={<PrivateRoute> <FileUploadComponent /> </PrivateRoute> }/>
            <Route path="/ai_detect" element={<PrivateRoute> <Ai_detect /> </PrivateRoute> }/>
            <Route path="/results" element={<PrivateRoute> <Results /> </PrivateRoute>}/>
            <Route path="*" element={<Landing />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
};

export default App;
