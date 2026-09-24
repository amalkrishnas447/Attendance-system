import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";

function StudentDashboard() {
  const [student, setStudent] = useState(null);
  const [attendancePercentage, setAttendancePercentage] = useState(0);
  const [todayStatus, setTodayStatus] = useState("Not Marked");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    async function fetchDashboard() {
      try {
        setLoading(true);
        setError("");

        const token = localStorage.getItem("studentToken");

        const response = await api.get("/student/dashboard", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setStudent(response.data.student);
        setAttendancePercentage(response.data.attendancePercentage);
        setTodayStatus(response.data.todayStatus);
      } catch (error) {
        console.log(error);

        setError(
          error.response?.data?.message ||
            "Failed to load student dashboard."
        );
      } finally {
        setLoading(false);
      }
    }

    fetchDashboard();
  }, []);

  function handleLogout() {
    localStorage.removeItem("studentToken");
    localStorage.removeItem("student");

    navigate("/student/login");
  }

  if (loading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#f1f5f9",
        }}
      >
        <h2>Loading dashboard...</h2>
      </div>
    );
  }

  if (error) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#f1f5f9",
        }}
      >
        <div
          style={{
            background: "white",
            padding: "30px",
            borderRadius: "12px",
            textAlign: "center",
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          }}
        >
          <h2>Unable to load dashboard</h2>

          <p style={{ color: "#b91c1c" }}>
            {error}
          </p>

          <button
            onClick={handleLogout}
            style={{
              marginTop: "15px",
              padding: "10px 20px",
              background: "#dc2626",
              color: "white",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
            }}
          >
            Back to Login
          </button>
        </div>
      </div>
    );
  }

  if (!student) {
    return (
      <div style={{ padding: "30px" }}>
        <h2>Student information not found.</h2>
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        background: "#f1f5f9",
      }}
    >
      {/* LEFT PROFILE */}
      <div
        style={{
          width: "260px",
          background: "#173d63",
          color: "white",
          padding: "30px 20px",
        }}
      >
        <h2>Student Profile</h2>

        <div style={{ marginTop: "30px" }}>
          <h3>{student.name}</h3>

          <p>{student.email}</p>

          <p>
            <strong>Roll Number:</strong>
            <br />
            {student.rollNumber}
          </p>

          <p>
            <strong>Course:</strong>
            <br />
            {student.course || "Not provided"}
          </p>

          <p>
            <strong>Batch:</strong>
            <br />
            {student.batch || "Not provided"}
          </p>
        </div>

        <button
          onClick={handleLogout}
          style={{
            marginTop: "40px",
            width: "100%",
            padding: "10px",
            background: "white",
            color: "#173d63",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
            fontWeight: "bold",
          }}
        >
          Logout
        </button>
      </div>

      {/* RIGHT CONTENT */}
      <div
        style={{
          flex: 1,
          padding: "40px",
        }}
      >
        <h1 style={{ color: "#0f172a" }}>
          Student Dashboard
        </h1>

        <h2
          style={{
            marginTop: "40px",
            color: "#334155",
          }}
        >
          Welcome, {student.name}!
        </h2>

        {/* ATTENDANCE CARD */}
        <div
          style={{
            marginTop: "30px",
            background: "white",
            padding: "30px",
            borderRadius: "12px",
            maxWidth: "500px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
          }}
        >
          <h2 style={{ color: "#0f172a" }}>
            Attendance
          </h2>

          <p
            style={{
              fontSize: "20px",
              color: "#334155",
            }}
          >
            Attendance Percentage:
            <strong> {attendancePercentage}%</strong>
          </p>

          <p
            style={{
              fontSize: "18px",
              color: "#334155",
            }}
          >
            Today's Status:
            <strong> {todayStatus}</strong>
          </p>
        </div>
      </div>
    </div>
  );
}

export default StudentDashboard;