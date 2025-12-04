import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/client";
import { useAuth } from "../context/AuthContext";

export default function Doctors(){
  const { isAuthed } = useAuth();
  const [q, setQ] = useState("");
  const [city, setCity] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [rows, setRows] = useState([]);

  async function load(){ 
    if(!isAuthed) return;
    setLoading(true); setError("");
    try{
      const { data } = await api.get("/api/doctors", { params: { q, city } });
      setRows(data || []);
    }catch(e){
      setError(e?.response?.data?.error || e.message || "Failed to load doctors");
    }finally{
      setLoading(false);
    }
  }

  useEffect(()=>{ load(); /* initial */ }, []); // eslint-disable-line

  function onSubmit(e){
    e.preventDefault();
    load();
  }

  return (
    <div className="container" style={{ padding: "clamp(16px, 3vw, 24px)" }}>
      <div className="card" style={{ marginTop: "clamp(16px, 3vw, 24px)" }}>
        <h1 style={{ fontSize: "clamp(28px, 6vw, 36px)" }}>Find Doctors</h1>
        <p className="subtitle" style={{ fontSize: "clamp(14px, 2vw, 16px)" }}>Search by name, specialty or insurance, optionally filter by city.</p>

        <form className="form" onSubmit={onSubmit} style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 200px), 1fr))",
          gap: "clamp(10px, 2vw, 12px)",
          marginBottom: "clamp(16px, 3vw, 20px)"
        }}>
          <input className="input" placeholder="Search name or specialty (e.g., Cardiology)" value={q} onChange={e=>setQ(e.target.value)} style={{ padding: "clamp(10px, 2vw, 12px)" }} />
          <input className="input" placeholder="City (optional)" value={city} onChange={e=>setCity(e.target.value)} style={{ padding: "clamp(10px, 2vw, 12px)" }} />
          <input className="input" placeholder="Insurance (optional)" value={city} onChange={e=>setCity(e.target.value)} style={{ padding: "clamp(10px, 2vw, 12px)" }} />
          <button className="btn" disabled={loading} style={{ padding: "clamp(10px, 2vw, 12px) clamp(14px, 3vw, 16px)", fontSize: "clamp(13px, 1.5vw, 15px)", whiteSpace: "nowrap" }}>{loading ? "Searching…" : "Search"}</button>
        </form>

        {error && <div className="helper" style={{color:"#b91c1c", marginTop: "clamp(8px, 2vw, 10px)", padding: "clamp(8px, 1vw, 10px)" }}>⚠ {error}</div>}

        <div style={{
          display: "grid",
          gap: "clamp(12px, 2vw, 16px)",
          marginTop: "clamp(16px, 3vw, 20px)"
        }}>
          {rows.map(d => (
            <div key={d.id} className="card" style={{
              boxShadow: "none",
              borderColor: "#e2e8f0",
              padding: "clamp(16px, 2vw, 28px)"
            }}>
              {/* title row with Book button on the right */}
              <div style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                gap: "clamp(8px, 2vw, 12px)",
                flexWrap: "wrap"
              }}>
                <h2 style={{
                  marginBottom: "clamp(4px, 1vw, 6px)",
                  fontSize: "clamp(18px, 4vw, 24px)"
                }}>{d.name}</h2>
                <Link
                  className="btn"
                  to={`/book?doctorId=${encodeURIComponent(d.id)}`}
                  title={`Book ${d.name}`}
                  style={{
                    padding: "clamp(8px, 1.5vw, 10px) clamp(12px, 2vw, 16px)",
                    fontSize: "clamp(12px, 1.5vw, 14px)",
                    whiteSpace: "nowrap"
                  }}
                >
                  Book
                </Link>
              </div>

              <div className="helper" style={{ fontSize: "clamp(13px, 1.5vw, 14px)", marginTop: "clamp(6px, 1vw, 8px)" }}>Specialty: <b>{d.specialty || "—"}</b></div>
              <div className="helper" style={{ fontSize: "clamp(13px, 1.5vw, 14px)", marginTop: "clamp(4px, 0.8vw, 6px)" }}>City: <b>{d.city || "—"}</b> · Fee: <b>{d.fee != null ? ("$"+d.fee) : "—"}</b></div>
              <div className="helper" style={{ fontSize: "clamp(13px, 1.5vw, 14px)", marginTop: "clamp(4px, 0.8vw, 6px)" }}>Email: <b>{d.email}</b> {d.phone ? <> · Phone: <b>{d.phone}</b></> : null}</div>
            </div>
          ))}
          {!loading && rows.length === 0 && <div className="helper" style={{marginTop: "clamp(6px, 1vw, 8px)", padding: "clamp(8px, 1vw, 12px)", textAlign: "center" }}>No doctors yet. Try a different search.</div>}
        </div>
      </div>
    </div>
  );
}
