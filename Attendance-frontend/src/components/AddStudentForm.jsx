
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

  useEffect(() => {
    if (editingStudent) {
      setFormData({
        name: editingStudent.name,
        email: editingStudent.email,
        rollNumber: editingStudent.rollNumber,
        course: editingStudent.course,
        batch: editingStudent.batch,
        joinDate: editingStudent.joinDate
          ? editingStudent.joinDate.split("T")[0]
          : "",
        password: "",
      });
    }
  }, [editingStudent]);

  function handleChange(e) {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();

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
    } catch (error) {
      console.log(error);
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




