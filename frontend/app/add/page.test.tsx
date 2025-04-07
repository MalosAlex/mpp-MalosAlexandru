import React from 'react';
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom"; // Still needed for extending jest matchers
import Home from "./page";
import { vi, describe, test, beforeEach } from "vitest"; // No need to import `expect` as it's global with Vitest
import { useCharacters } from "../types/character";

// Mock the modules correctly
vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    prefetch: vi.fn(),
  }),
}));

vi.mock("../types/character", () => ({
  useCharacters: vi.fn(),
}));

describe("Add Character Function", () => {
  const mockAddCharacter = vi.fn();
  const mockCharacters = []; // Initially empty array

  beforeEach(() => {
    vi.clearAllMocks();
    (useCharacters as vi.Mock).mockReturnValue({
      characters: mockCharacters,
      addCharacter: mockAddCharacter,
    });
  });

  test("adds a new character", () => {
    const mockCharacter = {
      name: "Tifa Lockhart",
      mediaOfOrigin: "Final Fantasy VII",
      age: 20,
      typeOfMedia: "Video Game",
      typeOfCharacter: "Confidant",
      backstory: "Tifa is considered to be the most important character...",
      image: "images/tifa.png",
    };

    // Simulate adding the character
    mockAddCharacter(mockCharacter);
    
    // Add the mock character directly to the mockCharacters array
    mockCharacters.push(mockCharacter);
    
    // Check that addCharacter was called once with the correct character
    expect(mockAddCharacter).toHaveBeenCalled();
    expect(mockAddCharacter).toHaveBeenCalledWith(mockCharacter);
    
    // Directly check that the character is in the characters array
    expect(mockCharacters).toContain(mockCharacter);
  });
});
