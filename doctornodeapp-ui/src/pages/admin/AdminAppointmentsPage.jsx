// src/pages/admin/AdminAppointmentsPage.jsx
import { useEffect, useState } from "react";
import { fetchAdminAppointments } from "../../services/adminAppointments";
import AdminNav from "../../components/admin/AdminNav";

const emptyFilters = {
  doctorId: "",
  patientId: "",
  date: "",
};

export default function AdminAppointmentsPage() {
  const [filters, setFilters] = useState(emptyFilters);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    loadAppointments();
  }, []);

  async function loadAppointments(currentFilters = filters) {
    try {
      setLoading(true);
      setError("");
      const list = await fetchAdminAppointments(currentFilters);
      setAppointments(list);
    } catch (err) {
      console.error("loadAppointments error", err);
      setError("Failed to load appointments");
    } finally {
      setLoading(false);
    }
  }

  function handleChange(e) {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  }

  function handleClearFilters() {
    const cleared = { ...emptyFilters };
    setFilters(cleared);
    loadAppointments(cleared);
  }

  function handleSubmit(e) {
    e.preventDefault();
    loadAppointments(filters);
  }

  return (
    <div style={{ maxWidth: "1000px", margin: "0 auto", padding: "1.5rem" }}>
         <AdminNav />   {/* 👈 added */}
      <h1>Admin – Appointments</h1>

      {error && (
        <p style={{ color: "red", marginTop: "0.5rem" }}>
          {error}
        </p>
      )}

      {/* Filters */}
      <h2 style={{ marginTop: "1.5rem" }}>Filter Appointments</h2>
      <form
        onSubmit={handleSubmit}
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
          gap: "0.75rem",
          maxWidth: "700px",
          marginBottom: "1rem",
        }}
      >
        <div>
          <label>
            Doctor ID <br />
            <input
              type="number"
              name="doctorId"
              value={filters.doctorId}
              onChange={handleChange}
              style={{ width: "100%", padding: "6px" }}
            />
          </label>
        </div>
        <div>
          <label>
            Patient ID <br />
            <input
              type="number"
              name="patientId"
              value={filters.patientId}
              onChange={handleChange}
              style={{ width: "100%", padding: "6px" }}
            />
          </label>
        </div>
        <div>
          <label>
            Date (YYYY-MM-DD) <br />
            <input
              type="text"
              name="date"
              value={filters.date}
              onChange={handleChange}
              placeholder="2025-12-01"
              style={{ width: "100%", padding: "6px" }}
            />
          </label>
        </div>

        <div style={{ alignSelf: "end", display: "flex", gap: "0.5rem" }}>
          <button
            type="submit"
            style={{ padding: "8px 12px", cursor: "pointer" }}
          >
            Apply Filters
          </button>
          <button
            type="button"
            onClick={handleClearFilters}
            style={{ padding: "8px 12px", cursor: "pointer" }}
          >
            Clear
          </button>
        </div>
      </form>

      {/* Appointments table */}
      <h2>Appointments List</h2>
      {loading ? (
        <p>Loading appointments...</p>
      ) : appointments.length === 0 ? (
        <p>No appointments found.</p>
      ) : (
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            marginTop: "0.5rem",
          }}
        >
          <thead>
            <tr>
              <th style={{ borderBottom: "1px solid #ccc", textAlign: "left" }}>ID</th>
              <th style={{ borderBottom: "1px solid #ccc", textAlign: "left" }}>Date</th>
              <th style={{ borderBottom: "1px solid #ccc", textAlign: "left" }}>Time</th>
              <th style={{ borderBottom: "1px solid #ccc", textAlign: "left" }}>Status</th>
              <th style={{ borderBottom: "1px solid #ccc", textAlign: "left" }}>Doctor</th>
              <th style={{ borderBottom: "1px solid #ccc", textAlign: "left" }}>Patient</th>
              <th style={{ borderBottom: "1px solid #ccc", textAlign: "left" }}>Patient Email</th>
            </tr>
          </thead>
          <tbody>
            {appointments.map((a) => (
              <tr key={a.id}>
                <td style={{ padding: "4px 8px" }}>{a.id}</td>
                <td style={{ padding: "4px 8px" }}>{a.date}</td>
                <td style={{ padding: "4px 8px" }}>{a.time}</td>
                <td style={{ padding: "4px 8px" }}>{a.status}</td>
                <td style={{ padding: "4px 8px" }}>{a.doctorName}</td>
                <td style={{ padding: "4px 8px" }}>{a.patientName}</td>
                <td style={{ padding: "4px 8px" }}>{a.patientEmail}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
