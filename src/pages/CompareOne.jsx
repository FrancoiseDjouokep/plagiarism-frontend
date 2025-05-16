import React, { useState, useEffect } from 'react';
import { API } from '../utils/api';
import Navbar from '../components/Navbar';
import '../styles/Layout.css';
import '../styles/CompareOne.css';

const CompareOne = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [file, setFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [manualSelection, setManualSelection] = useState(false);
  // Recherche des documents en temps réel
  useEffect(() => {
    if (manualSelection) {
      setManualSelection(false); // Ne faire la recherche qu’une seule fois
      return;
    }
  
    const searchDocuments = async () => {
      if (searchTerm.length < 2) {
        setSearchResults([]);
        return;
      }
  
      try {
        const response = await API.get(`/api/documents/search`, {
          params: { query: searchTerm }
        });
        setSearchResults(response.data);
      } catch (error) {
        console.error("Erreur de recherche:", error);
        setSearchResults([]);
      }
    };
  
    const timer = setTimeout(searchDocuments, 300);
    return () => clearTimeout(timer);
  }, [searchTerm]);  

  const handleCompare = async () => {
    if (!file || !selectedDocument) {
      setMessage("Veuillez sélectionner un fichier et un document cible");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("title", file.name);
    formData.append("targetTitle", selectedDocument.title);

    try {
      setIsLoading(true);
      setMessage("Comparaison en cours...");
      
      const response = await API.post('/api/analysis/compare-by-title', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      setMessage(`Similarité trouvée: ${response.data.similarityScore.toFixed(2)}%`);
    } catch (error) {
      setMessage(error.response?.data?.message || "Erreur lors de la comparaison");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="layout">
      <Navbar />
    <div className="compare-container">
      <h2>Comparer avec un document existant</h2>

      <div className="search-box">
        <label>Rechercher un document par titre:</label>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Commencez à taper un titre..."
        />
        
        {searchResults.length > 0 && (
          <ul className="results-dropdown">
            {searchResults.map(doc => (
              <li
              key={doc.id}
              onClick={() => {
                setSelectedDocument(doc);
                setSearchTerm(doc.title);
                setSearchResults([]);
                setManualSelection(true); // Empêche useEffect de relancer la recherche
              }}              
              className="search-result-item"
            >
              {doc.title}
              <span className="doc-meta">ID: {doc.id}</span>
            </li>
            
            ))}
          </ul>
        )}
      </div>

      {selectedDocument && (
        <div className="selected-doc">
          <strong>Document sélectionné:</strong> {selectedDocument.title}
        </div>
      )}

      <div className="file-upload">
        <label>Fichier à comparer:</label>
        <input 
          type="file" 
          onChange={(e) => setFile(e.target.files[0])} 
          accept=".pdf,.doc,.docx,.txt"
        />
      </div>

      <button 
        onClick={handleCompare}
        disabled={!file || !selectedDocument || isLoading}
      >
        {isLoading ? 'En cours...' : 'Comparer'}
      </button>

      {message && <div className="message">{message}</div>}
    </div>
    </div>
  );
};

export default CompareOne;