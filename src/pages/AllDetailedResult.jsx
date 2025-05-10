import React, { useEffect, useState } from 'react';
import { API, isTokenExpired, handleLogout } from '../utils/api';
import { useParams } from 'react-router-dom';
import '../styles/AllDetailedResult.css';

function AllDetailedResult() {
  const { uploadedDocId } = useParams();
  const [loading, setLoading] = useState(true);
  const [sourceText, setSourceText] = useState('');
  const [highlightedPhrases, setHighlightedPhrases] = useState([]);
  const [similarDocs, setSimilarDocs] = useState([]);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const token = localStorage.getItem('token');
        if (token && isTokenExpired(token)) {
          const refreshToken = localStorage.getItem('refreshToken');
          if (!refreshToken) throw new Error('Session expirée');
          await API.post('/refresh-token', { refresh: refreshToken });
        }
  
        const response = await API.get(`/api/analyses/document/${uploadedDocId}/detailed`);
        const data = response.data;
  
        setSourceText(data.sourceFullText);
        setHighlightedPhrases(data.sourcePhrases);
        setSimilarDocs(data.similarDocuments);
      } catch (error) {
        console.error('Erreur lors de la récupération des détails d’analyse :', error);
        if (error.response?.status === 401) handleLogout();
      } finally {
        setLoading(false);
      }
    };
  
    fetchDetails();
  }, [uploadedDocId]);

  const highlightText = (text, phrases) => {
    if (!phrases || phrases.length === 0) return text;

    const sortedPhrases = [...phrases].sort((a, b) => b.length - a.length);
    const escaped = sortedPhrases.map(p => p.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
    const regex = new RegExp(`(${escaped.join("|")})`, "gi");

    const parts = text.split(regex);
    return parts.map((part, i) =>
      regex.test(part) ? <mark key={i} className="bg-yellow-200">{part}</mark> : part
    );
  };

  if (loading) return <p>Chargement...</p>;

  return (
    <div className="flex gap-6 p-6">
      <div className="w-1/2 border rounded p-4 overflow-y-auto h-[80vh] bg-gray-50">
        <h2 className="text-lg font-bold mb-2">Document Uploadé</h2>
        <div className="text-sm leading-relaxed">
          {highlightText(sourceText, highlightedPhrases)}
        </div>
      </div>

      <div className="w-1/2 space-y-6 overflow-y-auto h-[80vh]">
        {similarDocs.map(doc => (
          <div key={doc.id} className="border rounded p-4 bg-white shadow">
            <h3 className="font-semibold text-base mb-2">{doc.title}</h3>
            <ul className="list-disc pl-5 text-sm">
              {doc.matchedPhrases.map((phrase, index) => (
                <li key={index} className="text-gray-700">{phrase}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AllDetailedResult;
