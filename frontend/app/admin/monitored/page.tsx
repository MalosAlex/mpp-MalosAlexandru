"use client";
import React, { useEffect, useState } from "react";

type MonitoredUserEntry = {
  username: string;
  timestamp: string;
};

export default function MonitoredPage() {
  const [users, setUsers] = useState<MonitoredUserEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);

  const fetchUsers = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/monitored?page=${page}`);
      const data = await res.json();
      console.log(data)

      // Directly extract only the needed properties: username and timestamp
      if (data.results && Array.isArray(data.results)) {
        const simplifiedData = data.results.map((user: any) => ({
          username: user.username,
          timestamp: user.timestamp,
        }));
        setUsers(simplifiedData);
      } else {
        setUsers([]);
      }
      setLoading(false);
    } catch (error) {
      console.error("Error fetching monitored users:", error);
      setUsers([]);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
    const interval = setInterval(() => {
      fetchUsers();
    }, 5000);
    return () => clearInterval(interval);
  }, [page]);

  const handleNextPage = () => {
    if (users.length > 0) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  const handlePreviousPage = () => {
    setPage((prevPage) => Math.max(prevPage - 1, 1));
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div style={{ padding: "2rem", fontFamily: "Arial, sans-serif" }}>
      <h2 style={{ color: "#b34700" }}>Monitored Users (Page {page})</h2>
      <div style={{ marginBottom: "1rem" }}>
        <button
          onClick={handlePreviousPage}
          style={{
            marginRight: "0.5rem",
            padding: "0.5rem 1rem",
            backgroundColor: "#ff9933",
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
          disabled={users.length === 0}
          style={{
            padding: "0.5rem 1rem",
            backgroundColor: "#ff9933",
            color: "#fff",
            border: "none",
            borderRadius: "4px",
            cursor: users.length === 0 ? "not-allowed" : "pointer",
            opacity: users.length === 0 ? 0.5 : 1,
          }}
        >
          Next
        </button>
      </div>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead style={{ backgroundColor: "#ffe0cc" }}>
          <tr>
            <th style={{ border: "1px solid #e67e22", padding: "0.75rem", textAlign: "left" }}>Username</th>
            <th style={{ border: "1px solid #e67e22", padding: "0.75rem", textAlign: "left" }}>Timestamp</th>
          </tr>
        </thead>
        <tbody>
          {users.length > 0 ? (
            users.map((user, i) => (
              <tr key={i} style={{ backgroundColor: i % 2 === 0 ? "#fff5e6" : "#ffffff" }}>
                <td style={{ border: "1px solid #f39c12", padding: "0.75rem" }}>{user.username}</td>
                <td style={{ border: "1px solid #f39c12", padding: "0.75rem" }}>
                  {new Date(user.timestamp).toLocaleString()}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={2} style={{ textAlign: "center", padding: "1rem", color: "#b34700" }}>
                No monitored users.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
