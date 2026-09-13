import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav
      style={{
        background: "#2563eb",
        padding: "15px 30px",
        display: "flex",
        gap: "25px",
      }}
    >
      <Link
        to="/"
        style={{ color: "white", textDecoration: "none" }}
      >
        Dashboard
      </Link>

      <Link
        to="/timetable"
        style={{ color: "white", textDecoration: "none" }}
      >
        Timetable
      </Link>

      <Link
        to="/results"
        style={{ color: "white", textDecoration: "none" }}
      >
        Results
      </Link>
    </nav>
  );
}

export default Navbar;