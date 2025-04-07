// filterAndSortCharacters.js or .ts
import { Character } from "../../types/character";

function filterAndSortCharacters(
  characters: Character[], 
  filter: string | null, 
  sortBy: string | null, 
  sortOrder: "asc" | "desc"
) {
  return characters
    .filter((char) => (filter ? char.typeOfMedia === filter : true))
    .sort((a, b) => {
      if (!sortBy) return 0;
      if (sortBy === "Age") return sortOrder === "asc" ? Number(a.age) - Number(b.age) : Number(b.age) - Number(a.age);
      if (sortBy === "Name") return sortOrder === "asc" ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name);
      return 0;
    });
}

export default filterAndSortCharacters;