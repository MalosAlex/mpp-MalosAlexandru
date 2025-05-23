"use client";

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, ResponsiveContainerProps } from "recharts";
import { Character, useCharacters } from "../types/character";
import React, { useState, useEffect } from "react";

export default function AgeChart() {
  const [characters, setCharacters] = useState<Character[]>([]);
 
  const { characters: contextCharacters} = useCharacters();
      
      const [serverOnline, setServerOnline] = useState<boolean | null>(null);
      const [userIsOnline, setUserIsOnline] = useState(navigator.onLine);
        
          // Combined value
        const isOnline = userIsOnline && serverOnline === true;
        
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
          const intervalId = setInterval(checkOnlineStatus, 1000);
          return () => clearInterval(intervalId);
        }, []);
    
        useEffect(() => {
            const fetchCharacters = async () => {
              const onlineStatus = userIsOnline && serverOnline;
              if(onlineStatus)
              {
              try {
                const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/characters/`;
                console.log(url); // For debugging the URL
        
                const response = await fetch(url);
                if (response.ok) {
                  const data = await response.json();
                  setCharacters(data);
                } else {
                  console.error("Error fetching characters:", response.statusText);
                }
              } catch (error) {
                console.error("Error fetching characters:", error);
              }
            }
            else{
              setCharacters(contextCharacters);
            }
            };
            fetchCharacters();
          }) ;

  console.log(characters);

  // Define media groups
  const mediaGroups: Record<"Video Game" | "Movie" | "Books" | "Series", number> = {
    "Video Game": 0,
    "Movie": 0,
    "Books": 0,
    "Series": 0,
  };

  characters.forEach(({ typeOfMedia }) => {
    if (typeOfMedia === "Video Game") mediaGroups["Video Game"]++;
    else if (typeOfMedia === "Movie") mediaGroups["Movie"]++;
    else if (typeOfMedia === "Books") mediaGroups["Books"]++;
    else if (typeOfMedia === "Series") mediaGroups["Series"]++;
  });

  console.log(mediaGroups);

  // Convert to array format for Recharts
  const data = (Object.keys(mediaGroups) as (keyof typeof mediaGroups)[]).map((key) => ({
    name: key,
    count: mediaGroups[key],
  }));

  console.log(data);

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#FF0000"];

  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Tooltip />
        <Pie data={data} dataKey="count" nameKey="name" cx="50%" cy="50%" outerRadius={100} fill="#8884d8">
          {data.map((_, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
      </PieChart>
    </ResponsiveContainer>
  );
}
