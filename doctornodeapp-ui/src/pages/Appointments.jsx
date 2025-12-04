import { useEffect, useMemo, useState } from "react";
import { useSearchParams, Link, useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import { useAuth } from "../context/AuthContext";
import { fetchDoctors, fetchSlots, createAppointment } from "../services/slots";
import { rescheduleAppointment } from "../services/appointments";

function Section({ title, children }) {
  return (
    <div style={{ marginTop: "clamp(14px, 2vw, 18px)" }}>
      <div className="helper" style={{ fontWeight: 700, marginBottom: "clamp(6px, 1vw, 8px)", fontSize: "clamp(13px, 1.5vw, 14px)" }}>
        {title}
      </div>
      {children}
    </div>
  );
}

function Chip({ active, disabled, label, onClick, title }) {
  return (
    <button
      className="btn"
      title={title || ""}
      onClick={onClick}
      disabled={disabled}
      style={{
        padding: "clamp(6px, 1vw, 8px) clamp(10px, 1.5vw, 12px)",
        borderRadius: 12,
        fontWeight: 700,
        fontSize: "clamp(12px, 1.3vw, 13px)",
        background: active
          ? "linear-gradient(135deg, var(--blue-600), var(--blue-800))"
          : "#fff",
        color: active ? "#fff" : "var(--text)",
        border: "1px solid #c7d2fe",
        boxShadow: active ? "var(--shadow)" : "none",
        opacity: disabled ? 0.5 : 1,
        cursor: disabled ? "not-allowed" : "pointer",
        whiteSpace: "nowrap"
      }}
    >
      {label}
    </button>
  );
}

export default function Appointments() {
  const { isAuthed, user } = useAuth();
  const nav = useNavigate();
  const [sp] = useSearchParams();

  if (!isAuthed) {
    return (
      <div className="container" style={{ padding: "clamp(16px, 3vw, 24px)" }}>
        <div className="card" style={{ width: "100%", maxWidth: 700, margin: "clamp(20px, 4vw, 32px) auto" }}>
          <h1 style={{ fontSize: "clamp(28px, 6vw, 36px)" }}>Sign in to book</h1>
          <p className="subtitle" style={{ fontSize: "clamp(14px, 2vw, 16px)" }}>
            You need to be logged in to view slots and book an appointment.
          </p>
          <div style={{ display: "flex", gap: "clamp(8px, 2vw, 12px)", flexWrap: "wrap" }}>
            <Link className="btn" to="/login" style={{ flex: "1 1 100px", padding: "12px 16px", fontSize: "clamp(13px, 1.5vw, 14px)" }}>
              Go to Login
            </Link>
            <Link className="btn" to="/register" style={{ flex: "1 1 100px", padding: "12px 16px", fontSize: "clamp(13px, 1.5vw, 14px)" }}>
              Create account
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const [doctors, setDoctors] = useState([]);
  const [doctorId, setDoctorId] = useState("");
  const [dateISO, setDateISO] = useState(dayjs().format("YYYY-MM-DD"));
  const [slots, setSlots] = useState([]);
  const [selected, setSelected] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const [msg, setMsg] = useState("");
  const [rescheduleId, setRescheduleId] = useState(null);

  const patientId = user?.id || 18;

  // preselect doctor/date/time/rescheduleId from query
  useEffect(() => {
    const qdoc = sp.get("doctorId");
    const qdate = sp.get("date");
    const qtime = sp.get("time");
    const qres = sp.get("appointmentId");

    if (qdoc) setDoctorId(String(qdoc));
    if (qdate) setDateISO(qdate);
    if (qtime) setSelected(qtime);
    if (qres) setRescheduleId(Number(qres) || null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const list = await fetchDoctors();
        if (!alive) return;
        setDoctors(list);
        if (!doctorId && list.length) setDoctorId(String(list[0].id));
      } catch (e) {
        if (!alive) return;
        setErr(
          e?.response?.data?.error ||
            e.message ||
            "Failed to load doctors"
        );
      }
    })();
    return () => {
      alive = false;
    };
  }, []); // mount

  useEffect(() => {
    if (!doctorId || !dateISO) return;
    let alive = true;
    setSelected((prev) => prev); // keep selected if valid
    setErr("");
    (async () => {
      try {
        const s = await fetchSlots({ doctorId: Number(doctorId), dateISO });
        if (!alive) return;
        setSlots(s);
      } catch (e) {
        if (!alive) return;
        setErr(
          e?.response?.data?.error || e.message || "Failed to load slots"
        );
        setSlots([]);
      }
    })();
    return () => {
      alive = false;
    };
  }, [doctorId, dateISO]);

  const doctor = useMemo(
    () => doctors.find((d) => String(d.id) === String(doctorId)),
    [doctors, doctorId]
  );

  async function onBook(e) {
    e?.preventDefault?.();
    setErr("");
    setMsg("");

    if (!doctorId || !dateISO || !selected) {
      setErr("Please choose doctor, date, and a time slot.");
      return;
    }

    setLoading(true);
    try {
      if (rescheduleId) {
        const res = await rescheduleAppointment(rescheduleId, {
          date: dateISO,
          time: selected,
        });
        setMsg(res?.message || "Appointment rescheduled.");
      } else {
        const res = await createAppointment({
          doctorId: Number(doctorId),
          patientId: Number(patientId),
          dateISO,
          time: selected,
        });
        setMsg(
          `Booked successfully${
            res?.id ? " — ID: " + res.id : ""
          }.`
        );
      }

      const s = await fetchSlots({ doctorId: Number(doctorId), dateISO });
      setSlots(s);
      setSelected("");
      setRescheduleId(null);
      // Optionally go back to My Appointments:
      // nav("/appointments");
    } catch (e) {
      setErr(
        e?.response?.data?.error || e.message || "Booking failed"
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container" style={{ padding: "clamp(16px, 3vw, 24px)" }}>
      <div className="card" style={{ marginTop: "clamp(16px, 3vw, 24px)" }}>
        <h1 style={{ fontSize: "clamp(28px, 6vw, 36px)" }}>{rescheduleId ? "Reschedule Appointment" : "Book an Appointment"}</h1>
        <p className="subtitle" style={{ fontSize: "clamp(14px, 2vw, 16px)" }}>
          {rescheduleId
            ? "Choose a new date and time for your appointment."
            : "Pick your doctor, choose a date, and select a time slot."}
        </p>

        {err ? (
          <div className="helper" style={{ color: "#b91c1c", padding: "8px 0" }}>
            ⚠ {err}
          </div>
        ) : null}
        {msg ? (
          <div className="helper" style={{ color: "#065f46", padding: "8px 0" }}>
            ✔ {msg}
          </div>
        ) : null}

        <form
          className="form"
          style={{ gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 150px), 1fr))", gap: "clamp(10px, 2vw, 12px)" }}
          onSubmit={onBook}
        >
          <select
            className="input"
            value={doctorId}
            onChange={(e) => setDoctorId(e.target.value)}
            required
            style={{ padding: "clamp(10px, 2vw, 12px)", fontSize: "clamp(13px, 1.5vw, 14px)" }}
          >
            {!doctorId && <option value="">Select a doctor…</option>}
            {doctors.map((d) => (
              <option key={d.id} value={String(d.id)}>
                {d.name} — {d.city || "—"}
              </option>
            ))}
          </select>

          <input
            className="input"
            type="date"
            min={dayjs().format("YYYY-MM-DD")}
            value={dateISO}
            onChange={(e) => setDateISO(e.target.value)}
            required
            style={{ padding: "clamp(10px, 2vw, 12px)", fontSize: "clamp(13px, 1.5vw, 14px)" }}
          />

          <input
            className="input"
            value={patientId}
            readOnly
            title="Your patient id"
            style={{ padding: "clamp(10px, 2vw, 12px)", fontSize: "clamp(13px, 1.5vw, 14px)" }}
          />
        </form>

        <Section
          title={
            doctor
              ? `${doctor.name} • ${doctor.city || "—"}${
                  doctor.fee != null ? " • $" + doctor.fee : ""
                }`
              : "Available slots"
          }
        >
          <div
            className="helper"
            style={{ marginBottom: 8, fontWeight: 700 }}
          >
            Morning
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
            {slots
              .filter((s) => s.period === "Morning")
              .map((s) => (
                <Chip
                  key={s.time}
                  label={s.time}
                  active={selected === s.time}
                  disabled={!s.available}
                  title={s.reason}
                  onClick={() => setSelected(s.time)}
                />
              ))}
            {slots.filter((s) => s.period === "Morning").length === 0 && (
              <span className="helper">No morning slots.</span>
            )}
          </div>

          <div
            className="helper"
            style={{ margin: "12px 0 8px", fontWeight: 700 }}
          >
            Afternoon
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
            {slots
              .filter((s) => s.period === "Afternoon")
              .map((s) => (
                <Chip
                  key={s.time}
                  label={s.time}
                  active={selected === s.time}
                  disabled={!s.available}
                  title={s.reason}
                  onClick={() => setSelected(s.time)}
                />
              ))}
            {slots.filter((s) => s.period === "Afternoon").length === 0 && (
              <span className="helper">No afternoon slots.</span>
            )}
          </div>

          <div
            className="helper"
            style={{ margin: "12px 0 8px", fontWeight: 700 }}
          >
            Evening
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
            {slots
              .filter((s) => s.period === "Evening")
              .map((s) => (
                <Chip
                  key={s.time}
                  label={s.time}
                  active={selected === s.time}
                  disabled={!s.available}
                  title={s.reason}
                  onClick={() => setSelected(s.time)}
                />
              ))}
            {slots.filter((s) => s.period === "Evening").length === 0 && (
              <span className="helper">No evening slots.</span>
            )}
          </div>
        </Section>

        <div style={{ marginTop: "clamp(14px, 2vw, 18px)", display: "flex", gap: "clamp(8px, 2vw, 12px)", flexWrap: "wrap" }}>
          <button
            className="btn"
            onClick={onBook}
            disabled={loading || !selected}
            style={{ flex: "1 1 120px", padding: "12px 16px", fontSize: "clamp(13px, 1.5vw, 14px)" }}
          >
            {loading
              ? rescheduleId
                ? "Rescheduling…"
                : "Booking…"
              : selected
              ? rescheduleId
                ? `Reschedule to ${selected}`
                : `Book ${selected}`
              : "Pick a time"}
          </button>
          <button
            className="btn"
            onClick={() => nav("/doctors")}
            style={{
              flex: "1 1 120px",
              padding: "12px 16px",
              fontSize: "clamp(13px, 1.5vw, 14px)",
              background: "#fff",
              color: "var(--blue-700)",
              border: "1px solid #c7d2fe",
            }}
          >
            Browse Doctors
          </button>
        </div>
      </div>
    </div>
  );
}
