"use client";

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

export type Character = {
  name: string;
  media: {
    id: number;
    name: string;
    typeOfMedia: string;
  };
  age: number;
  typeOfCharacter: string;
  backstory: string;
  image: string;
};


type CharacterContextType = {
  characters: Character[];
  addCharacter: (character: Character) => void;
  removeCharacter: (name: string) => void;
  updateCharacter: (updatedCharacter: Character) => void;
  getFromBackend: (data: Character[]) => void;
  sync: () => void;
};

const CharacterContext = createContext<CharacterContextType | undefined>(undefined);

export function CharacterProvider({ children }: { children: ReactNode }) {
  const [characters, setCharacters] = useState<Character[]>([]); // In-memory state

  // Tracking operations
  const [addedCharacters, setAddedCharacters] = useState<Character[]>([]);
  const [updatedCharacters, setUpdatedCharacters] = useState<Character[]>([]);
  const [deletedCharacters, setDeletedCharacters] = useState<string[]>([]);

  const addCharacter = (character: Character) => {
    setCharacters((prev) => [...prev, character]);
    setAddedCharacters((prev) => [...prev, character]);
  };

  const removeCharacter = (name: string) => {
    setCharacters((prev) => prev.filter((char) => char.name !== name));
    setDeletedCharacters((prev) => [...prev, name]);
  };

  const updateCharacter = (updatedCharacter: Character) => {
    setCharacters((prev) =>
      prev.map((char) =>
        char.name === updatedCharacter.name
          ? {
              ...char,
              ...updatedCharacter,
              image: updatedCharacter.image === "nothing" ? char.image : updatedCharacter.image,
            }
          : char
      )
    );
    setUpdatedCharacters((prev) => [...prev, updatedCharacter])
    console.log("omgg")
    console.log(updatedCharacter)
    console.log(updatedCharacters)
  };
  

  const getFromBackend = (data: Character[]) => {
    setCharacters(data);
  };

  const sync = async () => {
    // Sync the added characters
    console.log(addedCharacters)
    console.log("helo")
    for (const character of addedCharacters) {
      try {
        // Get all characters first to check existence
        const allCharsResponse = await fetch(`http://localhost:8000/api/characters/`);
        const allCharacters = await allCharsResponse.json();
        console.log("All characters:", allCharacters);
        console.log("All added before:", addedCharacters);
        console.log("Trying to add:", character.name);
        
        // Check if this character exists
        const exists = allCharacters.some(
          (char: Character) => char.name.toLowerCase() === character.name.toLowerCase()
        );
        
        if (exists) {
          console.log(`Character ${character.name} already exists, skipping...`);
          continue;
        }
        
        
        // Now proceed with creating the character
        const formData = new FormData();
        formData.append("name", character.name);
        formData.append("mediaOfOrigin", character.media.name);
        formData.append("age", String(character.age));
        formData.append("typeOfMedia", character.media.typeOfMedia);
        formData.append("typeOfCharacter", character.typeOfCharacter);
        formData.append("backstory", character.backstory);
        formData.append("image", character.image);

        console.log("AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA");
        console.log(character.image);
        // Handle image upload
        /*if (typeof character.image === "string") {
          if (character.image.startsWith("/images/") || character.image.startsWith("images/")) {
            try {
              const imageResponse = await fetch(character.image);
              const imageBlob = await imageResponse.blob();
              const filename = character.image.split('/').pop() || 'image.jpg';
              const imageFile = new File([imageBlob], filename, { 
                type: imageBlob.type 
              });
              formData.append("image", imageFile);
            } catch (error) {
              console.error("Error fetching image file:", error);
            }
          }
        }*/
        
        const response = await fetch("http://localhost:8000/api/characters/", {
          method: "POST",
          body: formData,
        });
        console.log(response);
        if (!response.ok) {
          const errorText = await response.text();
          console.error("Failed to add character. Status:", response.status, errorText);
        }
      } catch (error) {
        console.error("Error processing character:", error);
      }
    }

    function isFile(value: any): value is File {
      return value instanceof File;
    }
  
    // Sync the updated characters
    for (const updatedCharacter of updatedCharacters) {
      console.log("helobaby")
      try {
        const response = await fetch(`http://localhost:8000/api/characters/${updatedCharacter.name}/`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(updatedCharacter),
        });
  
        if (!response.ok) {
          console.error("Failed to update character. Status:", response.status, await response.text());
        }
      } catch (error) {
        console.error("Error updating character:", error);
      }
    }
  
    // Sync the deleted characters
    for (const name of deletedCharacters) {
      try {
        const response = await fetch(`http://localhost:8000/api/characters/${name}/`, {
          method: 'DELETE',
        });
  
        if (!response.ok) {
          console.error("Failed to delete character. Status:", response.status, await response.text());
        }
      } catch (error) {
        console.error("Error deleting character:", error);
      }
    }
  
  };
  
  

  return (
    <CharacterContext.Provider value={{ characters, addCharacter, removeCharacter, updateCharacter, getFromBackend, sync }}>
      {children}
    </CharacterContext.Provider>
  );
}

export function useCharacters() {
  const context = useContext(CharacterContext);
  if (!context) {
    throw new Error("useCharacters must be used within a CharacterProvider");
  }
  return context;
}
