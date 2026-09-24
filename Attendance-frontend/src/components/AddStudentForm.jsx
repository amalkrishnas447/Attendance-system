
import api from "../api";
import { useEffect, useState } from "react";

function AddStudentForm({
  onStudentAdded,
  editingStudent,
  onStudentUpdated,
}) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    rollNumber: "",
    course: "",
    batch: "",
    joinDate: "",
    password: "",
  });

  const [error, setError] = useState("");

  useEffect(() => {
    if (editingStudent) {
      setFormData({
        name: editingStudent.name || "",
        email: editingStudent.email || "",
        rollNumber: editingStudent.rollNumber || "",
        course: editingStudent.course || "",
        batch: editingStudent.batch || "",
        joinDate: editingStudent.joinDate
          ? editingStudent.joinDate.split("T")[0]
          : "",
        password: "",
      });

      setError("");
    }
  }, [editingStudent]);

  function handleChange(e) {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

    setError("");
  }

  function validateForm() {
    if (!formData.name.trim()) {
      return "Name is required";
    }

    if (!formData.email.trim()) {
      return "Email is required";
    }

    if (!formData.email.includes("@")) {
      return "Please enter a valid email";
    }

    if (!formData.rollNumber.trim()) {
      return "Roll number is required";
    }

    if (!formData.course.trim()) {
      return "Course is required";
    }

    if (!formData.batch.trim()) {
      return "Batch is required";
    }

    if (!formData.joinDate) {
      return "Join date is required";
    }

    // Password is required only when adding
    if (!editingStudent && !formData.password) {
      return "Password is required";
    }

    if (!editingStudent && formData.password.length < 6) {
      return "Password must be at least 6 characters";
    }

    return "";
  }

  async function handleSubmit(e) {
    e.preventDefault();

    const validationError = validateForm();

    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      let response;

      if (editingStudent) {
        response = await api.put(
          `/students/${editingStudent.id}`,
          formData
        );

        onStudentUpdated(response.data);
      } else {
        response = await api.post(
          "/students",
          formData
        );

        onStudentAdded(response.data);
      }

      setFormData({
        name: "",
        email: "",
        rollNumber: "",
        course: "",
        batch: "",
        joinDate: "",
        password: "",
      });

      setError("");
    } catch (error) {
      console.log(error);

      setError(
        error.response?.data?.message ||
          "Something went wrong. Please try again."
      );
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        background: "white",
        padding: "25px",
        borderRadius: "15px",
        marginBottom: "40px",
        boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
      }}
    >
      <h2>
        {editingStudent
          ? "Edit Student"
          : "Add Student"}
      </h2>

      {error && (
        <p
          style={{
            color: "red",
            fontWeight: "bold",
          }}
        >
          {error}
        </p>
      )}

      <input
        name="name"
        placeholder="Name"
        value={formData.name}
        onChange={handleChange}
      />

      <br />
      <br />

      <input
        name="email"
        type="email"
        placeholder="Email"
        value={formData.email}
        onChange={handleChange}
      />

      <br />
      <br />

      <input
        name="rollNumber"
        placeholder="Roll Number"
        value={formData.rollNumber}
        onChange={handleChange}
      />

      <br />
      <br />

      <input
        name="course"
        placeholder="Course"
        value={formData.course}
        onChange={handleChange}
      />

      <br />
      <br />

      <input
        name="batch"
        placeholder="Batch"
        value={formData.batch}
        onChange={handleChange}
      />

      <br />
      <br />

      <input
        type="date"
        name="joinDate"
        value={formData.joinDate}
        onChange={handleChange}
      />

      {!editingStudent && (
        <>
          <br />
          <br />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
          />
        </>
      )}

      <br />
      <br />

      <button type="submit">
        {editingStudent
          ? "Update Student"
          : "Add Student"}
      </button>
    </form>
  );
}

export default AddStudentForm;

