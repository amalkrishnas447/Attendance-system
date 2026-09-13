import { useEffect, useState } from "react";
import api from "../api";

function Results() {
  const [results, setResults] = useState([]);

  useEffect(() => {
    async function fetchResults() {
      try {
        const response = await api.get("/results");
        setResults(response.data);
      } catch (error) {
        console.log(error);
      }
    }

    fetchResults();
  }, []);

  return (
    <div style={{ padding: "40px" }}>
      <h1>Results</h1>

      {results.map((result) => (
        <div
          key={result.id}
          style={{
            border: "1px solid gray",
            borderRadius: "12px",
            padding: "20px",
            marginTop: "20px",
          }}
        >
          <h2>{result.student.name}</h2>

          <p>
            <strong>Subject:</strong> {result.subject}
          </p>

          <p>
            <strong>Marks:</strong> {result.marks}
          </p>
        </div>
      ))}
    </div>
  );
}

export default Results;