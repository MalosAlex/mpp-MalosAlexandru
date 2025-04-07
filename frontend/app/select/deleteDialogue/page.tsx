"use client"

import { useState } from "react";

interface CharacterDialogueProps {
  characterName: string;
  onConfirm: () => void;
  onClose: () => void;
}

export default function CharacterDialogue({ characterName, onConfirm, onClose }: CharacterDialogueProps) {
  const [input, setInput] = useState<string>("");

  return (
    <div className="DialogueOverlay">
      <div className="DialogueBox">
        <h2>Delete Character</h2>
        <p>Type "<strong>{characterName}</strong>" to confirm deletion:</p>
        <input
          type="text"
          value={input}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setInput(e.target.value)}
          className="DialogueInput"
        />
        <div className="DialogueActions">
          <button onClick={onClose} className="CancelButton" aria-label="Cancel">Cancel</button>
          <button
            onClick={() => input === characterName && onConfirm()}
            disabled={input !== characterName}
            className="ConfirmDeleteButton"
            aria-label="Delete Character"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
