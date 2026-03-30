import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../services/backendApi";
import { useAuth } from "../context/AuthContext";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async () => {
    setError("");
    if (!email || !password) { setError("All fields are required"); return; }

    setLoading(true);
    try {
      const res = await API.post("/auth/login", { email, password });
      login(res.data);
      navigate("/", { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      {/* Left visual panel */}
      <div className="auth-visual">
        <div className="auth-visual-text">
          <h2>"The world is a book — those who do not travel read only one page."</h2>
          <p>— Saint Augustine</p>
        </div>
      </div>

      {/* Right form panel */}
      <div className="auth-form-side">
        <div className="auth-card">
          <h2>Welcome back</h2>
          <p className="auth-sub">Login to access your saved destinations</p>

          {error && (
            <div style={{
              background: "rgba(229,57,53,0.1)", border: "1px solid rgba(229,57,53,0.3)",
              borderRadius: 8, padding: "10px 14px", marginBottom: 16,
              color: "#c62828", fontSize: 13,
            }}>
              {error}
            </div>
          )}

          <div className="auth-field">
            <label>Email</label>
            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleLogin()}
              autoComplete="email"
            />
          </div>

          <div className="auth-field">
            <label>Password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleLogin()}
              autoComplete="current-password"
            />
          </div>

          <button
            className="auth-submit"
            onClick={handleLogin}
            disabled={loading}
          >
            {loading ? "Logging in…" : "Login"}
          </button>

          <p className="auth-footer-text">
            Don't have an account?{" "}
            <Link to="/signup">Create one</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;