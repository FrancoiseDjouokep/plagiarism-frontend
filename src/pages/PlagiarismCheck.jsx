import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { API } from '../utils/api';
import { isTokenExpired } from '../utils/api';
import { handleLogout } from '../utils/api';
import '../styles/Layout.css';
import '../styles/PlagiarismCheck.css';
import { useAnalysis } from '../contexts/AnalysisContext';

const PlagiarismCheck = () => {
  const { analysisState, setAnalysisState } = useAnalysis();
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [overallSimilarity, setOverallSimilarity] = useState(0);

  useEffect(() => {
    if (analysisState.results && analysisState.results.length > 0) {
      setResults(analysisState.results);
      setOverallSimilarity(analysisState.overallSimilarity);
      setMessage(analysisState.message);
      setTitle(analysisState.title);
      setFile(analysisState.file);
    }
  }, [analysisState]);

  const handleAnalyze = async () => {
    if (!file) {
      setMessage("Please select a file to analyze");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("title", title || "Untitled Document");

    try {
      setMessage("Analyzing document...");
      setIsLoading(true);
      setResults([]);
      setOverallSimilarity(0);

      const token = localStorage.getItem('token');
      if (token && isTokenExpired(token)) {
        const refreshToken = localStorage.getItem('refreshToken');
        if (!refreshToken) throw new Error('Session expired');

        await API.post('/refresh-token', { refresh: refreshToken });
      }

      const response = await API.post('/api/bigAnalysis', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        }
      });

      const maxSimilarity = response.data.length > 0
        ? Math.max(...response.data.map(r => r.similarityScore))
        : 0;

      setResults(response.data);
      setOverallSimilarity(maxSimilarity);
      setMessage(response.data.length > 0
        ? `Analysis complete (${response.data.length} matches found)`
        : "No significant matches found (all similarities < 20%)");
      setAnalysisState({
        file,
        title,
        results: response.data,
        overallSimilarity: maxSimilarity,
        message: response.data.length > 0
          ? `Analysis complete (${response.data.length} matches found)`
          : "No significant matches found (all similarities < 20%)"
      });
    } catch (error) {
      console.error("Analysis error:", error);
      if (error.response?.status === 403 || error.message === 'Session expired') {
        setMessage("Votre session a expiré. Veuillez vous reconnecter.");
        handleLogout();
      } else {
        setMessage(error.response?.data?.message ||
          "Analysis failed. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };
  const navigate = useNavigate();

  const handleViewComparison = (result) => {
    navigate(`/detailed-comparison/${result.id}`);
  };

  const clearAnalysis = () => {
    setAnalysisState({
      file: null,
      title: '',
      results: [],
      overallSimilarity: 0,
      message: ''
    });
    setFile(null);
    setTitle('');
    setMessage('');
    setResults([]);
    setOverallSimilarity(0);
  };

  return (
    <div className="layout">
      <Navbar />
      <div className="plagiarism-container">
        <h2>Plagiarism Detection</h2>
        {results.length > 0 && (
          <button onClick={clearAnalysis} className="clear-analysis-button">
            Clear Analysis
          </button>
        )}
        <div className="summary-card">
          <h3>Document Analysis Summary</h3>
          <div className="similarity-display">
            <div className="similarity-score">
              Highest Similarity: {overallSimilarity.toFixed(2)}%
            </div>
            <div className="progress-container">
              <div
                className="progress-bar"
                style={{
                  width: `${overallSimilarity}%`,
                  backgroundColor: overallSimilarity > 50 ? '#e74c3c' :
                    overallSimilarity > 20 ? '#f39c12' : '#2ecc71'
                }}
              ></div>
            </div>
          </div>
          <div className="matches-count">
            {results.length} {results.length === 1 ? "match" : "matches"} found
          </div>
        </div>

        <div className="upload-section">
          <div className="form-group">
            <label>Document Title (optional):</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter document title"
            />
          </div>

          <div className="file-upload-box">
            <label className="file-upload-label">
              {file ? "Change File" : "Select File"}
              <input
                type="file"
                onChange={(e) => setFile(e.target.files[0])}
                accept=".pdf,.doc,.docx,.txt"
              />
            </label>
            {file && (
              <div className="file-info">
                <span className="file-name">{file.name}</span>
                <span className="file-size">({(file.size / 1024).toFixed(2)} KB)</span>
              </div>
            )}
          </div>

          <button
            onClick={handleAnalyze}
            disabled={isLoading || !file}
            className="analyze-button"
          >
            {isLoading ? (
              <>
                <span className="spinner"></span>
                Analyzing...
              </>
            ) : "Analyze Document"}
          </button>
        </div>

        {message && <div className={`status-message ${isLoading ? 'info' : ''}`}>{message}</div>}

        {results.length > 0 && (
          <div className="results-section">
            <h3>Detailed Matches</h3>
            <div className="results-table">
              <div className="table-header">
                <div className="header-cell">Matched Document</div>
                <div className="header-cell">Similarity Score</div>
                <div className="header-cell">Details</div>
              </div>

              {results
                .sort((a, b) => b.similarityScore - a.similarityScore)
                .map((result, index) => (
                  <div className="table-row" key={index}>
                    <div className="cell document-info">
                      <div className="doc-title">Document #{result.targetDocumentId}</div>
                      <div className="doc-date">
                        {new Date(result.creationDate).toLocaleDateString()}
                      </div>
                    </div>
                    <div className="cell similarity-cell">
                      <div className="score-value">{result.similarityScore.toFixed(2)}%</div>
                      <div className="similarity-visual">
                        <div
                          className="similarity-bar"
                          style={{
                            width: `${result.similarityScore}%`,
                            backgroundColor: result.similarityScore > 50 ? '#e74c3c' :
                              result.similarityScore > 20 ? '#f39c12' : '#2ecc71'
                          }}
                        ></div>
                      </div>
                    </div>
                    <div className="cell actions-cell">
                      <button
                        className="view-details"
                        onClick={() => handleViewComparison(result)}
                      >
                        View Comparison
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );

};

export default PlagiarismCheck;  