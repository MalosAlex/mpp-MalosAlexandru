"use client";
import React, { useEffect, useState } from "react";

type LogEntry = {
  id: number;
  username: string;
  operation: string;
  timestamp: string;
};

export default function Page() {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);

  const fetchLogs = async () => {
    try {
      const res = await fetch(`http://localhost:8000/api/log?page=${page}`);
      const data = await res.json();

      // Ensure that data.results exists and is an array
      if (data.results && Array.isArray(data.results)) {
        setLogs(data.results);
      } else {
        setLogs([]); // Set to empty array if no results
      }
      setLoading(false);
    } catch (error) {
      console.error("Error fetching logs:", error);
      setLogs([]); // Set to empty array on error
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
    const interval = setInterval(() => {
      fetchLogs();
    }, 5000);
    return () => clearInterval(interval);
  }, [page]);

  if (loading) return <p>Loading...</p>;

  const handleNextPage = () => {
    // Only go to the next page if there are logs
    if (logs.length > 0) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  const handlePreviousPage = () => {
    setPage((prevPage) => Math.max(prevPage - 1, 1));
  };

  return (
    <div style={{ padding: "2rem", fontFamily: "Arial, sans-serif" }}>
      <h2>Log Entries (Page {page})</h2>
      <div style={{ marginBottom: "1rem" }}>
        <button
          onClick={handlePreviousPage}
          style={{
            marginRight: "0.5rem",
            padding: "0.5rem 1rem",
            backgroundColor: "#0070f3",
            color: "#fff",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Previous
        </button>
        <button
          onClick={handleNextPage}
          disabled={logs.length === 0} // Disable "Next" if logs are empty
          style={{
            padding: "0.5rem 1rem",
            backgroundColor: "#0070f3",
            color: "#fff",
            border: "none",
            borderRadius: "4px",
            cursor: logs.length === 0 ? "not-allowed" : "pointer", // Change cursor if button is disabled
            opacity: logs.length === 0 ? 0.5 : 1, // Make the button appear faded when disabled
          }}
        >
          Next
        </button>
      </div>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead style={{ backgroundColor: "#f4f4f4" }}>
          <tr>
            <th style={{ border: "1px solid #ddd", padding: "0.75rem", textAlign: "left" }}>Username</th>
            <th style={{ border: "1px solid #ddd", padding: "0.75rem", textAlign: "left" }}>Operation</th>
            <th style={{ border: "1px solid #ddd", padding: "0.75rem", textAlign: "left" }}>Timestamp</th>
          </tr>
        </thead>
        <tbody>
          {logs.length > 0 ? (
            logs.map((log, i) => (
              <tr key={log.id} style={{ backgroundColor: i % 2 === 0 ? "#f9f9f9" : "white" }}>
                <td style={{ border: "1px solid #ddd", padding: "0.75rem" }}>{log.username}</td>
                <td style={{ border: "1px solid #ddd", padding: "0.75rem" }}>{log.operation}</td>
                <td style={{ border: "1px solid #ddd", padding: "0.75rem" }}>
                  {new Date(log.timestamp).toLocaleString()}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={3} style={{ textAlign: "center", padding: "1rem" }}>
                No logs available.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
