import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

const ViewAllAnalysis = () => {
  const [analyses, setAnalyses] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchAnalyses = async () => {
      try {
        const res = await axios.get("http://192.99.42.107:8090/api/analysis/get-all", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setAnalyses(res.data);
      } catch (err) {
        console.error("Erreur lors du chargement des analyses :", err);
      }
    };
    fetchAnalyses();
  }, [token]);

  return (
    <div className="layout">
      <Navbar />
      <div style={{ display: "flex" }}>
        <Sidebar />
        <div className="admin-container" style={{ marginLeft: "220px", padding: "20px", width: "100%" }}>
          <h2>Toutes les analyses</h2>
          <table className="admin-table">
            <thead>
              <tr>
                <th>Source</th>
                <th>Cible</th>
                <th>Similarité</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {analyses.map((a, index) => (
                <tr key={index}>
                  <td>{a.sourceDocumentTitle}</td>
                  <td>{a.targetDocumentTitle}</td>
                  <td>{Math.round(a.similarityScore)}%</td>
                  <td>{new Date(a.creationDate).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ViewAllAnalysis;
