function StudentCard({
  student,
  onDelete,
  onEdit,
  onMarkAttendance,
}) {
  const attendanceMarked =
    student.todayStatus === "Present" ||
    student.todayStatus === "Absent";

  return (
    <div
      style={{
        width: "350px",
        padding: "25px",
        borderRadius: "15px",
        background: "white",
        boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
        marginTop: "20px",
      }}
    >
      <img
        src="https://picsum.photos/150"
        alt="Student"
        style={{
          width: "120px",
          height: "120px",
          borderRadius: "50%",
        }}
      />

      <h2>{student.name}</h2>

      <p>
        <strong>Roll No:</strong> {student.rollNumber}
      </p>

      <p>
        <strong>Email:</strong> {student.email}
      </p>

      <p>
        <strong>Course:</strong> {student.course}
      </p>

      <p>
        <strong>Batch:</strong> {student.batch}
      </p>

      <p>
        <strong>Joined:</strong>{" "}
        {student.joinDate
          ? new Date(student.joinDate).toLocaleDateString()
          : "Not available"}
      </p>

      <p>
        <strong>Attendance:</strong>{" "}
        {student.attendancePercentage}%
      </p>

      <p>
        <strong>Today:</strong>{" "}
        {student.todayStatus
          ? student.todayStatus
          : "Not marked"}
      </p>

      {/* Edit Button */}
      <button
        onClick={() => onEdit(student)}
        style={{
          background: "#2563eb",
          color: "white",
          border: "none",
          padding: "10px 15px",
          borderRadius: "8px",
          cursor: "pointer",
          marginRight: "10px",
          marginTop: "10px",
        }}
      >
        Edit Student
      </button>

      {/* Delete Button */}
      <button
        onClick={() => onDelete(student.id)}
        style={{
          background: "#ef4444",
          color: "white",
          border: "none",
          padding: "10px 15px",
          borderRadius: "8px",
          cursor: "pointer",
          marginTop: "10px",
        }}
      >
        Delete Student
      </button>

      {/* Attendance Buttons */}
      <div style={{ marginTop: "15px" }}>

        {/* Present */}
        <button
          onClick={() =>
            onMarkAttendance(student.id, "Present")
          }
          disabled={attendanceMarked}
          style={{
            background:
              student.todayStatus === "Present"
                ? "#86efac"
                : "#16a34a",
            color: "white",
            border: "none",
            padding: "10px 15px",
            borderRadius: "8px",
            cursor: attendanceMarked
              ? "not-allowed"
              : "pointer",
            marginRight: "10px",
          }}
        >
          {student.todayStatus === "Present"
            ? "Already Present"
            : "Present"}
        </button>

        {/* Absent */}
        <button
          onClick={() =>
            onMarkAttendance(student.id, "Absent")
          }
          disabled={attendanceMarked}
          style={{
            background:
              student.todayStatus === "Absent"
                ? "#fdba74"
                : "#f97316",
            color: "white",
            border: "none",
            padding: "10px 15px",
            borderRadius: "8px",
            cursor: attendanceMarked
              ? "not-allowed"
              : "pointer",
          }}
        >
          {student.todayStatus === "Absent"
            ? "Already Absent"
            : "Absent"}
        </button>

      </div>
    </div>
  );
}

export default StudentCard;