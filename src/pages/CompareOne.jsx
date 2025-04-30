import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import {API} from '../utils/api';
import {isTokenExpired} from '../utils/api';
import {handleLogout} from '../utils/api';
import '../styles/Layout.css';
import '../styles/CompareOne.css';

const CompareOne = () => {
  const [targetId, setTargetId] = useState('');
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleCompare = async () => {
    if (!file || !targetId.trim()) {
      setMessage("Veuillez sélectionner un fichier et entrer un ID de document cible.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("title", "Document à comparer");
    formData.append("id", targetId);

    try {
      setMessage("Analyse en cours...");
      setIsLoading(true);
      setResult(null);

      const token = localStorage.getItem('token');
      if (token && isTokenExpired(token)) {
        const refreshToken = localStorage.getItem('refreshToken');
        if (!refreshToken) throw new Error('Session expired');
        
       
        await API.post('/refresh-token', { refresh: refreshToken });
      }
      const response = await API.post('/api/analysis', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        }
      });

      setResult(response.data);
      setMessage('');
    } catch (error) {
      console.error("Erreur de comparaison :", error);
      if (error.response?.status === 403 || error.message === 'Session expired') {
        setMessage("Votre session a expiré. Veuillez vous reconnecter.");
        handleLogout();
      } else {
        setMessage(error.response?.data?.message || "La comparaison a échoué.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  return (
    <div className="layout">
      <Navbar />
    <div className="compare-container">
      <h2>Comparer un fichier avec un document existant</h2>

      <div className="form-group">
        <label htmlFor="targetId">ID du document cible:</label>
        <input
          id="targetId"
          type="number"
          value={targetId}
          onChange={(e) => {
            console.log('ID input:', e.target.value); 
            setTargetId(e.target.value);
          }}
          placeholder="Ex: 12"
          min="1"
        />
        {targetId && <span>Entered ID: {targetId}</span>}
      </div>

      {/* File Input */}
      <div className="form-group">
        <label htmlFor="fileInput">Choisir un fichier à comparer:</label>
        <input
          id="fileInput"
          type="file"
          accept=".pdf,.doc,.docx,.txt"
          onChange={handleFileChange}
        />
        {file && <span>Selected file: {file.name}</span>}
      </div>

      <button 
        onClick={handleCompare} 
        disabled={isLoading || !file || !targetId.trim()}
      >
        {isLoading ? 'Comparaison en cours...' : 'Comparer'}
      </button>

      {message && <p className={`message ${isLoading ? 'info' : 'error'}`}>{message}</p>}

      {result && (
        <div className="result-box">
          <h3>Résultat de la comparaison</h3>
          <div className="result-line">
            <strong>Similarité :</strong>
            <span>{result.similarityScore?.toFixed(2) ?? 'N/A'}%</span>
          </div>
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ width: `${result.similarityScore ?? 0}%` }}
            ></div>
          </div>
          <div className="result-line">
            <strong>ID cible :</strong>
            <span>#{result.targetDocumentId ?? 'N/A'}</span>
          </div>
          <div className="result-line">
            <strong>ID document analysé :</strong>
            <span>#{result.sourceDocumentId ?? 'N/A'}</span>
          </div>
        </div>
      )}
    </div>
    </div>
  );
};

export default CompareOne;