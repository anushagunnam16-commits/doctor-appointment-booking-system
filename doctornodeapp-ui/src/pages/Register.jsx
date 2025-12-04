import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Register(){
  const { register, loading, error } = useAuth();
  const nav = useNavigate();
  const [name,setName] = useState("");
  const [email,setEmail] = useState("");
  const [password,setPassword] = useState("");

  async function onSubmit(e){
    e.preventDefault();
    await register({ name, email, password });
    nav("/login");
  }

  return (
    <div className="container" style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh", padding: "24px" }}>
      <div className="card" style={{ width: "100%", maxWidth: 520, margin: "20px auto" }}>
        <h1 style={{ fontSize: "clamp(28px, 6vw, 32px)" }}>Create account</h1>
        <p className="subtitle" style={{ fontSize: "clamp(14px, 2vw, 16px)" }}>Join and start booking appointments.</p>
        <form className="form" onSubmit={onSubmit} style={{ display: "grid", gap: "14px" }}>
          <input className="input" placeholder="Full name" value={name} onChange={e=>setName(e.target.value)} required style={{ width: "100%", padding: "12px 14px" }} />
          <input className="input" type="email" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} required style={{ width: "100%", padding: "12px 14px" }} />
          <input className="input" type="password" placeholder="Password" value={password} onChange={e=>setPassword(e.target.value)} required style={{ width: "100%", padding: "12px 14px" }} />
          {error && <div className="helper" style={{color:"#b91c1c", padding: "8px 0"}}>⚠ {error}</div>}
          <button className="btn" disabled={loading} style={{ width: "100%", padding: "12px 16px", fontSize: "clamp(14px, 2vw, 16px)" }}>{loading ? "Creating…" : "Create account"}</button>
        </form>
        <p className="helper" style={{marginTop: "14px", textAlign: "center", fontSize: "clamp(13px, 1.5vw, 14px)"}}>
          Already have an account? <Link to="/login">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
