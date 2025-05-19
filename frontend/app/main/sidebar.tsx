"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useUser } from "../types/user"; // Import the custom hook to access user context

export default function Sidebar() {
  const { getIsLogged, getAdmin } = useUser(); // Get functions from context
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    setIsLoggedIn(!!token);

    const adminStatus = getAdmin(); // Check if the user is an admin
    setIsAdmin(adminStatus);
  }, [getAdmin]); // Dependency on getAdmin to trigger re-evaluation

  return (
    <aside className="w-64 h-screen bg-gray-200 p-4">
      <ul className="Sidebar">
        <li>
          <Link
            href="/select"
            className={`block p-2 hover:bg-gray-300 ${!isLoggedIn && "pointer-events-none opacity-50"}`}
          >
            See All Characters
          </Link>
        </li>
        <li>
          <Link
            href="/add"
            className={`block p-2 hover:bg-gray-300 ${!isLoggedIn && "pointer-events-none opacity-50"}`}
          >
            Add Character
          </Link>
        </li>
        <li>
          <Link
            href="/charts"
            className={`block p-2 hover:bg-gray-300 ${!isLoggedIn && "pointer-events-none opacity-50"}`}
          >
            Charts
          </Link>
        </li>
        <li>
          <Link
            href="/bigFiles"
            className={`block p-2 hover:bg-gray-300 ${!isLoggedIn && "pointer-events-none opacity-50"}`}
          >
            BigFiles
          </Link>
        </li>

        {/* Conditional rendering for admin buttons */}
        {isLoggedIn && isAdmin && (
          <>
            <li>
              <Link
                href="/admin/logtable"
                className="block p-2 hover:bg-gray-300"
              >
                Log Table
              </Link>
            </li>
            <li>
              <Link
                href="/admin/monitored"
                className="block p-2 hover:bg-gray-300"
              >
                Monitored Users
              </Link>
            </li>
          </>
        )}
      </ul>
    </aside>
  );
}
