import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { API } from '../utils/api';
import '../styles/DetailedResult.css';

const DetailedComparison = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAnalysisDetails = async () => {
      try {
        const response = await API.get(`/api/bigAnalysis/analyses/${id}/suspect-phrases`);
        setAnalysis(response.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load analysis details');
      } finally {
        setLoading(false);
      }
    };

    fetchAnalysisDetails();
  }, [id]);

  const groupPhrases = (phrases) => {
    if (!phrases || !Array.isArray(phrases)) return [];
    
    const groups = [];
    let currentGroup = [];
    
    phrases.forEach((phrase, index) => {
      if (index > 0 && !phrase.startsWith(' ') && !phrases[index-1].endsWith('.')) {
        groups.push(currentGroup.join(' '));
        currentGroup = [];
      }
      currentGroup.push(phrase);
    });
    
    if (currentGroup.length > 0) {
      groups.push(currentGroup.join(' '));
    }
    
    return groups;
  };

  const calculateSegmentSimilarity = (text1, text2) => {
    if (!text1 || !text2) return 0;
    
    const words1 = new Set(text1.toLowerCase().split(/\s+/));
    const words2 = new Set(text2.toLowerCase().split(/\s+/));
    const intersection = new Set([...words1].filter(word => words2.has(word)));
    return Math.round((intersection.size / Math.max(words1.size, words2.size)) * 100);
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading comparison details...</p>
      </div>
    );
  }

  if (error || !analysis) {
    return (
      <div className="error-container">
        <p className="error-message">Error: {error || 'Analysis data not available'}</p>
        <button className="back-button" onClick={() => navigate(-1)}>
          &larr; Back to Results
        </button>
      </div>
    );
  }

  const sourceGroups = groupPhrases(analysis.sourcePhrases);
  const targetGroups = analysis.similarDocuments?.length > 0 
    ? groupPhrases(analysis.similarDocuments[0].matchedPhrases)
    : [];

  const similarityScore = analysis.similarityScore ? analysis.similarityScore.toFixed(1) : 'N/A';

  return (
    <div className="detailed-comparison-container">
      <div className="header">
        <button onClick={() => navigate(-1)} className="back-button">
          &larr; Back to Results
        </button>
        <div className="header-content">
          <h2>Detailed Document Comparison</h2>
          <div className="similarity-badge">
            Overall Similarity: {similarityScore}%
          </div>
        </div>
      </div>

      <div className="comparison-grid">
        <div className="document-column source-column">
          <div className="document-header">
            <h3>Votre Document</h3>
            <div className="document-meta">
              {analysis.sourceTitle || 'Untitled Document'}
            </div>
          </div>
          
          <div className="document-content">
            {sourceGroups.length > 0 ? (
              sourceGroups.map((group, index) => (
                <div key={`source-${index}`} className="match-section">
                  <div className="match-content highlighted">{group}</div>
                </div>
              ))
            ) : (
              <p className="no-matches">No matching phrases found in your document</p>
            )}
          </div>
        </div>

        <div className="document-column target-column">
          <div className="document-header">
            <h3>Document Similaire</h3>
            <div className="document-meta">
              {analysis.similarDocuments?.[0]?.title || 'Untitled Document'}
            </div>
          </div>
          
          <div className="document-content">
            {targetGroups.length > 0 ? (
              targetGroups.map((group, index) => (
                <div key={`target-${index}`} className="match-section">
                  <div className="match-content highlighted">{group}</div>
                </div>
              ))
            ) : (
              <p className="no-matches">No matching phrases found in target document</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailedComparison;
