"use client"

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
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
            const res = await fetch("http://localhost:8000/api/characters/");
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
              }
              else{
                setCharacters(contextCharacters);
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