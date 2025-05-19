"use client";
import React,{ useEffect, useState } from "react";
import { useCharacters, Character } from "../types/character";
import { useUser, User } from "../types/user";
import { useRouter } from "next/navigation";

export default function Home() {
  const { characters, addCharacter } = useCharacters();
  const router = useRouter();

  const [name, setName] = useState("");
  const [nameError, setNameError] = useState("");
  const [media, setMedia] = useState("");
  const [mediaError, setMediaError] = useState("");
  const [age, setAge] = useState("");
  const [ageError, setAgeError] = useState("");
  const [backstory, setStory] = useState("");
  const [storyError, setStoryError] = useState("");
  const [mediaType, setMediaType] = useState("");
  const [characterType, setCharType] = useState("");
  const [image, setImage] = useState("");
  const [dialogueOpen, setDialogueOpen] = useState(false);
  const [wasSuccessful, setWasSuccessful] = useState(false);
  const { getUsername } = useUser();

  const [serverOnline, setServerOnline] = useState<boolean | null>(null);
    const [userIsOnline, setUserIsOnline] = useState(navigator.onLine);
  
    // Combined value
    const isOnline = userIsOnline && serverOnline === true;
    
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
      const intervalId = setInterval(checkOnlineStatus, 1000);
      return () => clearInterval(intervalId);
    }, []);


  /*
  const validateName = () => {
    if (!name) {
      setNameError("Name cannot be empty");
    } else {
      setNameError("");
    }
  };

  const validateMedia = () => {
    if (!media) {
      setMediaError("Media or origin cannot be empty");
    } else {
      setMediaError("");
    }
  };

  const validateAge = () => {
    if (!age) {
      setAgeError("Age cannot be empty");
    } else if (isNaN(Number(age))) {
      setAgeError("Age must be a number");
    } else {
      setAgeError("");
    }
  };

  const validateStory = () => {
    if (!backstory) {
      setStoryError("Backstory cannot be empty");
    } else {
      setStoryError("");
    }
  };
  */

  const handleSubmit = async () => {
    const onlineStatus = userIsOnline && serverOnline;
    const user = getUsername();
    if(onlineStatus && user)
    {

      const formData = new FormData();
      formData.append("name", name);
      formData.append("mediaOfOrigin", media);
      formData.append("age", String(age));
      formData.append("typeOfMedia", mediaType);
      formData.append("typeOfCharacter", characterType);
      formData.append("backstory", backstory);
      formData.append("image", "images/" + image);
      formData.append("user", user);
      
      /*
      const imageInput = document.getElementById("image") as HTMLInputElement | null;
      if (imageInput?.files?.[0]) {
        formData.append("image", imageInput.files[0]);
      }*/

      
      
      const response = await fetch("http://localhost:8000/api/characters/", {
        method: "POST",
        body: formData,
      });
      
      if (!response.ok) {
        let errorText = await response.text();
        let errors: any = {};

        try {
          errors = JSON.parse(errorText);
        } catch (e) {
          console.error("Non-JSON response:", errorText);
          alert("Server error: " + errorText);
        }


        
        // Clear previous errors
        setNameError("");
        setMediaError("");
        setAgeError("");
        setStoryError("");

        console.log("heloo");
        console.log(errors);
        
        if (errors.name) setNameError(errors.name[0]);
        if (errors.mediaOfOrigin) setMediaError(errors.mediaOfOrigin[0]);
        if (errors.age) setAgeError(errors.age[0]);
        if (errors.backstory) setStoryError(errors.backstory[0]);
        if (errors.image) alert("Image error: " + errors.image[0]);
        
        setWasSuccessful(false); 
        setDialogueOpen(true);
        return;
      }
      
      // Success
      await response.json();
      setWasSuccessful(true); 
      setDialogueOpen(true);
      
    }
    else{
      const updatedImage = "images/" + image;
      const newCharacter: Character = {
        name,
        mediaOfOrigin: media,
        age: Number(age),
        typeOfMedia: mediaType,
        typeOfCharacter: characterType,
        backstory,
        image: updatedImage,
      };

      console.log(image)
    
      addCharacter(newCharacter);
      setWasSuccessful(true);
      setDialogueOpen(true);
    }
    
  };

  const simulateAttack = async () => {
  const user = getUsername();
  if (!user) {
    alert("You must be logged in to simulate the attack.");
    return;
  }

  for (let i = 0; i < 30; i++) {
    const randomNum = Math.floor(Math.random() * 10000);
    const name = `Attack_${i}_${randomNum}`;

    const formData = new FormData();
    formData.append("name", name);
    formData.append("mediaOfOrigin", "AttackSim");
    formData.append("age", "999");
    formData.append("typeOfMedia", "Video Game");
    formData.append("typeOfCharacter", "Antagonist");
    formData.append("backstory", "Simulated attack character.");
    formData.append("image", "images/placeholder.png"); // Replace with real image path if needed
    formData.append("user", user);

    try {
      const res = await fetch("http://localhost:8000/api/characters/", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        console.warn(`Failed to create character ${name}`);
      }
    } catch (err) {
      console.error("Request error:", err);
    }

    await new Promise((r) => setTimeout(r, 100)); // small delay between requests
  }

  alert("Simulated attack complete.");
};

  
  
  return (
    <div>
      <div className="Add">
        <label htmlFor="name">
          Name:
          <input 
            type="text" 
            id="name" 
            onChange={(e) => setName(e.target.value)} 
            className="TextField" 
          />
          {nameError && <p className="Error">{nameError}</p>}
        </label>
  
        <label htmlFor="media">
          Media of Origin:
          <input 
            type="text" 
            id="media" 
            onChange={(e) => setMedia(e.target.value)} 
            className="TextField" 
          />
          {mediaError && <p className="Error">{mediaError}</p>}
        </label>
  
        <label htmlFor="age">
          Age:
          <input 
            type="text" 
            id="age" 
            onChange={(e) => setAge(e.target.value)} 
            className="TextField" 
          />
          {ageError && <p className="Error">{ageError}</p>}
        </label>
  
        <label htmlFor="mediaType">
          Type of Media:
          <select 
            id="mediaType" 
            value={mediaType} 
            onChange={(e) => setMediaType(e.target.value)} 
            className="DropDown"
          >
            <option value="">Select Media Type</option>
            <option value="Video Game">Video Game</option>
            <option value="Movie">Movie</option>
            <option value="Books">Book</option>
            <option value="Series">Series</option>
          </select>
        </label>
  
        <label htmlFor="characterType">
          Type of Character:
          <select 
            id="characterType" 
            value={characterType} 
            onChange={(e) => setCharType(e.target.value)} 
            className="DropDown"
          >
            <option value="">Select Character Type</option>
            <option value="Protagonist">Protagonist</option>
            <option value="Antagonist">Antagonist</option>
            <option value="Deuteragonist">Deuteragonist</option>
            <option value="Confidant">Confidant</option>
            <option value="Love Option">Love Option</option>
          </select>
        </label>
  
        <label htmlFor="backstory">
          Backstory:
          <textarea 
            id="backstory" 
            className="TextField" 
            onChange={(e) => setStory(e.target.value)} 
          />
          {storyError && <p className="Error">{storyError}</p>}
        </label>
  
        <label htmlFor="image">
          Image:
          <input 
            type="file" 
            id="image" 
            accept="image/*" 
            onChange={(e) => setImage(e.target.files ? e.target.files[0].name : "")} 
          />
        </label>
      </div>
  
      <button className="ConfirmButton" onClick={handleSubmit}>Confirm</button>
      <button onClick={simulateAttack} style={{ marginTop: "1rem", padding: "0.5rem", backgroundColor: "red", color: "white" }}>
        Simulate Attack
      </button>
  
      {dialogueOpen && (
        <div className="dialogue">
          <p>{wasSuccessful ? "Character added successfully!" : "Character not added. Check the fields."}</p>
          <button onClick={() => {
            setDialogueOpen(false);
            if (wasSuccessful) router.push("../select");
          }}>
            OK
          </button>
        </div>
      )}
    </div>
  );
  
  


  
}
