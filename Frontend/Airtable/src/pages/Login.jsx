import React from "react";
import "../styles/login.css";

export default function Login() {
  const backendURL = import.meta.env.VITE_API_BASE;

  function handleLogin() {
    window.location.href = `${backendURL}/api/auth/airtable/login`;
  }

  return (
    <div className="page-login">
      <div className="login-card">
        <h2>Login with Airtable</h2>
        <button onClick={handleLogin} className="btn-primary">
          Login with Airtable OAuth
        </button>
      </div>
    </div>
  );
}
