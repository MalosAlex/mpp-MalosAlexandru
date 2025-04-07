"use client"

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
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

    
    
    const typeGroups: Record<"Protagonist" | "Antagonist" | "Deuteragonist" | "Confidant" | "Love Option", number> = {
        "Protagonist": 0,
        "Antagonist": 0,
        "Deuteragonist": 0,
        "Confidant": 0,
        "Love Option": 0,
      };

      
      characters.forEach(({typeOfCharacter}) => {
          if (typeOfCharacter == "Protagonist") typeGroups["Protagonist"]++;
          else if (typeOfCharacter == "Antagonist") typeGroups["Antagonist"]++;
          else if (typeOfCharacter == "Deuteragonist") typeGroups["Deuteragonist"]++;
          else if (typeOfCharacter == "Confidant") typeGroups["Confidant"]++;
          else typeGroups["Love Option"]++; 
        })
        
    
    // Convert to array format for Recharts

    const data = (Object.keys(typeGroups) as (keyof typeof typeGroups)[]).map((key) => ({
        name: key,
        count: typeGroups[key],
      }));

    

    return (
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar type="monotone" dataKey="count" fill="#8C9E66" />
          </BarChart>
        </ResponsiveContainer>
      );
}