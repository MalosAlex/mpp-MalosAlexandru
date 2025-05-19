"use client";

import React, { useState, useEffect, useRef } from "react";
import { Character, useCharacters } from "../types/character";
import { User, useUser } from "../types/user"
import CharacterDialogue from "./deleteDialogue/page";
import UpdateDialogue from "./UpdateDialogue/page";
import filterAndSortCharacters from "./utils/filterSort";
import { useRouter } from "next/navigation";
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
  const { getIsLogged, getUsername } = useUser();

  useAuthRedirect(); // Check auth every second

  // Combined value
  const [isOnline, setIsOnline] = useState<boolean>(userIsOnline && serverOnline === true);

  const checkOnlineStatus = async () => {
    setUserIsOnline(navigator.onLine);
    try {
      const res = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/characters/?user=${getUsername()}`);
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
    let socket = new WebSocket(`${process.env.REACT_APP_WS_BASE_URL}/ws/characters/?user=${getUsername()}`);
  
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
        socket = new WebSocket(`${process.env.REACT_APP_WS_BASE_URL}/ws/characters/?user=${getUsername()}`);  // Reconnecting
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

  // The corrected fetchCharacters function with proper URL formatting
  const fetchCharacters = async () => {
    checkOnlineStatus()
    const onlineStatus = userIsOnline && serverOnline;
    if (onlineStatus) {
      try {
        // Correctly build URL with query parameters
        const url = new URL('${process.env.REACT_APP_API_BASE_URL}/api/characters/');
        
        // Add query parameters properly
        if (filter) {
          url.searchParams.append('typeOfMedia', filter);
        }
        
        if (sortBy) {
          url.searchParams.append('ordering', sortBy);
        }
        
        if (sortOrder) {
          url.searchParams.append('order', sortOrder);
        }
        
        const user = getUsername();
        if (user) {
          url.searchParams.append('user', user);
        }
        
        const response = await fetch(url.toString());
        if (response.ok) {
          const data = await response.json();
          console.log("A")
          console.log(data)
          console.log("B")
          setCharacters(data);
          getFromBackend(data);
        } else {
          console.error("Error fetching characters1:", response.statusText);
        }
      } catch (error) {
        console.error("Error fetching characters2:", error);
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
        await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/characters/${updatedCharacter.name}/?user=${getUsername()}`, {
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

// Checks if its still logged in
function useAuthRedirect() {
  const router = useRouter();

  useEffect(() => {
    const interval = setInterval(() => {
      if (!getIsLogged()) {
        router.push("/");
      }
    }, 1000); // check every 1 second

    return () => clearInterval(interval); // cleanup
  }, [router]);
}

// Handle delete action
const handleDeleteCharacter = async () => {
  if (selectedCharacterName) {
    checkOnlineStatus()
    const onlineStatus = userIsOnline && serverOnline;
    if(onlineStatus)
    {
      try {
        // Send delete request to backend
        await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/characters/${selectedCharacterName}/?user=${getUsername()}`, {
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
                <p><strong>Media of Origin:</strong> {char.media.name}</p>
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