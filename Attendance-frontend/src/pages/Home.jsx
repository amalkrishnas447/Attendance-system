import AddStudentForm from "../components/AddStudentForm";
import { useEffect, useState } from "react";
import api from "../api";
import StudentCard from "../components/StudentCard";
import StatsCard from "../components/StatsCard";

function Home() {
  const [students, setStudents] = useState([]);
  const [search, setSearch] = useState("");
  const [editingStudent, setEditingStudent] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [stats, setStats] = useState({
    totalStudents: 0,
    presentToday: 0,
    absentToday: 0,
  });

  function addStudent(student) {
    setStudents((prevStudents) => [...prevStudents, student]);
  }

  async function deleteStudent(id) {
    try {
      setError("");

      await api.delete(`/students/${id}`);

      setStudents((prevStudents) =>
        prevStudents.filter((student) => student.id !== id)
      );
    } catch (error) {
      console.log(error);
      setError(
        error.response?.data?.message ||
          "Failed to delete student."
      );
    }
  }

  function editStudent(student) {
    setEditingStudent(student);
  }

  async function updateStudent(updatedStudent) {
    try {
      setError("");

      const response = await api.put(
        `/students/${updatedStudent.id}`,
        updatedStudent
      );

      setStudents((prevStudents) =>
        prevStudents.map((student) =>
          student.id === updatedStudent.id
            ? response.data
            : student
        )
      );

      setEditingStudent(null);
    } catch (error) {
      console.log(error);
      setError(
        error.response?.data?.message ||
          "Failed to update student."
      );
    }
  }

  async function markAttendance(studentId, status) {
    try {
      setError("");

      await api.post("/attendance", {
        studentId,
        status,
      });

      const studentsResponse = await api.get("/students");
      setStudents(studentsResponse.data);

      const statsResponse = await api.get("/dashboard");
      setStats(statsResponse.data);
    } catch (error) {
      console.log(error);
      setError(
        error.response?.data?.message ||
          "Failed to mark attendance."
      );
    }
  }

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        setError("");

        const studentsResponse = await api.get("/students");
        const statsResponse = await api.get("/dashboard");

        setStudents(studentsResponse.data);
        setStats(statsResponse.data);
      } catch (error) {
        console.log(error);

        setError(
          error.response?.data?.message ||
            "Failed to load dashboard."
        );
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  const filteredStudents = students.filter((student) =>
    student.name
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <div
        style={{
          padding: "40px",
          background: "#f1f5f9",
          minHeight: "100vh",
        }}
      >
        <h1>Student Dashboard</h1>
        <p>Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div
      style={{
        padding: "40px",
        background: "#f1f5f9",
        minHeight: "100vh",
      }}
    >
      <h1>Student Dashboard</h1>

      {error && (
        <div
          style={{
            background: "#fee2e2",
            color: "#b91c1c",
            padding: "12px 16px",
            borderRadius: "8px",
            marginBottom: "20px",
          }}
        >
          {error}
        </div>
      )}

      <AddStudentForm
        onStudentAdded={addStudent}
        editingStudent={editingStudent}
        onStudentUpdated={updateStudent}
      />

      <input
        type="text"
        placeholder="Search students..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{
          width: "300px",
          padding: "12px",
          marginBottom: "30px",
          borderRadius: "10px",
          border: "1px solid #cbd5e1",
        }}
      />

      <div
        style={{
          display: "flex",
          gap: "20px",
          marginBottom: "40px",
          flexWrap: "wrap",
        }}
      >
        <StatsCard
          title="Total Students"
          value={stats.totalStudents}
        />

        <StatsCard
          title="Present Today"
          value={stats.presentToday}
        />

        <StatsCard
          title="Absent Today"
          value={stats.absentToday}
        />
      </div>

      {filteredStudents.length === 0 ? (
        <p>
          {search
            ? "No students found."
            : "No students added yet."}
        </p>
      ) : (
        filteredStudents.map((student) => (
          <StudentCard
            key={student.id}
            student={student}
            onDelete={deleteStudent}
            onEdit={editStudent}
            onMarkAttendance={markAttendance}
          />
        ))
      )}
    </div>
  );
}

export default Home;