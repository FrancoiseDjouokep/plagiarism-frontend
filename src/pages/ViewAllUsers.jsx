import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

const ViewAllUsers = () => {
  const [users, setUsers] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get("http://192.99.42.107:8090/api/select", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUsers(res.data);
      } catch (err) {
        console.error("Erreur lors du chargement des utilisateurs :", err);
      }
    };
    fetchUsers();
  }, [token]);

  return (
    <div className="layout">
      <Navbar />
      <div style={{ display: "flex" }}>
        <Sidebar />
        <div className="admin-container" style={{ marginLeft: "220px", padding: "20px", width: "100%" }}>
          <h2>Liste des utilisateurs</h2>
          <table className="admin-table">
            <thead>
              <tr>
                <th>Nom</th>
                <th>Prénom</th>
                <th>Email</th>
                <th>Rôle</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id}>
                  <td>{u.nom}</td>
                  <td>{u.prenom}</td>
                  <td>{u.email}</td>
                  <td>{u.role?.libelle}</td> {/* ✅ Fix ici */}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ViewAllUsers;
