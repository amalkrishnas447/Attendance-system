
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";

function StudentDashboard() {
  const [student, setStudent] = useState(null);
  const [attendancePercentage, setAttendancePercentage] = useState(0);
  const [todayStatus, setTodayStatus] = useState("Not Marked");
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    async function fetchDashboard() {
      try {
        const token = localStorage.getItem("studentToken");

        const response = await api.get("/student/dashboard", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setStudent(response.data.student);
        setAttendancePercentage(
          response.data.attendancePercentage
        );
        setTodayStatus(response.data.todayStatus);
      } catch (error) {
        console.log(error);
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
    return <h2 style={{ padding: "30px" }}>Loading...</h2>;
  }

  if (!student) {
    return (
      <h2 style={{ padding: "30px" }}>
        Unable to load student dashboard.
      </h2>
    );
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        background: "#f4f6f8",
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
            {student.course}
          </p>

          <p>
            <strong>Batch:</strong>
            <br />
            {student.batch}
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
        <h1 style={{color:"black"}}>Student Dashboard</h1>

        <h2 style={{ marginTop: "40px",color:"black" }}>
          Welcome, {student.name}!
        </h2>

        {/* ATTENDANCE */}
        <div
          style={{
            marginTop: "30px",
            marginLeft:"80px",
            background: "black",
            padding: "30px",
            borderRadius: "12px",
            maxWidth: "500px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          }}
        >
          <h2>Attendance</h2>

          <p style={{ fontSize: "20px" }}>
            Attendance Percentage:
            <strong> {attendancePercentage}%</strong>
          </p>

          <p style={{ fontSize: "18px" }}>
            Today's Status:
            <strong> {todayStatus}</strong>
          </p>
        </div>
      </div>
    </div>
  );
}

export default StudentDashboard;
