import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import PrivateRoute from './routes/PrivateRoute';
import { checkAuthStatus } from './utils/api';

import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import Home_Student from './pages/Home_Student';
import DetailedResult from './pages/DetailedResultPage';
import AllDetailedResult from './pages/AllDetailedResult';
import Landing from './pages/Landing';
import PlagiarismCheck from './pages/PlagiarismCheck';
import FileUploadComponent from './pages/FileUploadComponent';
import AIdetection from './pages/AIDetectionPage';
import './styles/Layout.css';
import Activation from './pages/Activation';
import Oauth2Success from './pages/Oauth2Success'
import CompareOne from './pages/CompareOne';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import Validation from './pages/Validation';
import AdminValidationPage from './pages/AdminValidationPage';
import History from './pages/History';
import ViewAllUsers from './pages/ViewAllUsers';
import ViewAllAnalysis from './pages/ViewAllAnalysis';
import { AnalysisProvider } from './contexts/AnalysisContext';
import FeaturesPage from './pages/FeaturesPage';

const App = () => {
  // Vérifier l'état d'authentification au chargement de l'application
  useEffect(() => {
    checkAuthStatus();
  }, []);

  return (
    <Router>
      {/* Enveloppez votre application avec le fournisseur d'authentification */}
      <AuthProvider>
        {/* Then wrap with AnalysisProvider */}
        <AnalysisProvider>
          <div className="layout">
            <main className="main-content">
              <Routes>
                {/* Routes publiques */}
                <Route path="/" element={<Landing />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/reinitialiser" element={<ForgotPassword />} />
                <Route path="/password" element={<ResetPassword />} />
                <Route path="/activation" element={<Activation />} />
                <Route path="/validation" element={<Validation />} />
                <Route path="/oauth2-success" element={<Oauth2Success />} />


                {/* Routes protégées */}
                <Route path="/admin" element={<PrivateRoute><AdminValidationPage /></PrivateRoute>} />
                <Route path="/all-users" element={<PrivateRoute><ViewAllUsers /></PrivateRoute>} />
                <Route path="/all-analyses" element={<PrivateRoute><ViewAllAnalysis /></PrivateRoute>} />
                <Route path="/home" element={<PrivateRoute><Home /></PrivateRoute>} />
                <Route path="/home-student" element={<PrivateRoute><Home_Student /></PrivateRoute>} />
                <Route path="/features" element={<PrivateRoute><FeaturesPage /></PrivateRoute>} />
                <Route path="/history" element={<PrivateRoute><History /></PrivateRoute>} />
                <Route path="/check" element={<PrivateRoute><PlagiarismCheck /></PrivateRoute>} />
                <Route path="/compare-one" element={<PrivateRoute><CompareOne /></PrivateRoute>} />
                <Route path="/upload" element={<PrivateRoute><FileUploadComponent /></PrivateRoute>} />
                <Route path="/ai-detection" element={<PrivateRoute><AIdetection /></PrivateRoute>} />
                <Route path="/detailed-comparison/:id" element={<PrivateRoute><DetailedResult /></PrivateRoute>} />
                <Route path="/all-detailed-result/:id" element={<PrivateRoute><AllDetailedResult /></PrivateRoute>} />


                {/* Route fallback */}
                <Route path="*" element={<Landing />} />
              </Routes>
            </main>
          </div>
        </AnalysisProvider>
      </AuthProvider>
    </Router>
  );
};

export default App;