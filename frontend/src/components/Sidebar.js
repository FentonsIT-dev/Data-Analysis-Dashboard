import React from 'react';
import { Link } from 'react-router-dom';
import './Sidebar.css'; // Import the CSS for the sidebar

function Sidebar() {
  return (
    <div className="sidebar">
      <h2 className="sidebar-header">Dashboard</h2>
      <ul className="sidebar-menu">
        <li>
          <Link to="/" className="sidebar-link">
            Home
          </Link>
        </li>
      
        <li>
          <Link to="/upload-excel#" className="sidebar-link">
            Upload Excel
          </Link>
        </li>
       
      </ul>
    </div>
  );
}

export default Sidebar;
