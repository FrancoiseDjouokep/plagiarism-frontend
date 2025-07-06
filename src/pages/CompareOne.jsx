import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
  const [similarityScore, setSimilarityScore] = useState(0);
  const [analysisResult, setAnalysisResult] = useState(null);

  useEffect(() => {
    if (manualSelection) {
      setManualSelection(false);
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
      setSimilarityScore(0); // Reset progress bar

      const response = await API.post('/api/analysis/compare-by-title', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      setAnalysisResult(response.data);
      setSimilarityScore(response.data.similarityScore);
      setMessage(`Similarité trouvée: ${response.data.similarityScore.toFixed(2)}%`);
    } catch (error) {
      setMessage(error.response?.data?.message || "Erreur lors de la comparaison");
      setSimilarityScore(0);
    } finally {
      setIsLoading(false);
    }
  };
   const navigate = useNavigate();
  const handleDetailResult = (analysisResult) => {
    console.log("Détails de l'analyse:", analysisResult);
    navigate(`/detailed-comparison/${analysisResult.id}`);
  };
  return (
    <div className="layout">
      <Navbar />
      <div className="compare-page-container">
        <div className="compare-card">

          <h2 className="compare-title">Comparer avec un document existant</h2>

          <div className="search-section">
            <label className="input-label">Rechercher un document par titre</label>
            <div className="search-input-container">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Tapez le titre du document..."
                className="search-input"
              />
              <i className="search-icon">🔍</i>
            </div>

            {searchResults.length > 0 && (
              <ul className="results-dropdown">
                {searchResults.map(doc => (
                  <li
                    key={doc.id}
                    onClick={() => {
                      setSelectedDocument(doc);
                      setSearchTerm(doc.title);
                      setSearchResults([]);
                      setManualSelection(true);
                    }}
                    className="search-result-item"
                  >
                    <span className="doc-title">{doc.title}</span>
                    <span className="doc-id">ID: {doc.id}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {selectedDocument && (
            <div className="selected-doc-card">
              <div className="selected-doc-header">
                <span className="selected-icon">✓</span>
                <span>Document sélectionné</span>
              </div>
              <div className="selected-doc-title">{selectedDocument.title}</div>
            </div>
          )}

          <div className="file-upload-section">
            <label className="file-upload-label">
              <span>Fichier à comparer</span>
              <div className="file-upload-box">
                {file ? (
                  <span className="file-name">{file.name}</span>
                ) : (
                  <span className="file-placeholder">Cliquez pour parcourir</span>
                )}
                <input
                  type="file"
                  onChange={(e) => setFile(e.target.files[0])}
                  accept=".pdf,.doc,.docx,.txt"
                  className="file-input"
                />
              </div>
            </label>
          </div>

          <div className="action-buttons">
            <button
              onClick={handleCompare}
              disabled={!file || !selectedDocument || isLoading}
              className={`compare-button ${isLoading ? 'loading' : ''}`}
            >
              {isLoading ? (
                <>
                  <span className="spinner"></span>
                  <span>Analyse en cours</span>
                </>
              ) : (
                'Lancer la comparaison'
              )}
            </button>
          </div>

          {similarityScore > 0 && (
            <div className="results-section">
              <div className="progress-container">
                <div className="progress-labels">
                  <span>Similarité détectée</span>
                  <span>{similarityScore.toFixed(1)}%</span>
                </div>
                <div className="progress-bar">
                  <div
                    className="progress-fill"
                    style={{
                      width: `${similarityScore}%`,
                      backgroundColor: similarityScore > 70 ? '#4CAF50' :
                        similarityScore > 40 ? '#FFC107' : '#F44336'
                    }}
                  ></div>
                </div>
                <div className="similarity-message">
                  {similarityScore > 70 ? 'Similarité élevée' :
                    similarityScore > 40 ? 'Similarité modérée' : 'Similarité faible'}
                </div>
              </div>

              <button
                onClick={() => handleDetailResult(analysisResult)}
                className="details-button"
              >
                <span>Voir le détail</span>
                <i className="arrow-icon">→</i>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CompareOne;
