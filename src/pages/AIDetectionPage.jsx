import React, { useState } from 'react';
import axios from 'axios';
import '../styles/AIDetectionPage.css';
import Navbar from '../components/Navbar';
import '../styles/Layout.css';

const AIDetectionPage = () => {
  const [text, setText] = useState('');
  const [result, setResult] = useState({ percentage: '', justification: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setResult({ percentage: '', justification: '' });

    try {
      const response = await axios.post('http://192.99.42.107:8090/api/ia/detect', text, {
        headers: {
          'Content-Type': 'text/plain'
        }
      });

      const resultText = response.data;

      // 🧠 Extraction des données
      const percentageMatch = resultText.match(/Pourcentage IA\s*:\s*(\d+)%/);
      const justificationMatch = resultText.match(/Justification\s*:\s*(.*)/s);

      const percentage = percentageMatch ? percentageMatch[1] : 'Inconnu';
      const justification = justificationMatch ? justificationMatch[1].trim() : 'Aucune justification trouvée.';

      setResult({ percentage, justification });

    } catch (err) {
      setError(err.response?.data || 'An error occurred during analysis');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="layout">
      <Navbar />
      <div className="ai-detection-page">
        <div className="ai-detection-container">
          <h2>Detection de Contenu IA</h2>

          <form onSubmit={handleSubmit}>
            <textarea
              className="text-input"
              placeholder="Enter text to analyze (minimum 200 characters)"
              value={text}
              onChange={(e) => setText(e.target.value)}
              minLength={200}
            />

            <button
              type="submit"
              className="submit-button"
              disabled={loading || text.length < 200}
            >
              {loading ? (
                <>
                  <span className="spinner"></span>
                  Analyse...
                </>
              ) : (
                'Analyze Text'
              )}
            </button>
          </form>

          {error && (
            <div className="error-message">{error}</div>
          )}

          {result.percentage && (
            <div className="result-container ai-result">
              <h3>Resultat d'Analyse</h3>

              <div className="result-text">
                <p><strong>🤖 Estimation de contenu IA:</strong> {result.percentage}%</p>

              </div>
              <div className="justification">
                  <h4>🧠 Justification:</h4>
                  <p style={{ whiteSpace: 'pre-line' }}>{result.justification}</p>
             </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AIDetectionPage;
