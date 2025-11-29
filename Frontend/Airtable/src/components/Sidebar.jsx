import React from 'react';
import { NavLink } from 'react-router-dom';
import '../styles/sidebar.css';

export default function Sidebar() {
  return (
    <aside className="app-sidebar">
      <nav>
        <ul>
          <li><NavLink to="/" end>Dashboard</NavLink></li>
          <li><NavLink to="/builder">Form Builder</NavLink></li>
        </ul>
      </nav>
    </aside>
  );
}
