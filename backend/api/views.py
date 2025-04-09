from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.views import APIView
from django_filters import rest_framework as filters
from django.http import FileResponse
from rest_framework import status, generics
from .models import Character
from .serializers import CharacterSerializer
from rest_framework.parsers import MultiPartParser, FormParser
from .models import Video
from .serializers import VideoSerializer
import mimetypes
import os

mock_characters = []

mock_characters.clear()
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
    
    def retrieve(self, request, pk=None):
        character = next((char for char in mock_characters if char.name == pk), None)
        if not character:
            return Response({"detail": "Character not found."}, status=status.HTTP_404_NOT_FOUND)

        serializer = CharacterSerializer(character)
        return Response(serializer.data)
    
    def add_mock_character(self, data):
        # Create a new Character instance directly instead of using serializer.save()
        try:
            new_character = Character(
                name=data.get('name'),
                mediaOfOrigin=data.get('mediaOfOrigin'),
                age=int(data.get('age')),
                typeOfMedia=data.get('typeOfMedia'),
                typeOfCharacter=data.get('typeOfCharacter'),
                backstory=data.get('backstory'),
                image=data.get('image')
            )
            mock_characters.append(new_character)
            return new_character
        except Exception as e:
            print("Error creating character:", e)
            return None

    def create(self, request):
        # Check if character already exists
        if any(char.name == request.data.get('name') for char in mock_characters):
            return Response({"error": "Character with this name already exists"}, 
                        status=status.HTTP_400_BAD_REQUEST)
        
        new_character = self.add_mock_character(request.data)
        if new_character:
            # Use serializer only for conversion to JSON, not saving
            serializer = CharacterSerializer(new_character)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response({"error": "Invalid data"}, status=status.HTTP_400_BAD_REQUEST)

    def update(self, request, pk=None):
        # Find the character by name
        character = next((char for char in mock_characters if char.name == pk), None)

        if not character:
            return Response({"detail": "Character not found."}, status=status.HTTP_404_NOT_FOUND)

        # Create a copy of the request data
        data = request.data.copy()
        
        # Perform the update directly on the character object
        if 'name' in data and data['name'] != character.name:
            # Only check for duplicates if name is changing
            name_exists = any(char.name == data['name'] for char in mock_characters if char != character)
            if name_exists:
                return Response({"name": ["Character with this name already exists."]}, 
                            status=status.HTTP_400_BAD_REQUEST)
        
        # Update the character attributes directly
        if 'age' in data:
            character.age = int(data['age'])
        if 'mediaOfOrigin' in data:
            character.mediaOfOrigin = data['mediaOfOrigin']
        if 'typeOfMedia' in data:
            character.typeOfMedia = data['typeOfMedia']
        if 'typeOfCharacter' in data:
            character.typeOfCharacter = data['typeOfCharacter']
        if 'backstory' in data:
            character.backstory = data['backstory']
        if 'image' in data and data['image'] != 'nothing':
            character.image = data['image']
        
        # Return the updated character
        serializer = CharacterSerializer(character)
        return Response(serializer.data)


    # Delete character
    def destroy(self, request, pk=None):
        character = next((char for char in mock_characters if char.name == pk), None)
        if not character:
            return Response({"detail": "Character not found."}, status=status.HTTP_404_NOT_FOUND)

        # Remove character from the mock list
        mock_characters.remove(character)

        return Response({"detail": "Character deleted successfully."}, status=status.HTTP_204_NO_CONTENT)
    
class VideoListCreateView(generics.ListCreateAPIView):
    queryset = Video.objects.all()
    serializer_class = VideoSerializer
    parser_classes = [MultiPartParser, FormParser]

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            serializer.save()  # Save the video, including the file
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
class VideoDetailView(generics.RetrieveUpdateDestroyAPIView):  # Add this view
    queryset = Video.objects.all()
    serializer_class = VideoSerializer

class VideoDownloadView(generics.RetrieveAPIView):
    queryset = Video.objects.all()
    
    def get(self, request, *args, **kwargs):
        video = self.get_object()
        file_path = video.file.path
        
        # Try to determine the file's MIME type
        content_type, _ = mimetypes.guess_type(file_path)
        if not content_type:
            content_type = 'application/octet-stream'  # Default content type
            
        # Get the filename
        filename = os.path.basename(file_path)
        
        # Create the response with the file
        response = FileResponse(open(file_path, 'rb'), content_type=content_type)
        response['Content-Disposition'] = f'attachment; filename="{filename}"'
        return response