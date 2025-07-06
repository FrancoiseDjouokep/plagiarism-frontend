import React from "react";
import { Link, useLocation } from "react-router-dom";
import "../styles/Sidebar.css";

const Sidebar = () => {
  const location = useLocation();

  return (
    <div className="sidebar">
      <ul>
        <li className={location.pathname.includes("all-users") ? "active" : ""}>
          <Link to="/all-users">
            👤 Utilisateurs
          </Link>
        </li>
        <li className={location.pathname.includes("all-analyses") ? "active" : ""}>
          <Link to="/all-analyses">
            📄 Historique d'analyses
          </Link>
        </li>
        <li className={location.pathname.includes("admin") ? "active" : ""}>
          <Link to="/admin">
            🕒 Inscriptions_attentes
          </Link>
        </li>
        <li className={location.pathname.includes("home") ? "active" : ""}>
          <Link to="/home">
            📈 Analyse/Téléversement
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
