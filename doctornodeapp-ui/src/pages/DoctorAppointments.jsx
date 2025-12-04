// src/pages/DoctorAppointments.jsx
import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import {
  getDoctorAppointments,
  updateDoctorAppointmentStatus,
} from "../services/doctorAppointments";

const statusColor = (status) => {
  if (!status) return "#555";
  const s = status.toLowerCase();
  if (s === "booked") return "#92400e";       // brown-ish
  if (s === "confirmed") return "#15803d";    // green
  if (s === "completed") return "#1d4ed8";    // blue
  if (s === "cancelled" || s === "canceled") return "#b91c1c"; // red
  return "#555";
};

function DoctorAppointments() {
  const { isAuthed, user } = useAuth();
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingId, setUpdatingId] = useState(null);
  const [info, setInfo] = useState("");

  // guard – only doctors allowed
  if (!isAuthed || user?.role !== "doctor") {
    return (
      <div className="container" style={{ padding: "clamp(16px, 3vw, 24px)" }}>
        <div className="card" style={{ marginTop: "clamp(16px, 3vw, 24px)" }}>
          <h1 style={{ fontSize: "clamp(28px, 6vw, 36px)" }}>Doctor Dashboard</h1>
          <p className="subtitle" style={{ fontSize: "clamp(14px, 2vw, 16px)" }}>
            You must be logged in as a <b>doctor</b> to view this page.
          </p>
        </div>
      </div>
    );
  }

  async function load() {
    try {
      setLoading(true);
      setError("");
      setInfo("");
      const data = await getDoctorAppointments();
      setRows(Array.isArray(data) ? data : []);
    } catch (e) {
      setError(e?.response?.data?.error || e.message || "Failed to load appointments");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function onChangeStatus(id, status) {
    try {
      setUpdatingId(id);
      setError("");
      setInfo("");
      const res = await updateDoctorAppointmentStatus(id, status);
      setInfo(res?.message || `Status updated to ${status}`);
      // refresh list
      const data = await getDoctorAppointments();
      setRows(Array.isArray(data) ? data : []);
    } catch (e) {
      setError(e?.response?.data?.error || e.message || "Failed to update status");
    } finally {
      setUpdatingId(null);
    }
  }

  return (
    <div className="container" style={{ padding: "clamp(16px, 3vw, 24px)" }}>
      <div className="card" style={{ marginTop: "clamp(16px, 3vw, 24px)" }}>
        <h1 style={{ fontSize: "clamp(28px, 6vw, 36px)" }}>Doctor Dashboard</h1>
        <p className="subtitle" style={{ fontSize: "clamp(14px, 2vw, 16px)" }}>
          View and manage your appointments.
        </p>

        {error && (
          <div className="helper" style={{ color: "#b91c1c", marginBottom: "clamp(6px, 1vw, 8px)", padding: "clamp(8px, 1vw, 10px)" }}>
            ⚠ {error}
          </div>
        )}
        {info && (
          <div className="helper" style={{ color: "#065f46", marginBottom: "clamp(6px, 1vw, 8px)", padding: "clamp(8px, 1vw, 10px)" }}>
            ✔ {info}
          </div>
        )}

        {loading ? (
          <div className="helper" style={{ fontSize: "clamp(13px, 1.5vw, 14px)" }}>Loading appointments…</div>
        ) : rows.length === 0 ? (
          <div className="helper" style={{ fontSize: "clamp(13px, 1.5vw, 14px)" }}>No appointments yet.</div>
        ) : (
          <div style={{ overflowX: "auto", marginTop: "clamp(10px, 2vw, 12px)" }}>
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
              }}
            >
              <thead>
                <tr>
                  <th style={{...thStyle, fontSize: "clamp(12px, 1.5vw, 14px)"}}>Date</th>
                  <th style={{...thStyle, fontSize: "clamp(12px, 1.5vw, 14px)"}}>Time</th>
                  <th style={{...thStyle, fontSize: "clamp(12px, 1.5vw, 14px)"}}>Patient</th>
                  <th style={{...thStyle, fontSize: "clamp(12px, 1.5vw, 14px)"}}>Contact</th>
                  <th style={{...thStyle, fontSize: "clamp(12px, 1.5vw, 14px)"}}>Status</th>
                  <th style={{...thStyle, fontSize: "clamp(12px, 1.5vw, 14px)"}}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((a) => (
                  <tr key={a.id}>
                    <td style={{...tdStyle, fontSize: "clamp(12px, 1.5vw, 14px)"}}>{a.date}</td>
                    <td style={{...tdStyle, fontSize: "clamp(12px, 1.5vw, 14px)"}}>{a.time}</td>
                    <td style={{...tdStyle, fontSize: "clamp(12px, 1.5vw, 14px)"}}>
                      {a.patientName || "—"}
                    </td>
                    <td style={{...tdStyle, fontSize: "clamp(12px, 1.5vw, 14px)"}}>
                      {a.patientEmail || "—"}
                      {a.patientPhone ? (
                        <>
                          <br />
                          <span className="helper" style={{ fontSize: "clamp(11px, 1.3vw, 13px)" }}>{a.patientPhone}</span>
                        </>
                      ) : null}
                    </td>
                    <td style={{...tdStyle, fontSize: "clamp(12px, 1.5vw, 14px)"}}>
                      <span
                        style={{
                          padding: "clamp(3px, 0.5vw, 4px) clamp(6px, 1vw, 8px)",
                          borderRadius: 999,
                          fontSize: "clamp(11px, 1.3vw, 12px)",
                          backgroundColor: "#eff6ff",
                          color: statusColor(a.status),
                          textTransform: "capitalize",
                          fontWeight: 600,
                        }}
                      >
                        {a.status || "booked"}
                      </span>
                    </td>
                    <td style={{...tdStyle, fontSize: "clamp(12px, 1.5vw, 14px)"}}>
                      <div style={{ display: "flex", gap: "clamp(4px, 0.8vw, 6px)", flexWrap: "wrap" }}>
                        <button
                          className="btn"
                          type="button"
                          onClick={() => onChangeStatus(a.id, "confirmed")}
                          disabled={
                            updatingId === a.id ||
                            (a.status && a.status.toLowerCase() === "confirmed")
                          }
                          style={{...smallBtn, padding: "clamp(5px, 1vw, 6px) clamp(8px, 1.5vw, 10px)", fontSize: "clamp(11px, 1.3vw, 12px)"}}
                        >
                          Confirm
                        </button>
                        <button
                          className="btn"
                          type="button"
                          onClick={() => onChangeStatus(a.id, "completed")}
                          disabled={updatingId === a.id}
                          style={{...smallBtn, padding: "clamp(5px, 1vw, 6px) clamp(8px, 1.5vw, 10px)", fontSize: "clamp(11px, 1.3vw, 12px)"}}
                        >
                          Complete
                        </button>
                        <button
                          className="btn"
                          type="button"
                          onClick={() => onChangeStatus(a.id, "cancelled")}
                          disabled={updatingId === a.id}
                          style={{
                            ...smallBtn,
                            padding: "clamp(5px, 1vw, 6px) clamp(8px, 1.5vw, 10px)",
                            fontSize: "clamp(11px, 1.3vw, 12px)",
                            background: "linear-gradient(135deg, #b91c1c, #7f1d1d)",
                          }}
                        >
                          Cancel
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

const thStyle = {
  textAlign: "left",
  borderBottom: "1px solid #e2e8f0",
  padding: "clamp(6px, 1vw, 8px)",
  fontWeight: 600,
  fontSize: "clamp(12px, 1.5vw, 14px)",
};

const tdStyle = {
  borderBottom: "1px solid #f1f5f9",
  padding: "clamp(6px, 1vw, 8px)",
  fontSize: "clamp(12px, 1.5vw, 14px)",
  verticalAlign: "top",
};

const smallBtn = {
  padding: "clamp(5px, 1vw, 6px) clamp(8px, 1.5vw, 10px)",
  borderRadius: 999,
  fontSize: "clamp(11px, 1.3vw, 12px)",
  boxShadow: "none",
};

export default DoctorAppointments;
