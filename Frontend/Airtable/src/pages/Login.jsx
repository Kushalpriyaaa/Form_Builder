import React from 'react';
import '../styles/login.css';

export default function Login() {
  // eslint-disable-next-line no-undef
  const api = import.meta.env.VITE_API_URL || "http://localhost:5000";

  return (
    <div className="page-login">
      <div className="login-card">
        <h2>Sign in with Airtable</h2>
        <p>Click the button below to authenticate with Airtable.</p>
        <a className="btn btn-primary" href={`${api}/api/auth/airtable/login`}>Login with Airtable</a>
        <p className="muted">You will be redirected to Airtable to grant access.</p>
      </div>
    </div>
  );
}
