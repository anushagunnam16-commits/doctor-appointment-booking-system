import { NavLink, Link, useNavigate } from "react-router-dom"; 
import { useAuth } from "../context/AuthContext";

export default function Header(){
  const { user, isAuthed, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/login");
  }
  return (
    <header className="header" style={{ position: "sticky", top: 0, zIndex: 100 }}>
      <div className="header-inner container" style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: "clamp(12px, 3vw, 24px)",
        padding: "clamp(12px, 2vw, 14px) clamp(16px, 3vw, 24px)",
        flexWrap: "wrap"
      }}>
        <Link to="/" className="brand" style={{
          display: "flex",
          alignItems: "center",
          gap: "clamp(8px, 1.5vw, 10px)",
          fontSize: "clamp(16px, 3vw, 18px)",
          whiteSpace: "nowrap"
        }}>
          <span className="brand-badge"></span>
          DoctorNode App
        </Link>
        <nav className="nav" style={{
          display: "flex",
          alignItems: "center",
          gap: "clamp(8px, 2vw, 14px)",
          flexWrap: "wrap",
          justifyContent: "flex-end"
        }}>
          {isAuthed ? (
            <>
              <span style={{
                marginRight: "clamp(6px, 1vw, 10px)",
                color: "#334155",
                fontSize: "clamp(12px, 1.5vw, 14px)",
                whiteSpace: "nowrap"
              }}>
                Hi, <b>{user?.name}</b>
              </span>
              <NavLink to="/doctors" style={{
                fontSize: "clamp(12px, 1.5vw, 14px)"
              }}>Doctors</NavLink>
              <NavLink to="/appointments" style={{
                fontSize: "clamp(12px, 1.5vw, 14px)"
              }}>My Appointments</NavLink>
              {/* Only for doctors */}
              {user?.role === "doctor" && (
                <NavLink to="/doctor-appointments" style={{
                  fontSize: "clamp(12px, 1.5vw, 14px)"
                }}>Doctor Dashboard</NavLink>
              )}
              <button className="btn" style={{
                marginLeft: "clamp(8px, 1vw, 14px)",
                padding: "clamp(8px, 1.2vw, 12px) clamp(12px, 2vw, 16px)",
                fontSize: "clamp(12px, 1.5vw, 14px)",
                whiteSpace: "nowrap"
              }} onClick={handleLogout}>
                Logout
              </button>
            </>
          ) : (
            <>
              <NavLink to="/login" style={{
                fontSize: "clamp(12px, 1.5vw, 14px)"
              }}>Login</NavLink>
              <NavLink to="/register" style={{
                fontSize: "clamp(12px, 1.5vw, 14px)"
              }}>Register</NavLink>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
