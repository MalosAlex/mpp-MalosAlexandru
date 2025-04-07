"use client";

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

export type Character = {
  name: string;
  mediaOfOrigin: string;
  age: number;
  typeOfMedia: string;
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
        char.name === updatedCharacter.name ? { ...char, ...updatedCharacter } : char
      )
    );
    setUpdatedCharacters((prev) =>
      prev.map((char) =>
        char.name === updatedCharacter.name ? { ...char, ...updatedCharacter } : char
      )
    );
  };

  const getFromBackend = (data: Character[]) => {
    setCharacters(data);
  };

  const sync = async () => {
    // Sync the added characters
    for (const character of addedCharacters) {
      try {
        await fetch("http://localhost:8000/api/characters/", {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(character),
        });
      } catch (error) {
        console.error("Error adding character:", error);
      }
    }

    // Sync the updated characters
    for (const updatedCharacter of updatedCharacters) {
      try {
        await fetch(`http://localhost:8000/api/characters/${updatedCharacter.name}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(updatedCharacter),
        });
      } catch (error) {
        console.error("Error updating character:", error);
      }
    }

    // Sync the deleted characters
    for (const name of deletedCharacters) {
      try {
        await fetch(`http://localhost:8000/api/characters/${name}/`, {
          method: 'DELETE',
        });
      } catch (error) {
        console.error("Error deleting character:", error);
      }
    }

    // Clear the operation logs after sync
    setAddedCharacters([]);
    setUpdatedCharacters([]);
    setDeletedCharacters([]);
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
