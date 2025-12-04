import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getMyAppointments,
  cancelAppointment,
} from "../services/appointments";
import { useAuth } from "../context/AuthContext";

const statusColor = (status) => {
  if (!status) return "#555";
  const s = status.toLowerCase();
  if (s === "booked" || s === "confirmed") return "green";
  if (s === "cancelled" || s === "canceled") return "red";
  if (s === "completed") return "blue";
  return "#555";
};

function MyAppointments() {
  const { token, isAuthed } = useAuth();
  const nav = useNavigate();

  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [busyId, setBusyId] = useState(null); // for cancel in progress

  useEffect(() => {
    let isMounted = true;

    async function load() {
      if (!isAuthed || !token) {
        setError("You must be logged in to see your appointments.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError("");
        const data = await getMyAppointments();
        if (isMounted) {
          setAppointments(Array.isArray(data) ? data : []);
        }
      } catch (e) {
        if (isMounted) {
          setError(e.message || "Failed to load appointments");
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    load();
    return () => {
      isMounted = false;
    };
  }, [isAuthed, token]);

  async function onCancel(appt) {
    if (!window.confirm("Cancel this appointment?")) return;
    try {
      setBusyId(appt.id);
      const res = await cancelAppointment(appt.id);
      const updated = res?.appointment;

      setAppointments((prev) =>
        prev.map((a) =>
          a.id === appt.id
            ? updated || { ...a, status: "cancelled" }
            : a
        )
      );
    } catch (e) {
      alert(e?.response?.data?.error || e.message || "Cancel failed");
    } finally {
      setBusyId(null);
    }
  }

  function onReschedule(appt) {
    // Send to booking screen with pre-filled doctor/date/time + appointmentId
    nav(
      `/book?doctorId=${encodeURIComponent(
        appt.doctorId
      )}&date=${encodeURIComponent(
        appt.date
      )}&time=${encodeURIComponent(appt.time)}&appointmentId=${appt.id}`
    );
  }

  if (loading) {
    return <div style={{ padding: "clamp(16px, 3vw, 24px)", fontSize: "clamp(13px, 1.5vw, 14px)" }}>Loading your appointments...</div>;
  }

  if (error) {
    return (
      <div style={{ padding: "clamp(16px, 3vw, 24px)", color: "red", fontSize: "clamp(13px, 1.5vw, 14px)" }}>
        Error: {error}
      </div>
    );
  }

  if (!appointments.length) {
    return (
      <div style={{ padding: "clamp(16px, 3vw, 24px)", fontSize: "clamp(13px, 1.5vw, 14px)" }}>
        You don't have any appointments yet.
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: "clamp(16px, 3vw, 24px)" }}>
      <div className="card" style={{ marginTop: "clamp(16px, 3vw, 24px)" }}>
        <h1 style={{ fontSize: "clamp(28px, 6vw, 36px)" }}>My Appointments</h1>
        <p className="subtitle" style={{ fontSize: "clamp(14px, 2vw, 16px)" }}>
          View, cancel, or reschedule your upcoming visits.
        </p>

        <div style={{ overflowX: "auto" }}>
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              marginTop: "clamp(10px, 2vw, 12px)",
            }}
          >
            <thead>
              <tr>
                <th style={{...thStyle, fontSize: "clamp(12px, 1.5vw, 14px)"}}>Date</th>
                <th style={{...thStyle, fontSize: "clamp(12px, 1.5vw, 14px)"}}>Time</th>
                <th style={{...thStyle, fontSize: "clamp(12px, 1.5vw, 14px)"}}>Doctor</th>
                <th style={{...thStyle, fontSize: "clamp(12px, 1.5vw, 14px)"}}>City</th>
                <th style={{...thStyle, fontSize: "clamp(12px, 1.5vw, 14px)"}}>Fee</th>
                <th style={{...thStyle, fontSize: "clamp(12px, 1.5vw, 14px)"}}>Status</th>
                <th style={{...thStyle, fontSize: "clamp(12px, 1.5vw, 14px)"}}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {appointments.map((a) => {
                const isCancelled =
                  a.status &&
                  a.status.toLowerCase().startsWith("cancel");
                const isCompleted =
                  a.status &&
                  a.status.toLowerCase() === "completed";

                return (
                  <tr key={a.id}>
                    <td style={{...tdStyle, fontSize: "clamp(12px, 1.5vw, 14px)"}}>{a.date}</td>
                    <td style={{...tdStyle, fontSize: "clamp(12px, 1.5vw, 14px)"}}>{a.time}</td>
                    <td style={{...tdStyle, fontSize: "clamp(12px, 1.5vw, 14px)"}}>{a.doctorName}</td>
                    <td style={{...tdStyle, fontSize: "clamp(12px, 1.5vw, 14px)"}}>{a.city}</td>
                    <td style={{...tdStyle, fontSize: "clamp(12px, 1.5vw, 14px)"}}>
                      {a.fee != null ? `$${a.fee}` : "-"}
                    </td>
                    <td style={{...tdStyle, fontSize: "clamp(12px, 1.5vw, 14px)"}}>
                      <span
                        style={{
                          padding: "clamp(3px, 0.5vw, 4px) clamp(6px, 1vw, 8px)",
                          borderRadius: "999px",
                          fontSize: "clamp(11px, 1.3vw, 12px)",
                          backgroundColor: "#f0f0f0",
                          color: statusColor(a.status),
                          textTransform: "capitalize",
                        }}
                      >
                        {a.status || "booked"}
                      </span>
                    </td>
                    <td style={{...tdStyle, fontSize: "clamp(12px, 1.5vw, 14px)"}}>
                      <div style={{ display: "flex", gap: "clamp(4px, 0.8vw, 8px)", flexWrap: "wrap" }}>
                        <button
                          className="btn"
                          style={{
                            padding: "clamp(5px, 1vw, 6px) clamp(8px, 1.5vw, 10px)",
                            fontSize: "clamp(11px, 1.3vw, 12px)",
                            background:
                              "linear-gradient(135deg,#f97316,#ea580c)",
                          }}
                          onClick={() => onReschedule(a)}
                          disabled={isCancelled || isCompleted}
                        >
                          Reschedule
                        </button>
                        <button
                          className="btn"
                          style={{
                            padding: "clamp(5px, 1vw, 6px) clamp(8px, 1.5vw, 10px)",
                            fontSize: "clamp(11px, 1.3vw, 12px)",
                            background:
                              "linear-gradient(135deg,#ef4444,#b91c1c)",
                          }}
                          onClick={() => onCancel(a)}
                          disabled={isCancelled || isCompleted || busyId === a.id}
                        >
                          {busyId === a.id ? "Cancelling…" : "Cancel"}
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

const thStyle = {
  textAlign: "left",
  borderBottom: "1px solid #ddd",
  padding: "clamp(6px, 1vw, 8px)",
  fontWeight: 600,
  fontSize: "clamp(12px, 1.5vw, 14px)",
};

const tdStyle = {
  borderBottom: "1px solid #eee",
  padding: "clamp(6px, 1vw, 8px)",
  fontSize: "clamp(12px, 1.5vw, 14px)",
};

export default MyAppointments;
