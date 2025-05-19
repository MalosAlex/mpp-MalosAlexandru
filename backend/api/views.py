from rest_framework import viewsets, status
from django.db.models import Avg
from rest_framework.response import Response
from rest_framework.views import APIView
from django_filters import rest_framework as filters
from django.http import FileResponse
from rest_framework.generics import ListAPIView
from django.shortcuts import get_object_or_404
from rest_framework import status, generics
from .models import Character, Media, User, LogTable, MonitoredUsers
from .serializers import CharacterSerializer, LogTableSerializer, MonitoredUsersSerializer
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework import serializers
from .models import Video
from .serializers import VideoSerializer
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from rest_framework.pagination import PageNumberPagination
import mimetypes
import os

#parola1808

def getMedia(mediaId):
        try:
            media = Media.objects.get(name=mediaId)
            return media
        except Media.DoesNotExist:
            return None
        
def getUser(userName):
    try:
        user = User.objects.get(username = userName)
        return user
    except User.DoesNotExist:
        return None
        
class AgeByMediaSerializer(serializers.Serializer):
    media_type = serializers.CharField(source='media__typeOfMedia')
    avg_age = serializers.FloatField()

class AgeByMediaType(APIView):
    def get(self, request):
        data = (
            Character.objects.values('media__typeOfMedia')
            .values('media__typeOfMedia')
            .annotate(avg_age=Avg('age'))
            .order_by('media__typeOfMedia')
        )

        # Use the serializer to format the data
        serializer = AgeByMediaSerializer(data, many=True)
        return Response(serializer.data)

class CharacterViewSet(viewsets.ViewSet):
    serializer_class = CharacterSerializer

    ordering_fields = ['name', 'age']
    ordering = ['name']

    def list(self, request):
        characters = Character.objects.all()
        user = request.query_params.get('user')  # Use query_params for GET parameters
        filtered_characters = []
        if user:
            for character in characters:
                db_user = getUser(character.user)
                if db_user and user.lower() in db_user.username.lower():
                    filtered_characters.append(character)
            characters = filtered_characters


        # Manually apply filtering
        typeOfMedia_filter = request.query_params.get('typeOfMedia', None)
        if typeOfMedia_filter and user:
            characters = [
                character for character in characters
                if (typeOfMedia_filter.lower() in getMedia(character.media).typeOfMedia.lower())
            ]

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
        character = get_object_or_404(Character, name=pk)

        if not character:
            return Response({"detail": "Character not found."}, status=status.HTTP_404_NOT_FOUND)

        serializer = CharacterSerializer(character)
        return Response(serializer.data)
    
    def create(self, request):
        original_data = request.data

        # Extract the media name and type
        media_name = original_data.get('mediaOfOrigin')
        media_type = original_data.get('typeOfMedia')
        user_name = original_data.get('user')

        # Get the user
        user = getUser(user_name)
        
        LogTable.objects.create(user=user, operation='Add')
        # Get or create the Media instance
        media = Media.objects.filter(name=media_name, typeOfMedia=media_type).first()
        if not media:
            media = Media.objects.create(name=media_name, typeOfMedia=media_type)

        # Create a new character instance directly
        character = Character(
            name=original_data.get('name'),
            age=original_data.get('age'),
            typeOfCharacter=original_data.get('typeOfCharacter'),
            backstory=original_data.get('backstory'),
            image=original_data.get('image'),
            media=media,
            user=user,
        )
        
        try:
            character.save()
            return Response(CharacterSerializer(character).data, status=status.HTTP_201_CREATED)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)


    def update(self, request, pk=None):
        character = get_object_or_404(Character, name=pk)
        serializer = CharacterSerializer(character, data=request.data, partial=True)
        username = request.query_params.get('user')
        user = getUser(username)
        if user:
            LogTable.objects.create(user=user, operation='Update')
        if serializer.is_valid():
            character = serializer.save()
            return Response(CharacterSerializer(character).data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)




    # Delete character
    def destroy(self, request, pk=None):
        character = get_object_or_404(Character, name=pk)
        character.delete()
        username = request.query_params.get('user')
        user = getUser(username)
        LogTable.objects.create(user=user, operation='Delete')
        return Response(status=status.HTTP_204_NO_CONTENT)

    
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
    
class LoginView(APIView):
    users = User.objects.all()

    def post(self, request):
        login_username = request.data.get('username')
        login_password = request.data.get('password')

        user = User.objects.filter(username=login_username, password=login_password).first()

        if not user:
            return Response({"error": "Invalid credentials."}, status=status.HTTP_401_UNAUTHORIZED)

        return Response({
            "message": "Login successful.",
            "user": user.username,
            "isAdmin": user.is_admin
        }, status=status.HTTP_200_OK)



class RegisterView(APIView):
    users = User.objects.all()

    def post(self, request):
        register_username = request.data.get('username')
        register_password = request.data.get('password')

        if not register_username or not register_password:
            return Response({"error": "Username and password are required."}, status=status.HTTP_400_BAD_REQUEST)

        if User.objects.filter(username=register_username).exists():
            return Response({"error": "Username already exists."}, status=status.HTTP_409_CONFLICT)

        user = User.objects.create(username=register_username, password=register_password, is_admin=False)
        return Response({"message": "User registered successfully."}, status=status.HTTP_201_CREATED)
    
class LogPagination(PageNumberPagination):
    page_size = 10

class LogTableView(ListAPIView):
    queryset = LogTable.objects.select_related('user').order_by('-timestamp')
    serializer_class = LogTableSerializer
    pagination_class = LogPagination
    permission_classes = [IsAuthenticatedOrReadOnly]

class MonitorPagination(PageNumberPagination):
    page_size = 10

class MonitorTableView(ListAPIView):
    queryset = MonitoredUsers.objects.select_related('user')
    serializer_class = MonitoredUsersSerializer
    pagination_class = MonitorPagination
    permission_classes = [IsAuthenticatedOrReadOnly]

