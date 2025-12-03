// src/components/admin/AdminNav.jsx
import { Link, useLocation } from "react-router-dom";

export default function AdminNav() {
  const location = useLocation();

  const items = [
    { path: "/admin/users", label: "Users" },
    { path: "/admin/doctors", label: "Doctors" },
    { path: "/admin/appointments", label: "Appointments" },
  ];

  return (
    <div
      style={{
        display: "flex",
        gap: "0.75rem",
        marginBottom: "1rem",
        padding: "0.75rem 1rem",
        borderRadius: "8px",
        background: "#f3f4f6",
      }}
    >
      <span style={{ fontWeight: 600, marginRight: "0.5rem" }}>Admin:</span>
      {items.map((item) => {
        const active = location.pathname === item.path;
        return (
          <Link
            key={item.path}
            to={item.path}
            style={{
              padding: "6px 10px",
              borderRadius: "6px",
              textDecoration: "none",
              fontSize: "0.9rem",
              border: active ? "1px solid #2563eb" : "1px solid #d1d5db",
              background: active ? "#2563eb" : "#ffffff",
              color: active ? "#ffffff" : "#111827",
            }}
          >
            {item.label}
          </Link>
        );
      })}
    </div>
  );
}
