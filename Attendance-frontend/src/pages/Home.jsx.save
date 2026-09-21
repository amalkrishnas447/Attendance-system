
import AddStudentForm from "../components/AddStudentForm";
import { useEffect, useState } from "react";
import api from "../api";
import StudentCard from "../components/StudentCard";
import StatsCard from "../components/StatsCard";

function Home() {
  const [students, setStudents] = useState([]);
  const [search, setSearch] = useState("");
  
  const [editingStudent, setEditingStudent] = useState(null);   

  const [stats, setStats] = useState({
    totalStudents: 0,
    presentToday: 0,
    absentToday: 0,
  });

  function addStudent(student) {
    setStudents([...students, student]);
  }

  async function deleteStudent(id) {
    try {
      await api.delete(`/students/${id}`);

      setStudents(
        students.filter(
          (student) => student.id !== id
        )
      );
    } catch (error) {
      console.log(error);
    }
  }

function editStudent(student) {
  setEditingStudent(student);
}

async function updateStudent(updatedStudent) {
  try {
    const response = await api.put(
      `/students/${updatedStudent.id}`,
      updatedStudent
    );

    setStudents(
      students.map((student) =>
        student.id === updatedStudent.id
          ? response.data
          : student
      )
    );

    setEditingStudent(null);
  } catch (error) {
    console.log(error);
  }
}
   



async function markAttendance(studentId, status) {     
  try {
    await api.post("/attendance", {
      studentId,
      status,
    });

    const studentsResponse = await api.get(
      "/students/dashboard"
    );

    setStudents(studentsResponse.data);

    const statsResponse = await api.get("/dashboard");

    setStats(statsResponse.data);

  } catch (error) {
    console.log(error);
  }
}



  useEffect(() => {
    async function fetchStudents() {
      try {
        const response = await api.get("/students/dashboard");
        setStudents(response.data);
      } catch (error) {
        console.log(error);
      }
    }

    async function fetchStats() {
      try {
        const response = await api.get("/dashboard");
        setStats(response.data);
      } catch (error) {
        console.log(error);
      }
    }

    fetchStudents();
    fetchStats();
  }, []);

  return (
    <div
      style={{
        padding: "40px",
        background: "#f1f5f9",
        minHeight: "100vh",
      }}
    >
      <h1>Student Dashboard</h1>

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
          border: "1px solid gray",
        }}
      />

      <div
        style={{
          display: "flex",
          gap: "20px",
          marginBottom: "40px",
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

      {students
        .filter((student) =>
          student.name
            .toLowerCase()
            .includes(search.toLowerCase())
        )
        .map((student) => (
         <StudentCard
  key={student.id}
  student={student}
  onDelete={deleteStudent}
  onEdit={editStudent}
  onMarkAttendance={markAttendance}
/>
        ))}
    </div>
  );
}

export default Home;

