"use client";

import React, { createContext, useContext, useState, ReactNode} from 'react';

export type Character = {
    name: string;
    mediaOfOrigin: string;
    age: number;
    typeOfMedia: string;
    typeOfCharacter: string;
    backstory: string;
    image: string; // images/image.png
  }

// the context type, having the list and the add function
type CharacterContextType = {
  characters: Character[];
  addCharacter: (character: Character) => void;
  removeCharacter: (name: string) => void;
  updateCharacter: (updatedCharacter: Character) => void;
};

// creating the context
const CharacterContext = createContext<CharacterContextType | undefined>(undefined);

export function CharacterProvider({children}: {children: ReactNode}){

    // fill the list with predifined characters
    const [characters, setCharacters] = useState<Character[]>([
        
    ])

    const addCharacter = (character : Character) => {
        
        setCharacters((prev) => [...prev, character]);
    }

    const removeCharacter = (name: string) => {
        setCharacters((prev) => prev.filter(char => char.name !== name));
    };

    const updateCharacter = (updatedCharacter: Character) => {
        setCharacters((prev) =>
          prev.map((char) =>
            char.name === updatedCharacter.name ? { ...char, ...updatedCharacter } : char
          )
        );
      };

    return (
        <CharacterContext.Provider value={{characters, addCharacter,removeCharacter,updateCharacter}}>
            {children}
        </CharacterContext.Provider>
    );
}

export function useCharacters(){
    const context = useContext(CharacterContext);
    if(!context){
        throw new Error("useCharacters must be used within a CharacterProvider")
    }
    return context
}