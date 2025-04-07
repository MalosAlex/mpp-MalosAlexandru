"use client"

import { Character,useCharacters } from "../types/character";


export function createCharacters(addCharacter: (character: Character) => void) {
    
    const newCharacters: Character[] = [
        {
            name: "Geralt of Rivia",
            mediaOfOrigin: "The Witcher",
            age: 100,
            typeOfMedia: "Books",
            typeOfCharacter: "Protagonist",
            backstory: "A monster hunter known as a Witcher, trying to find his place in the world while protecting those he cares about.",
            image: "images/geralt.png"
        },
        {
            name: "Arthur Morgan",
            mediaOfOrigin: "Red Dead Redemption 2",
            age: 36,
            typeOfMedia: "Video Game",
            typeOfCharacter: "Protagonist",
            backstory: "A rugged outlaw torn between loyalty and his own sense of morality in the dying Wild West.",
            image: "images/arthur.png"
        },
        {
            name: "Darth Vader",
            mediaOfOrigin: "Star Wars",
            age: 45,
            typeOfMedia: "Movie",
            typeOfCharacter: "Antagonist",
            backstory: "Once a Jedi Knight named Anakin Skywalker, he fell to the dark side and became a Sith Lord.",
            image: "images/vader.png"
        },
        {
            name: "Tyrion Lannister",
            mediaOfOrigin: "Game of Thrones",
            age: 32,
            typeOfMedia: "Series",
            typeOfCharacter: "Deuteragonist",
            backstory: "A witty and intelligent nobleman from House Lannister who navigates the dangerous politics of Westeros using his sharp mind rather than brute force.",
            image: "images/tyrion.png"
        },
        {
            name: "Atticus Finch",
            mediaOfOrigin: "To Kill a Mockingbird",
            age: 50,
            typeOfMedia: "Books",
            typeOfCharacter: "Confidant",
            backstory: "A wise and compassionate lawyer in the racially divided South, dedicated to justice and raising his children with strong moral values.",
            image: "images/atticus.png"
        },
        {
            name: "Ellen Ripley",
            mediaOfOrigin: "Alien",
            age: 35,
            typeOfMedia: "Movie",
            typeOfCharacter: "Protagonist",
            backstory: "A resourceful and determined warrant officer who fights for survival against a deadly extraterrestrial species.",
            image: "images/ripley.png"
        },
        {
            name: "Vito Corleone",
            mediaOfOrigin: "The Godfather",
            age: 53,
            typeOfMedia: "Movie",
            typeOfCharacter: "Antagonist",
            backstory: "A powerful mafia boss who rules with a mix of intimidation and wisdom, seeking to secure his family's legacy while adhering to his own moral code.",
            image: "images/vito.png"
        },
        {
            name: "Elizabeth Bennet",
            mediaOfOrigin: "Pride and Prejudice",
            age: 20,
            typeOfMedia: "Books",
            typeOfCharacter: "Love Option",
            backstory: "A strong-willed and intelligent woman who navigates societal expectations and personal growth, refusing to settle for anything less than true love.",
            image: "images/elizabeth.png"
        }
    ];

    newCharacters.forEach((character, index) => {
        setTimeout(() => {
            addCharacter(character);
        }, index * 1000); // Adds one character per second
    });
}


