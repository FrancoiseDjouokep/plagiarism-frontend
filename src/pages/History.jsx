import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import '../styles/Layout.css';
import '../styles/Table.css';

const History = () => {
  const [analyses, setAnalyses] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAnalyses = async () => {
      const token = localStorage.getItem('token');
      try {
        const response = await axios.get('http://192.99.42.107:8090/api/analysis/my-analyses', {
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

  const handleRowClick = (id) => {
    navigate(`/detailed-comparison/${id}`);
  };

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
                <tr key={index} onClick={() => handleRowClick(a.id)} className="clickable-row">
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
