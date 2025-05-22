import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';
import '../styles/Layout.css';
import '../styles/Table.css'; // Ajoute ce fichier pour styliser le tableau

const History = () => {
  const [analyses, setAnalyses] = useState([]);

  useEffect(() => {
    const fetchAnalyses = async () => {
      const token = localStorage.getItem('token');
      try {
        const response = await axios.get('http://localhost:8080/api/analysis/my-analyses', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setAnalyses(response.data);
      } catch (err) {
        console.error("Erreur lors du chargement de l'historique :", err);
      }
    };

    fetchAnalyses();
  }, []);

  return (
    <div className="layout">
      <Navbar />
      <div className="history-page">
        <h2>Mon historique d’analyses</h2>
        {analyses.length > 0 ? (
          <table className="history-table">
            <thead>
              <tr>
                <th>Document Source</th>
                <th>Document Cible</th>
                <th>Similarité</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {analyses.map((a, index) => (
                <tr key={index}>
                  <td>{a.sourceDocumentTitle || a.sourceDocumentId}</td>
                  <td>{a.targetDocumentTitle || a.targetDocumentId}</td>
                  <td>{Math.round(a.similarityScore)}%</td>
                  <td>{new Date(a.creationDate).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>Aucune analyse trouvée.</p>
        )}
      </div>
    </div>
  );
};

export default History;
