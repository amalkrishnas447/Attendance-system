import { useEffect, useState } from "react";
import api from "../api";

function Timetable() {
  const [timetable, setTimetable] = useState([]);

  useEffect(() => {
    async function fetchTimetable() {
      try {
        const response = await api.get("/timetable");
        setTimetable(response.data);
      } catch (error) {
        console.log(error);
      }
    }

    fetchTimetable();
  }, []);

  return (
    <div style={{ padding: "40px" }}>
      <h1>Today's Timetable</h1>

      {timetable.map((item) => (
        <div
          key={item.id}
          style={{
            border: "1px solid gray",
            borderRadius: "12px",
            padding: "20px",
            marginTop: "20px",
          }}
        >
          <h2>{item.subject}</h2>

          <p>
            <strong>Day:</strong> {item.day}
          </p>

          <p>
            <strong>Time:</strong>{" "}
            {item.startTime} - {item.endTime}
          </p>
        </div>
      ))}
    </div>
  );
}

export default Timetable;