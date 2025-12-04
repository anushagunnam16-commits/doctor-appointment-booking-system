// src/pages/ResetPassword.jsx
import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { resetPassword } from "../services/auth";

export default function ResetPassword() {
  const [search] = useSearchParams();
  const emailFromUrl = search.get("email") || "";

  const [email, setEmail] = useState(emailFromUrl);
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const nav = useNavigate();

  useEffect(() => {
    if (emailFromUrl) {
      setEmail(emailFromUrl);
    }
  }, [emailFromUrl]);

  async function onSubmit(e) {
    e.preventDefault();
    setError("");
    setMessage("");

    if (!email) {
      setError("Email is required.");
      return;
    }
    if (!code || code.length !== 6) {
      setError("Please enter the 6-digit OTP.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      const res = await resetPassword({ email, code, password });
      setMessage(res?.message || "Password updated. You can now log in.");

      setTimeout(() => {
        nav("/login");
      }, 1000);
    } catch (e) {
      setError(
        e?.response?.data?.error ||
          e.message ||
          "Could not reset password. Please check OTP and try again."
      );
    } finally {
      setLoading(false);
    }
  }

  const emailDisabled = !!emailFromUrl;

  return (
    <div className="container">
      <div className="card" style={{ maxWidth: 460, margin: "40px auto" }}>
        <h1>Reset password</h1>
        <p className="subtitle">
          Enter the OTP you received and your new password.
        </p>

        <form className="form" onSubmit={onSubmit}>
          <input
            className="input"
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={emailDisabled}
          />

          <input
            className="input"
            type="text"
            placeholder="6-digit OTP"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            maxLength={6}
            required
          />

          <input
            className="input"
            type="password"
            placeholder="New password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <input
            className="input"
            type="password"
            placeholder="Confirm new password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
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
            {loading ? "Updating…" : "Update password"}
          </button>
        </form>

        <p className="helper" style={{ marginTop: 14 }}>
          Back to <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
}
