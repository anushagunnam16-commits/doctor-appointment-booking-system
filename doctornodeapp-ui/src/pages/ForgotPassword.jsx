// src/pages/ForgotPassword.jsx
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { requestPasswordReset } from "../services/auth";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const nav = useNavigate();

  async function onSubmit(e) {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);
    try {
      const res = await requestPasswordReset(email);
      setMessage(res?.message || "If an account exists, an OTP has been sent.");

      // after success, go to reset screen with email in query
      setTimeout(() => {
        nav(`/reset-password?email=${encodeURIComponent(email)}`);
      }, 800);
    } catch (e) {
      setError(
        e?.response?.data?.error ||
          e.message ||
          "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container">
      <div className="card" style={{ maxWidth: 460, margin: "40px auto" }}>
        <h1>Forgot password</h1>
        <p className="subtitle">
          Enter the email you used to register. We will send a 6-digit OTP to
          reset your password.
        </p>

        <form className="form" onSubmit={onSubmit}>
          <input
            className="input"
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          {error && (
            <div className="helper" style={{ color: "#b91c1c", marginTop: 8 }}>
              ⚠ {error}
            </div>
          )}
          {message && (
            <div className="helper" style={{ color: "#15803d", marginTop: 8 }}>
              ✅ {message}
            </div>
          )}

          <button className="btn" type="submit" disabled={loading}>
            {loading ? "Sending OTP…" : "Send OTP"}
          </button>
        </form>

        <p className="helper" style={{ marginTop: 14 }}>
          Remember your password? <Link to="/login">Back to login</Link>
        </p>
      </div>
    </div>
  );
}
