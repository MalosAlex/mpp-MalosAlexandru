"use client";

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Character } from "../types/character";
import React, { useState, useEffect } from "react";


export default function AgeChart() {
    const [characters, setCharacters] = useState<Character[]>([]);

    useEffect(() => {
        const fetchCharacters = async () => {
          try {
            const url = `http://localhost:8000/api/characters/`;
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
        };
        fetchCharacters();
      }) ;
    
    const ageGroups: Record<"<20" | "20-29" | "30-39" | "40-49" | "50+", number> = {
        "<20": 0,
        "20-29": 0,
        "30-39": 0,
        "40-49": 0,
        "50+": 0,
      };

      
      characters.forEach(({age}) => {
          if (age <= 19) ageGroups["<20"]++;
          else if (age <= 29) ageGroups["20-29"]++;
          else if (age <= 39) ageGroups["30-39"]++;
          else if (age <= 49) ageGroups["40-49"]++;
          else ageGroups["50+"]++; 
        })
        
    // Convert to array format for Recharts

    const data = (Object.keys(ageGroups) as (keyof typeof ageGroups)[]).map((key) => ({
        name: key,
        count: ageGroups[key],
      }));

    return (
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="count" stroke="#8884d8" />
          </LineChart>
        </ResponsiveContainer>
      );
}
