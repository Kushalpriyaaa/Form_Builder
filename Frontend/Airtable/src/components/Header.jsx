import React from 'react';
import { useAuth } from '../auth/AuthContext';
import '../styles/header.css';

export default function Header() {
  const { user, logout } = useAuth();
  return (
    <header className="app-header">
      <div className="header-left">
        <div className="brand">Bustbrain</div>
      </div>
      <div className="header-right">
        {user ? <div className="user-info">
          <div className="user-name">{user.profile?.name || user.profile?.email || 'User'}</div>
          <button className="btn btn-ghost" onClick={logout}>Logout</button>
        </div> : null}
      </div>
    </header>
  );
}
