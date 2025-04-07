"use client";

import React, { useState, useEffect, useRef } from "react";
import { Character } from "../types/character";
import CharacterDialogue from "./deleteDialogue/page";
import UpdateDialogue from "./UpdateDialogue/page";
import filterAndSortCharacters from "./utils/filterSort";
import { debug } from "console";

export default function Home() {
  const [characters, setCharacters] = useState<Character[]>([]);
  const [dialogueOpen, setDialogueOpen] = useState(false);
  const [updateDialogueOpen, setUpdateDialogueOpen] = useState(false);
  const [selectedCharacter, setSelectedCharacter] = useState<any | null>(null);
  const [selectedCharacterName, setSelectedCharacterName] = useState<string | null>(null);
  const [filter, setFilter] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const charactersPerPage = 4; // Number of characters per page

  // Fetch characters from the backend when component mounts or filter/sort changes
  useEffect(() => {
    const fetchCharacters = async () => {
      try {
        const filterParam = filter ? `typeOfMedia=${filter}&` : '';
        const sortByParam = sortBy ? `ordering=${sortBy}` : 'ordering=name';
        const orderParam = sortOrder ? `&order=${sortOrder}` : '';
  
        const url = `http://localhost:8000/api/characters/?${filterParam}${sortByParam}${orderParam}`;
        console.log(url);
  
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
    setCurrentPage(1); // Reset page when filter/sort changes
  }, [filter, sortBy, sortOrder]);

  const scrollContainerRef = useRef<HTMLDivElement>(null);

useEffect(() => {
  const scrollContainer = scrollContainerRef.current;
  if (!scrollContainer) return;

  const handleScroll = () => {
    console.log("scrolling inside container");
    const nearBottom =
      scrollContainer.scrollTop + scrollContainer.clientHeight >=
      scrollContainer.scrollHeight - 300;
    if (nearBottom && currentPage * charactersPerPage < characters.length) {
      setCurrentPage((prevPage) => prevPage + 1);
    }
  };

  scrollContainer.addEventListener("scroll", handleScroll);
  return () => scrollContainer.removeEventListener("scroll", handleScroll);
}, [currentPage, characters]);
  
  
  const filteredCharacters = characters;

  // Get the characters for the current page
  console.log(currentPage)
  const currentCharacters = characters.slice(0, currentPage * charactersPerPage);


 // Handle update action
const handleUpdateCharacter = async (updatedCharacter: any) => {
  if (updatedCharacter) {
    try {
      // Send update request to backend
      await fetch(`http://localhost:8000/api/characters/${updatedCharacter.name}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedCharacter),
      });

      // Update the character in the local state
      setCharacters((prev) =>
        prev.map((char) =>
          char.name === updatedCharacter.name ? { ...char, ...updatedCharacter } : char
        )
      );

      // Close the update dialogue
      setUpdateDialogueOpen(false);
    } catch (error) {
      console.error("Error updating character:", error);
    }
  }
};

// Handle delete action
const handleDeleteCharacter = async () => {
  if (selectedCharacterName) {
    try {
      // Send delete request to backend
      await fetch(`http://localhost:8000/api/characters/${selectedCharacterName}/`, {
        method: 'DELETE',
      });

      // Remove the deleted character from the local state
      setCharacters((prev) => prev.filter((char) => char.name !== selectedCharacterName));

      // Close the delete dialogue
      setDialogueOpen(false);
    } catch (error) {
      console.error("Error deleting character:", error);
    }
  }
};

  return (
    <div ref={scrollContainerRef} className="scroll-container" style={{ overflowY: "auto", height: "100vh" }}>
      <div className="FilterSortContainer">
        <select onChange={(e) => setFilter(e.target.value)} defaultValue="">
          <option value="">All</option>
          <option value="Video Game">Video Game</option>
          <option value="Movie">Movie</option>
          <option value="Books">Books</option>
          <option value="Series">Series</option>
        </select>

        <select onChange={(e) => setSortBy(e.target.value)} defaultValue="">
          <option value="">None</option>
          <option value="Age">Age</option>
          <option value="Name">Name</option>
        </select>

        <button onClick={() => setSortOrder("asc")}>Ascending</button>
        <button onClick={() => setSortOrder("desc")}>Descending</button>
      </div>

      <ul>
        {currentCharacters.map((char, index) => (
          <li key={index} className="Character">
            <img src={char.image} alt={char.name} />
            <div className="CharacterDetails">
              <h2>{char.name}</h2>
              <p><strong>Media of Origin:</strong> {char.mediaOfOrigin}</p>
              <p><strong>Age:</strong> {char.age}</p>
              <p><strong>Type:</strong> {char.typeOfCharacter}</p>
              <p>{char.backstory}</p>
              <button 
                onClick={() => {
                  setSelectedCharacterName(char.name);
                  setSelectedCharacter(char);
                  setDialogueOpen(true);
                }} 
                className="DeleteButton"
              >
                Delete
              </button>
              <button 
                onClick={() => {          
                  setSelectedCharacterName(char.name);
                  setSelectedCharacter(char);
                  setUpdateDialogueOpen(true);
                }} 
                className="UpdateButton"
              >
                Update
              </button>
            </div>
          </li>
        ))}
      </ul>

      {/* Delete Dialogue */}
      {dialogueOpen && selectedCharacterName && (
        <CharacterDialogue
          characterName={selectedCharacterName} 
          onConfirm={handleDeleteCharacter}
          onClose={() => setDialogueOpen(false)}
        />
      )}

      {/* Update Dialogue */}
      {updateDialogueOpen && selectedCharacter && (
        <UpdateDialogue
          character={selectedCharacter} 
          onConfirm={handleUpdateCharacter}
          onClose={() => setUpdateDialogueOpen(false)}
          onError={(errors) => {
            // Handle the errors here
            console.log(errors); // Example, you can handle them however you want
          }}
        />
      )}

    </div>
  );
}
