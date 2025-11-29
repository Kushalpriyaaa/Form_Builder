import React, { useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

export default function OAuthCallback() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const { loginWithToken } = useAuth();

  useEffect(() => {
    const token = params.get("token");

    if (token) {
      loginWithToken(token, null);
      navigate("/dashboard");
      return;
    }

    navigate("/login");
  }, []);

  return (
    <div className="page-login">
      <h3>Completing login...</h3>
    </div>
  );
}
