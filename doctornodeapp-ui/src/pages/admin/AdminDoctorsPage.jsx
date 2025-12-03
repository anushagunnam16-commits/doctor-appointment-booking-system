// src/pages/admin/AdminDoctorsPage.jsx
import { useEffect, useState } from "react";
import {
  fetchAdminDoctors,
  createAdminDoctor,
} from "../../services/adminDoctors";
import AdminNav from "../../components/admin/AdminNav";

const emptyForm = {
  name: "",
  email: "",
  phone: "",
  specialtyId: "",
  city: "",
  fee: "",
};

export default function AdminDoctorsPage() {
  const [doctors, setDoctors] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    loadDoctors();
  }, []);

  async function loadDoctors() {
    try {
      setLoading(true);
      setError("");
      const list = await fetchAdminDoctors();
      setDoctors(list);
    } catch (err) {
      console.error("loadDoctors error", err);
      setError("Failed to load doctors");
    } finally {
      setLoading(false);
    }
  }

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSuccess("");
    setSaving(true);

    try {
      const payload = {
        name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim() || null,
        specialtyId: form.specialtyId ? Number(form.specialtyId) : null,
        city: form.city.trim() || null,
        fee: form.fee ? Number(form.fee) : null,
      };

      if (!payload.name || !payload.email) {
        setError("Name and Email are required.");
        setSaving(false);
        return;
      }

      await createAdminDoctor(payload);
      setSuccess("Doctor created successfully.");
      setForm(emptyForm);
      await loadDoctors();
    } catch (err) {
      console.error("create doctor error", err);
      const msg =
        err?.response?.data?.error || "Failed to create doctor (maybe duplicate email).";
      setError(msg);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div style={{ maxWidth: "900px", margin: "0 auto", padding: "1.5rem" }}>
         <AdminNav />   {/* 👈 added */}
      <h1>Admin – Doctors</h1>

      {loading && <p>Loading doctors...</p>}
      {error && (
        <p style={{ color: "red", marginTop: "0.5rem" }}>
          {error}
        </p>
      )}
      {success && (
        <p style={{ color: "green", marginTop: "0.5rem" }}>
          {success}
        </p>
      )}

      {/* Doctors table */}
      <h2 style={{ marginTop: "1.5rem" }}>Existing Doctors</h2>
      {doctors.length === 0 ? (
        <p>No doctors found.</p>
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
              <th style={{ borderBottom: "1px solid #ccc", textAlign: "left" }}>Name</th>
              <th style={{ borderBottom: "1px solid #ccc", textAlign: "left" }}>Email</th>
              <th style={{ borderBottom: "1px solid #ccc", textAlign: "left" }}>City</th>
              <th style={{ borderBottom: "1px solid #ccc", textAlign: "left" }}>Fee</th>
              <th style={{ borderBottom: "1px solid #ccc", textAlign: "left" }}>Specialty</th>
            </tr>
          </thead>
          <tbody>
            {doctors.map((d) => (
              <tr key={d.id}>
                <td style={{ padding: "4px 8px" }}>{d.id}</td>
                <td style={{ padding: "4px 8px" }}>{d.name}</td>
                <td style={{ padding: "4px 8px" }}>{d.email}</td>
                <td style={{ padding: "4px 8px" }}>{d.city}</td>
                <td style={{ padding: "4px 8px" }}>{d.fee}</td>
                <td style={{ padding: "4px 8px" }}>{d.specialty}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Create doctor form */}
      <h2 style={{ marginTop: "2rem" }}>Add New Doctor</h2>
      <form onSubmit={handleSubmit} style={{ display: "grid", gap: "0.6rem", maxWidth: "500px" }}>
        <div>
          <label>
            Name* <br />
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              style={{ width: "100%", padding: "6px" }}
            />
          </label>
        </div>
        <div>
          <label>
            Email* <br />
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              style={{ width: "100%", padding: "6px" }}
            />
          </label>
        </div>
        <div>
          <label>
            Phone <br />
            <input
              type="text"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              style={{ width: "100%", padding: "6px" }}
            />
          </label>
        </div>
        <div>
          <label>
            Specialty ID <br />
            <input
              type="number"
              name="specialtyId"
              value={form.specialtyId}
              onChange={handleChange}
              style={{ width: "100%", padding: "6px" }}
            />
          </label>
        </div>
        <div>
          <label>
            City <br />
            <input
              type="text"
              name="city"
              value={form.city}
              onChange={handleChange}
              style={{ width: "100%", padding: "6px" }}
            />
          </label>
        </div>
        <div>
          <label>
            Fee <br />
            <input
              type="number"
              name="fee"
              value={form.fee}
              onChange={handleChange}
              style={{ width: "100%", padding: "6px" }}
            />
          </label>
        </div>

        <button
          type="submit"
          disabled={saving}
          style={{
            marginTop: "0.5rem",
            padding: "8px 12px",
            cursor: saving ? "not-allowed" : "pointer",
          }}
        >
          {saving ? "Saving..." : "Create Doctor"}
        </button>
      </form>
    </div>
  );
}
