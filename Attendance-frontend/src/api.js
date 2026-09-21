
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000",
});

api.interceptors.request.use((config) => {
  const teacherToken = localStorage.getItem("token");
  const studentToken = localStorage.getItem("studentToken");

  const token = studentToken || teacherToken;

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default api;

