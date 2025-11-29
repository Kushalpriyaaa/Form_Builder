import React, { useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { useAuth } from '../auth/AuthContext';
import '../styles/login.css';

export default function OAuthCallback() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { loginWithToken } = useAuth();

  useEffect(() => {
    // The backend typically handles the exchange and may redirect to frontend with ?token=...
    const token = searchParams.get('token');
    if (token) {
      loginWithToken(token, null);
      navigate('/');
      return;
    }

    // If there's a code, we can hit backend callback endpoint to finalize (GET redirect normally)
    const code = searchParams.get('code');
    if (code) {
      // Best practice: allow backend to handle exchange, which usually returns redirect with token
      // But if backend returns JSON, you can call it here.
      (async () => {
        try {
          const res = await api.post('/api/auth/airtable/callback', { code });
          if (res?.token) {
            loginWithToken(res.token, res.user || null);
            navigate('/');
          } else {
            navigate('/login');
          }
        } catch (err) {
          console.error(err);
          navigate('/login');
        }
      })();
      return;
    }

    // otherwise go to login
    navigate('/login');
    // eslint-disable-next-line
  }, []);

  return (
    <div className="page-login">
      <div className="login-card">
        <h3>Completing login...</h3>
        <p>Please wait while we finalize your authentication.</p>
      </div>
    </div>
  );
}
