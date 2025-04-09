"use client";

import React, { useState, useEffect, useRef } from "react";
import { Character, useCharacters } from "../types/character";
import CharacterDialogue from "./deleteDialogue/page";
import UpdateDialogue from "./UpdateDialogue/page";
import filterAndSortCharacters from "./utils/filterSort";
import { debug } from "console";

export default function Home() {
  const [characters, setCharacters] = useState<Character[]>([]);
  const { characters: contextCharacters, getFromBackend, sync, removeCharacter,updateCharacter,addCharacter } = useCharacters();
  const [dialogueOpen, setDialogueOpen] = useState(false);
  const [updateDialogueOpen, setUpdateDialogueOpen] = useState(false);
  const [selectedCharacter, setSelectedCharacter] = useState<any | null>(null);
  const [selectedCharacterName, setSelectedCharacterName] = useState<string | null>(null);
  const [filter, setFilter] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [serverOnline, setServerOnline] = useState<boolean | null>(null);
  const [userIsOnline, setUserIsOnline] = useState(navigator.onLine);
  const [ws, setWs] = useState<WebSocket | null>(null);

  // Combined value
  const [isOnline, setIsOnline] = useState<boolean>(userIsOnline && serverOnline === true);

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

    if (userIsOnline && serverOnline === true && !isOnline) {
      setIsOnline(true);
      sync();
    }

    const intervalId = setInterval(checkOnlineStatus, 1000);
    return () => clearInterval(intervalId);
  }, [userIsOnline, serverOnline, isOnline]);


  useEffect(() => {
    let socket = new WebSocket("ws://localhost:8000/ws/characters/");
  
    socket.onopen = () => {
      console.log("WebSocket connected");
      socket.send(JSON.stringify({ message: "helloooooooo" }));
    };
  
    socket.onerror = (error) => {
      console.error("WebSocket error:", error);
    };
  
    console.log("BBBBBBBBBBBB")
    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === "new_character") {
        console.log("CCCCCCCCCCCCCC")
        const newCharacter = data.character;
        console.log(newCharacter)
        setCharacters((prevCharacters) => [...prevCharacters, newCharacter]);
        addCharacter(newCharacter)
      }
    };
  
    socket.onclose = () => {
      console.log("WebSocket connection closed, attempting to reconnect...");
      setTimeout(() => {
        socket = new WebSocket("ws://localhost:8000/ws/characters/");  // Reconnecting
      }, 1000);  // Try to reconnect after 1 second
    };
  
    // Cleanup WebSocket connection on component unmount
    return () => {
      socket.close();
    };
  }, []);
  
  

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const charactersPerPage = 4;
  console.log

  const fetchCharacters = async () => {
    checkOnlineStatus()
    const onlineStatus = userIsOnline && serverOnline;
    if (onlineStatus) {
      try {
        const filterParam = filter ? `typeOfMedia=${filter}&` : '';
        const sortByParam = sortBy ? `ordering=${sortBy}` : 'ordering=name';
        const orderParam = sortOrder ? `&order=${sortOrder}` : '';

        const url = `http://localhost:8000/api/characters/?${filterParam}${sortByParam}${orderParam}`;
        const response = await fetch(url);
        if (response.ok) {
          const data = await response.json();
          setCharacters(data);
          getFromBackend(data);
        } else {
          console.error("Error fetching characters:", response.statusText);
        }
      } catch (error) {
        console.error("Error fetching characters:", error);
      }
    } else {
      setCharacters(contextCharacters);
      console.log(characters)
    }
  };

  // Fetch characters from the backend when component mounts or filter/sort changes
  useEffect(() => {


    fetchCharacters();
    setCurrentPage(1); // Reset page when filter/sort changes
  }, [filter, sortBy, sortOrder, userIsOnline, serverOnline]);


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
    checkOnlineStatus()
    const onlineStatus = userIsOnline && serverOnline;
    if(onlineStatus)
    {
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
    else{
      updateCharacter(updatedCharacter);
      setUpdateDialogueOpen(false);
      fetchCharacters()
    }
  }
};

// Handle delete action
const handleDeleteCharacter = async () => {
  if (selectedCharacterName) {
    checkOnlineStatus()
    const onlineStatus = userIsOnline && serverOnline;
    if(onlineStatus)
    {
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
    else{
      removeCharacter(selectedCharacterName)
      setDialogueOpen(false);
      fetchCharacters()
    }

  }
};

return (
  <>

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
              console.log(errors);
            }}
          />
        )}
      </div>

  </>
);

}