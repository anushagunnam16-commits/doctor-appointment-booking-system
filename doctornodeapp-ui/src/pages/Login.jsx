import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const { login, loading, error } = useAuth();
  const nav = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function onSubmit(e) {
    e.preventDefault();
    try {
      // login() returns the user object from backend
      const user = await login({ email, password });

      if (user?.role === "admin") {
        nav("/admin/users");
      } else if (user?.role === "doctor") {
        // change path if your doctor page is different
        nav("/doctor/appointments");
      } else {
        // patient / normal user
        nav("/");
      }
    } catch (e) {
      const status = e?.response?.status;
      const msg = e?.response?.data?.error || e.message || "";
      // If backend blocks with 409 for unverified email, send user to /verify-email
      if (status === 409 || /not verified/i.test(msg)) {
        nav(`/verify-email?email=${encodeURIComponent(email)}`);
        return;
      }
      // Otherwise, AuthContext already set the error; just stay here
    }
  }

  return (
    <div className="container" style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh", padding: "24px" }}>
      <div className="card" style={{ width: "100%", maxWidth: 460, margin: "20px auto" }}>
        <h1 style={{ fontSize: "clamp(28px, 6vw, 32px)" }}>Welcome back</h1>
        <p className="subtitle">
          Sign in to book appointments and manage your profile.
        </p>
        <form className="form" onSubmit={onSubmit} style={{ display: "grid", gap: "14px" }}>
          <input
            className="input"
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{ width: "100%", padding: "12px 14px" }}
          />
          <input
            className="input"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{ width: "100%", padding: "12px 14px" }}
          />
          {error && (
            <div className="helper" style={{ color: "#b91c1c", padding: "8px 0" }}>
              ⚠ {error}
            </div>
          )}
          <button className="btn" disabled={loading} style={{ width: "100%", padding: "12px 16px", fontSize: "clamp(14px, 2vw, 16px)" }}>
            {loading ? "Signing in…" : "Sign in"}
          </button>
        </form>
        
                <p className="helper" style={{ marginTop: 10 }}>
          <Link to="/forgot-password">Forgot password?</Link>
        </p>

        <p className="helper" style={{ marginTop: 8 }}>
          New here? <Link to="/register">Create an account</Link>
        </p>

      </div>
    </div>
  );
}
