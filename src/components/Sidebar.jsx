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
            👤 View All Users
          </Link>
        </li>
        <li className={location.pathname.includes("all-analyses") ? "active" : ""}>
          <Link to="/all-analyses">
            📄 View All Analysis
          </Link>
        </li>
        <li className={location.pathname.includes("admin") ? "active" : ""}>
          <Link to="/admin">
            🕒 View Pending Users
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
