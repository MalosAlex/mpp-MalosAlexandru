from rest_framework import viewsets, status
from rest_framework.response import Response
from django_filters import rest_framework as filters
from .models import Character
from .serializers import CharacterSerializer

mock_characters = [
    Character(name="Cloud Strife", mediaOfOrigin="Final Fantasy VII", age=21, typeOfMedia="Video Game", 
              typeOfCharacter="Protagonist", backstory="The main character of all of the ff7 games, along the story we experience Cloud's identity crisis which is also the main theme of the games", 
              image="images/cloud.png"),
    
    Character(name="Tifa Lockhart", mediaOfOrigin="Final Fantasy VII", age=20, typeOfMedia="Video Game", 
              typeOfCharacter="Confidant", backstory="Tifa is considered to be the most important character in the game as she holds the team together, by helping Cloud remain sane and find himself again.", 
              image="images/tifa.png"),

    Character(name="Sephiroth", mediaOfOrigin="Final Fantasy VII", age=27, typeOfMedia="Video Game", 
              typeOfCharacter="Antagonist", backstory="Considered one of the best villains ever, he is a master at manipulating Cloud and extremely strong. His main goal is to attain godhood by destroying the planet in revenge for his mother.", 
              image="images/sephiroth.png"),

    Character(name="Lee Chandler", mediaOfOrigin="Manchester by the Sea", age=21, typeOfMedia="Movie", 
              typeOfCharacter="Protagonist", backstory="The character who the story is revolved around, the story focusing on the grief he faces after an accident cause by him leading to the death of his wife and children.", 
              image="images/manchester.png"),

    Character(name="Paul Atreides", mediaOfOrigin="Dune", age=25, typeOfMedia="Books", 
              typeOfCharacter="Protagonist", backstory="The main character of the original series. The action revolves around him taking the planet back from the family that killed his family, while becoming the legendary Lisan al-gaib", 
              image="images/dune.png"),

    Character(name="Saul Goodman", mediaOfOrigin="Breaking Bad", age=49, typeOfMedia="Series", 
              typeOfCharacter="Deuteragonist", backstory="The second most important character in the Breaking Bad show, getting his own spin off. He is a man obsessed with being recognised as a real lawyer and being useful through any way.", 
              image="images/saul.png")
]


class CharacterViewSet(viewsets.ViewSet):
    serializer_class = CharacterSerializer

    ordering_fields = ['name', 'age']
    ordering = ['name']

    def list(self, request):
        characters = mock_characters

        # Manually apply filtering
        typeOfMedia_filter = request.query_params.get('typeOfMedia', None)
        if typeOfMedia_filter:
            characters = [character for character in characters if typeOfMedia_filter.lower() in character.typeOfMedia.lower()]

        # Apply ordering manually if needed
        ordering = request.query_params.get('ordering', self.ordering[0]).lower()
        order = request.query_params.get('order', None)  # 'asc' or 'desc'

        if ordering:
            print(f"Ordering by: {ordering} - {order}")

            # Check if the sorting should be ascending or descending
            reverse = order == 'desc'  # If order is 'desc', reverse should be True
            characters = sorted(characters, key=lambda x: getattr(x, ordering), reverse=reverse)

        # Return filtered and sorted data
        serializer = CharacterSerializer(characters, many=True)
        return Response(serializer.data)

    def create(self, request):
        # Use the serializer to validate incoming data
        serializer = CharacterSerializer(data=request.data)
        if serializer.is_valid():
            # Save the new character to the mock_characters list
            new_character = serializer.save()  # This assumes you have a save method that adds it
            mock_characters.append(new_character)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def update(self, request, pk=None):
        # Find the character by ID (you should use an actual unique identifier like 'id')
        character = next((char for char in mock_characters if char.name == pk), None)
        
        if not character:
            return Response({"detail": "Character not found."}, status=status.HTTP_404_NOT_FOUND)

        # Use the serializer to validate and update the character fields
        serializer = CharacterSerializer(character, data=request.data, partial=True)
        if serializer.is_valid():
            # Apply the updates
            serializer.save()  # This will apply changes to the mock_characters or DB
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    # Delete character
    def destroy(self, request, pk=None):
        character = next((char for char in mock_characters if char.name == pk), None)
        if not character:
            return Response({"detail": "Character not found."}, status=status.HTTP_404_NOT_FOUND)

        # Remove character from the mock list
        mock_characters.remove(character)

        return Response({"detail": "Character deleted successfully."}, status=status.HTTP_204_NO_CONTENT)