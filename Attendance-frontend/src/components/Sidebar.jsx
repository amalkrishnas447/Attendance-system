import { Link, useNavigate } from "react-router-dom";

function Sidebar() {
  const navigate = useNavigate();

  function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("teacher");

    navigate("/login");
  }

  return (
    <div
      style={{
        width: "250px",
        minHeight: "100vh",
        background: "#1e293b",
        color: "white",
        padding: "30px",
      }}
    >
      <h2>Student ERP</h2>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "20px",
          marginTop: "40px",
        }}
      >
        <Link
          to="/"
          style={{ color: "white", textDecoration: "none" }}
        >
          📊 Dashboard
        </Link>

        <Link
          to="/timetable"
          style={{ color: "white", textDecoration: "none" }}
        >
          📅 Timetable
        </Link>

        <Link
          to="/results"
          style={{ color: "white", textDecoration: "none" }}
        >
          📝 Results
        </Link>

        <button
          onClick={handleLogout}
          style={{
            marginTop: "30px",
            padding: "12px",
            background: "#dc2626",
            color: "white",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            fontSize: "16px",
          }}
        >
          Logout
        </button>
      </div>
    </div>
  );
}

export default Sidebar;