import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../services/backendApi";

function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleSignup = async () => {
    setError("");
    if (!name || !email || !password) { setError("All fields are required"); return; }
    if (password.length < 6) { setError("Password must be at least 6 characters"); return; }

    setLoading(true);
    try {
      await API.post("/auth/register", { name, email, password });
      navigate("/login", { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || "Signup failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      {/* Left visual panel */}
      <div className="auth-visual">
        <div className="auth-visual-text">
          <h2>"Travel is the only thing you buy that makes you richer."</h2>
          <p>— Anonymous</p>
        </div>
      </div>

      {/* Right form panel */}
      <div className="auth-form-side">
        <div className="auth-card">
          <h2>Create account</h2>
          <p className="auth-sub">Join TravelX and start exploring</p>

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
            <label>Full Name</label>
            <input
              type="text"
              placeholder="John Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoComplete="name"
            />
          </div>

          <div className="auth-field">
            <label>Email</label>
            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
            />
          </div>

          <div className="auth-field">
            <label>Password</label>
            <input
              type="password"
              placeholder="Min. 6 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSignup()}
              autoComplete="new-password"
            />
          </div>

          <button
            className="auth-submit"
            onClick={handleSignup}
            disabled={loading}
          >
            {loading ? "Creating account…" : "Create Account"}
          </button>

          <p className="auth-footer-text">
            Already have an account?{" "}
            <Link to="/login">Login</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Signup;