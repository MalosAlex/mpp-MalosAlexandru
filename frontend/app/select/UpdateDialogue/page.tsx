"use client";
import React, { useState, useEffect } from "react";
import { useCharacters, Character } from "../../types/character"

interface UpdateDialogueProps {
  character: any;
  onConfirm: (updatedCharacter: any) => void;
  onClose: () => void;
  onError: (errors: any) => void;
}

const UpdateDialogue = ({ character, onConfirm, onClose, onError }: UpdateDialogueProps) => {
  const { characters, updateCharacter } = useCharacters();
  const [name, setName] = useState(character.name);
  const [mediaOfOrigin, setMediaOfOrigin] = useState(character.mediaOfOrigin);
  const [age, setAge] = useState(character.age.toString());
  const [typeOfMedia, setTypeOfMedia] = useState(character.typeOfMedia);
  const [typeOfCharacter, setTypeOfCharacter] = useState(character.typeOfCharacter);
  const [backstory, setBackstory] = useState(character.backstory);
  const [image, setImage] = useState(""); // For image updates if needed

  const [serverOnline, setServerOnline] = useState<boolean | null>(null);
      const [userIsOnline, setUserIsOnline] = useState(navigator.onLine);
    
      // Combined value
      const isOnline = userIsOnline && serverOnline === true;
      
      const checkOnlineStatus = async () => {
        setUserIsOnline(navigator.onLine);
        try {
          const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/characters/`);
          setServerOnline(res.ok);
        } catch {
          setServerOnline(false);
        }
      };
      
      useEffect(() => {
        checkOnlineStatus();
        const intervalId = setInterval(checkOnlineStatus, 1000);
        return () => clearInterval(intervalId);
      }, []);
  
  const [errors, setErrors] = useState({
    name: "",
    mediaOfOrigin: "",
    age: "",
    backstory: "",
    image: ""
  });

  useEffect(() => {
    setName(character.name);
    setMediaOfOrigin(character.mediaOfOrigin);
    setAge(character.age.toString());
    setTypeOfMedia(character.typeOfMedia);
    setTypeOfCharacter(character.typeOfCharacter);
    setBackstory(character.backstory);
  }, [character]);

  const handleUpdate = async () => {
    // Reset errors before submitting
    setErrors({
      name: "",
      mediaOfOrigin: "",
      age: "",
      backstory: "",
      image: ""
    });

    try {
      const onlineStatus = userIsOnline && serverOnline;
    if(onlineStatus)
    {

      // Create form data similar to add function
      const formData = new FormData();
      formData.append("name", name);
      formData.append("mediaOfOrigin", mediaOfOrigin);
      formData.append("age", age);
      formData.append("typeOfMedia", typeOfMedia);
      formData.append("typeOfCharacter", typeOfCharacter);
      formData.append("backstory", backstory);
      
      // Handle image upload if provided
      const imageInput = document.getElementById("update-image") as HTMLInputElement | null;
      if (imageInput?.files?.[0]) {
        formData.append("image", imageInput.files[0]);
      }

      console.log(formData)
      
      // Send to Django API endpoint - adjust URL to match your backend structure
      // Using the original character name as the identifier based on your viewset
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/characters/${encodeURIComponent(character.name)}/`, {
        method: "PUT", // Or PATCH if you're doing partial updates
        body: formData,
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        
        // Set local errors for display
        const updatedErrors = {
          name: errorData.name ? errorData.name[0] : "",
          mediaOfOrigin: errorData.mediaOfOrigin ? errorData.mediaOfOrigin[0] : "",
          age: errorData.age ? errorData.age[0] : "",
          backstory: errorData.backstory ? errorData.backstory[0] : "",
          image: errorData.image ? errorData.image[0] : ""
        };
        
        setErrors(updatedErrors);
        onError(errorData); // Pass full error object up
        return;
      }
      
      // Success - get updated character from response
      const updatedCharacter = await response.json();
      onConfirm(updatedCharacter);
    }
    else{
      console.log("sdsadgsadsadsadsa")
      const updatedCharacter: Character = {
              name,
              mediaOfOrigin: mediaOfOrigin,
              age: Number(age),
              typeOfMedia: typeOfMedia,
              typeOfCharacter: typeOfCharacter,
              backstory,
              image: "nothing",
            };
      console.log(updatedCharacter)
      updateCharacter(updatedCharacter);
    }
    } catch (error) {
      console.error("Update failed:", error);
      // Handle unexpected errors
      onError({ general: "Network error or unexpected problem occurred" });
    }
  };

  return (
    <div className="UpdateDialogue" role="dialog">
      <h2>Update Character</h2>
      
      <div className="form-row">
        <label htmlFor="update-name">Name:</label>
        <input
          id="update-name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        {errors.name && <div className="error">{errors.name}</div>}
      </div>
      
      <div className="form-row">
        <label htmlFor="update-media">Media of Origin:</label>
        <input
          id="update-media"
          type="text"
          value={mediaOfOrigin}
          onChange={(e) => setMediaOfOrigin(e.target.value)}
        />
        {errors.mediaOfOrigin && <div className="error">{errors.mediaOfOrigin}</div>}
      </div>
      
      <div className="form-row">
        <label htmlFor="update-age">Age:</label>
        <input
          id="update-age"
          type="text"
          value={age}
          onChange={(e) => setAge(e.target.value)}
        />
        {errors.age && <div className="error">{errors.age}</div>}
      </div>
      
      <div className="form-row">
        <label htmlFor="update-media-type">Type of Media:</label>
        <select
          id="update-media-type"
          value={typeOfMedia}
          onChange={(e) => setTypeOfMedia(e.target.value)}
        >
          <option value="">Select Media Type</option>
          <option value="Video Game">Video Game</option>
          <option value="Movie">Movie</option>
          <option value="Books">Book</option>
          <option value="Series">Series</option>
        </select>
      </div>
      
      <div className="form-row">
        <label htmlFor="update-character-type">Type of Character:</label>
        <select
          id="update-character-type"
          value={typeOfCharacter}
          onChange={(e) => setTypeOfCharacter(e.target.value)}
        >
          <option value="">Select Character Type</option>
          <option value="Protagonist">Protagonist</option>
          <option value="Antagonist">Antagonist</option>
          <option value="Deuteragonist">Deuteragonist</option>
          <option value="Confidant">Confidant</option>
          <option value="Love Option">Love Option</option>
        </select>
      </div>
      
      <div className="form-row">
        <label htmlFor="update-backstory">Backstory:</label>
        <textarea
          id="update-backstory"
          value={backstory}
          onChange={(e) => setBackstory(e.target.value)}
        />
        {errors.backstory && <div className="error">{errors.backstory}</div>}
      </div>
      
      <div className="form-row">
        <label htmlFor="update-image">Update Image:</label>
        <input
          type="file"
          id="update-image"
          accept="image/*"
          onChange={(e) => setImage(e.target.files ? e.target.files[0].name : "")}
        />
        {errors.image && <div className="error">{errors.image}</div>}
      </div>
      
      <div className="buttons">
        <button onClick={handleUpdate}>Update</button>
        <button onClick={onClose}>Cancel</button>
      </div>
    </div>
  );
};

export default UpdateDialogue;