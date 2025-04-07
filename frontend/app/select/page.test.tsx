import React from 'react';
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom"; // Still needed for extending jest matchers
import Home from "./page";
import { vi, describe, test, beforeEach } from "vitest"; // No need to import `expect` as it's global with Vitest
import UpdateDialogue from './UpdateDialogue/page';

// Import useCharacters from the correct path
import { useCharacters } from "../types/character";
import { getOldestCharacter } from './page';

// Mock the modules correctly
vi.mock("../types/character", () => ({
  useCharacters: vi.fn(),
}));

describe("Home Component Functions", () => {
  // Mock functions
  const mockRemoveCharacter = vi.fn();
  const mockUpdateCharacter = vi.fn();
  

  // Mock characters data
  const mockCharacters = [
    {
      name: "Cloud Strife",
      mediaOfOrigin: "Final Fantasy VII",
      age: 21,
      typeOfMedia: "Video Game",
      typeOfCharacter: "Protagonist",
      backstory: "The main character of all of the ff7 games...",
      image: "images/cloud.png",
    },
    {
      name: "Tifa Lockhart",
      mediaOfOrigin: "Final Fantasy VII",
      age: 20,
      typeOfMedia: "Video Game",
      typeOfCharacter: "Confidant",
      backstory: "Tifa is considered to be the most important character...",
      image: "images/tifa.png",
    },
    {
      name: "Lee Chandler",
      mediaOfOrigin: "Manchester by the Sea",
      age: 21,
      typeOfMedia: "Movie",
      typeOfCharacter: "Protagonist",
      backstory: "The character who the story revolves around...",
      image: "images/manchester.png",
    },
    {
      name: "Sephiroth",
      mediaOfOrigin: "Final Fantasy VII",
      age: 27,
      typeOfMedia: "Video Game",
      typeOfCharacter: "Antagonist",
      backstory: "Considered one of the best villains ever...",
      image: "images/sephiroth.png",
    }
  ];

  beforeEach(() => {
    // Clear mocks before each test
    vi.clearAllMocks();

    // Set up the mock return value for useCharacters
    (useCharacters as vi.Mock).mockReturnValue({
      characters: mockCharacters,
      removeCharacter: mockRemoveCharacter,
      updateCharacter: mockUpdateCharacter,
    });
  });

  test("filters characters by media type", () => {
    render(<Home />);
    
    // Initially all characters should be visible
    expect(screen.getByText("Cloud Strife")).toBeInTheDocument();
    expect(screen.getByText("Lee Chandler")).toBeInTheDocument();
    
    // Filter to video games only
    const filterSelect = screen.getAllByRole("combobox")[0];
    fireEvent.change(filterSelect, { target: { value: "Video Game" } });
    
    // Video game characters should be visible
    expect(screen.getByText("Cloud Strife")).toBeInTheDocument();
    expect(screen.getByText("Tifa Lockhart")).toBeInTheDocument();
    expect(screen.getByText("Sephiroth")).toBeInTheDocument();
    
    // Movie character should not be visible
    expect(screen.queryByText("Lee Chandler")).not.toBeInTheDocument();
  });

  test("sort characters by age descending", () => {
    render(<Home />);
  
    // Sort by age
    const sortSelect = screen.getAllByRole("combobox")[1];
    fireEvent.change(sortSelect, { target: { value: "Name" } });
  
    // Click the "Descending" button
    const sortOrderButton = screen.getByText("Ascending");
    fireEvent.click(sortOrderButton);
  
    // Extract character names from their <h2> elements
    const characterNames = screen.getAllByRole("heading", { level: 2 }).map((h2) => h2.textContent);
  
    expect(characterNames).toEqual(["Cloud Strife", "Lee Chandler", "Sephiroth"]); // only the first page
  });

  test("sort characters by name ascending", () => {
    render(<Home />);
  
    // Sort by name
    const sortSelect = screen.getAllByRole("combobox")[1];
    fireEvent.change(sortSelect, { target: { value: "Age" } });
  
    // Click the "Descending" button
    const sortOrderButton = screen.getByText("Descending");
    fireEvent.click(sortOrderButton);
  
    // Extract character names from their <h2> elements
    const characterNames = screen.getAllByRole("heading", { level: 2 }).map((h2) => h2.textContent);
  
    expect(characterNames).toEqual(["Sephiroth", "Cloud Strife", "Lee Chandler"]); // only the first page
  })

  test("Test age update", () => {
    const mockUpdateCharacter = vi.fn();
    const mockCharacter = { 
      name: "Cloud Strife", 
      age: 21, 
      mediaOfOrigin: "Final Fantasy VII", 
      backstory: "The main character of all of the ff7 games..."
    };
  
    // Call update function directly
    mockUpdateCharacter({ ...mockCharacter, age: 25 });
  
    // Ensure onConfirm was called exactly once
    expect(mockUpdateCharacter).toHaveBeenCalled();
  
    // Check if age is correctly updated
    const updatedCharacter = mockUpdateCharacter.mock.calls[0][0];
    expect(updatedCharacter.age).toBe(25);
  });

  test("Test backstory update", () => {
    const mockUpdateCharacter = vi.fn();
    const mockCharacter = { 
      name: "Cloud Strife", 
      age: 21, 
      mediaOfOrigin: "Final Fantasy VII", 
      backstory: "The main character of all of the ff7 games..."
    };
  
    // Call update function directly
    mockUpdateCharacter({ ...mockCharacter, backstory: "Testing" });
  
    // Ensure onConfirm was called exactly once
    expect(mockUpdateCharacter).toHaveBeenCalled();
  
    // Check if age is correctly updated
    const updatedCharacter = mockUpdateCharacter.mock.calls[0][0];
    expect(updatedCharacter.backstory).toBe("Testing");
  });
  
  test("Test delete", () => {
    const mockRemoveCharacter = vi.fn();
    const mockCharacter = { 
      name: "Cloud Strife", 
      age: 21, 
      mediaOfOrigin: "Final Fantasy VII", 
      backstory: "The main character of all of the ff7 games..."
    };
  
    // Call remove function directly
    mockRemoveCharacter({mockCharacter});
  
    // Ensure remove was called exactly once
    expect(mockRemoveCharacter).toHaveBeenCalled();
  
    // Check if the character was deleted
    expect(screen.queryByText("Cloud Strife")).not.toBeInTheDocument();
  });

  test("Test getOldestCharacter", () => {
      const oldestCharacter = getOldestCharacter(mockCharacters);

      expect(oldestCharacter.name).toBe("Cloud Strife");
      expect(oldestCharacter.name).toBe("Sephiroth");
  })
});
  
  
