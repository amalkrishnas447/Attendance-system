import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import Login from "./pages/Login";
import Sidebar from "./components/Sidebar";

import Home from "./pages/Home";
import Timetable from "./pages/Timetable";
import Results from "./pages/Results";

// Student pages
import StudentLogin from "./pages/StudentLogin";
import StudentDashboard from "./pages/StudentDashboard";

// =========================
// TEACHER PROTECTED ROUTE
// =========================

function ProtectedRoute({ children }) {
  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

// =========================
// STUDENT PROTECTED ROUTE
// =========================

function StudentProtectedRoute({ children }) {
  const token = localStorage.getItem("studentToken");

  if (!token) {
    return <Navigate to="/student/login" replace />;
  }

  return children;
}

// =========================
// TEACHER DASHBOARD
// =========================

function DashboardLayout() {
  return (
    <div style={{ display: "flex" }}>
      <Sidebar />

      <div style={{ flex: 1 }}>
        <Routes>
          <Route index element={<Home />} />
          <Route path="timetable" element={<Timetable />} />
          <Route path="results" element={<Results />} />
        </Routes>
      </div>
    </div>
  );
}

// =========================
// STUDENT DASHBOARD
// =========================

function StudentLayout() {
  return (
    <Routes>
      <Route path="dashboard" element={<StudentDashboard />} />
    </Routes>
  );
}

// =========================
// APP
// =========================

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route path="/student/login" element={<StudentLogin />} />

        <Route
          path="/student/*"
          element={
            <StudentProtectedRoute>
              <StudentLayout />
            </StudentProtectedRoute>
          }
        />

        <Route
          path="/*"
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;