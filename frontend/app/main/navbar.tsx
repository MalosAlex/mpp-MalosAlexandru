"use client"

import { useState, useEffect } from "react";

export default function Navbar() {
  const [serverOnline, setServerOnline] = useState<boolean | null>(null);
  const [userIsOnline, setUserIsOnline] = useState(navigator.onLine);

  // Combined value
  const [isOnline, setIsOnline] = useState<boolean>(userIsOnline && serverOnline === true);

  const checkOnlineStatus = async () => {
    setUserIsOnline(navigator.onLine);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/characters/`);
      setServerOnline(res.ok);
    } catch {
      setServerOnline(false);
    }
  };

  useEffect(() => {
    checkOnlineStatus();

    if (userIsOnline && serverOnline === true && !isOnline) {
      setIsOnline(true);
    }

    const intervalId = setInterval(checkOnlineStatus, 1000);
    return () => clearInterval(intervalId);
  }, [userIsOnline, serverOnline, isOnline]);

  return (
    <nav style={{ backgroundColor: "#0B7A98", height: 50, padding: "0 20px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
      <span style={{ color: "white" }}>
        Server: {serverOnline ? "Online" : serverOnline === false ? "Offline" : "Checking..."}
      </span>
      <span style={{ color: "white" }}>
        Client: {userIsOnline ? "Online" : "Offline"}
      </span>
    </nav>
  );
}
