import React, { useEffect, useState } from "react";
import axios from 'axios';
import "../styles/AdminDashboard.css";
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import '../styles/Layout.css';

function AdminValidationPage() {
  const [pendingUsers, setPendingUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchPendingUsers();
  }, []);

  const token = localStorage.getItem("token");

  const fetchPendingUsers = async () => {
    try {
      const response = await axios.get('http://192.99.42.107:8090/api/admin/pending-users', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      console.log("✅ Reçu :", response.data);

      // ✅ On vérifie que la réponse est bien un tableau
      if (Array.isArray(response.data)) {
        setPendingUsers(response.data);
      } else {
        console.warn("⚠️ Les données reçues ne sont pas un tableau :", response.data);
        setPendingUsers([]);
        setMessage("Les données reçues sont incorrectes.");
      }

    } catch (error) {
      console.error("❌ Erreur lors du chargement :", error);
      setMessage("Erreur lors du chargement des inscriptions.");
      setPendingUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const validerInscription = async (id) => {
    try {
      await axios.post(`http://192.99.42.107:8090/api/admin/valider-inscription/${id}`, {}, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setMessage("✅ Inscription validée !");
      setPendingUsers(pendingUsers.filter((user) => user.id !== id));
    } catch (error) {
      setMessage(error.response?.data?.message || "Erreur lors de la validation.");
    }
  };

  const rejeterInscription = async (id) => {
    const raison = prompt("Raison du rejet :", "Profil non conforme");
    if (raison !== null) {
      try {
        await axios.post(`http://192.99.42.107:8090/api/admin/rejeter-inscription/${id}`, { raison }, { // ✅ Envoie la raison
          headers: { Authorization: `Bearer ${token}` }
        });
        setMessage("❌ Inscription rejetée !");
        setPendingUsers(pendingUsers.filter((user) => user.id !== id));
      } catch (error) {
        setMessage(error.response?.data?.message || "Erreur lors du rejet.");
      }
    }
  };

  return (
    <div className="layout">
      <Navbar />
      <div style={{ display: "flex" }}>
        <Sidebar />
        <div className="admin-container" style={{ marginLeft: "220px", padding: "20px", width: "100%" }}>
          <h1>Validation des inscriptions</h1>

          {message && <p className="admin-message">{message}</p>}

          {loading ? (
            <p>Chargement...</p>
          ) : !Array.isArray(pendingUsers) || pendingUsers.length === 0 ? (
            <p>Aucune demande en attente.</p>
          ) : (
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Nom</th>
                  <th>Prénom</th>
                  <th>Email</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {pendingUsers.map((user) => (
                  <tr key={user.id}>
                    <td>{user.nom}</td>
                    <td>{user.prenom}</td>
                    <td>{user.email}</td>
                    <td>
                      <button
                        className="btn btn-validate"
                        onClick={() => validerInscription(user.id)}
                      >
                        Valider
                      </button>
                      <button
                        className="btn btn-reject"
                        onClick={() => rejeterInscription(user.id)}
                      >
                        Rejeter
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminValidationPage;

