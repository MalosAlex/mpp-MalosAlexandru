"use client"

import AgeChart from "./AgeChart";
import MediaChart from "./mediaChart"; 
import CharacterTypeChart from "./characterTypeChart"
import {createCharacters} from "./CreateCharacters"
import { useCharacters } from "../types/character";


export default function Home() {
  const {addCharacter} = useCharacters();

  return (
    <div>
        <p>Age distribution of characters</p>
        <br></br>
      <AgeChart />
        <p>Media distribution of characters</p>
        <br></br>
      <MediaChart />
        <p>Type distributuon of characters</p>
        <br></br>
        <CharacterTypeChart />
        <br></br>
        <button onClick={() => createCharacters(addCharacter) }style={{
          backgroundColor: "#4CAF50",
          color: "white",
          padding: "10px 20px",
          fontSize: "16px",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
          transition: "background-color 0.3s",
        }}>Add mock characters</button>
    </div>
  );
}
