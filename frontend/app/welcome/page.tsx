"use client";
import { useEffect, useState } from "react";

export default function Home() {
  

  // getting the message from the backend
  /*useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/hello/`)  // Call Django API
      .then((res) => res.json())
      .then((data) => setMessage(data.message))
      .catch((err) => setMessage("Failed to fetch data"));
  }, []);*/

  return (
    <div>
      <div className="Intro">
        <p>{'Hello! Welcome to my page about fictional characters, ranging from movies, books, shows and video games.'}</p>
        <p>{'Characters are all of all types: protagonists, antagonists, deuteragonists, confidants, and love interests.'}</p>
        <p>{'To see all characters and edit/remove them go to the see all characters page!'}</p>
        <p>{'Have fun!'}</p>
      </div>

    </div>
  );
}
