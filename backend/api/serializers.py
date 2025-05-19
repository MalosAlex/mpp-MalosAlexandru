from rest_framework import serializers
from .models import Character, Video, Media, User, LogTable, MonitoredUsers


class MediaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Media
        fields = ['id', 'name', 'typeOfMedia']

class CharacterSerializer(serializers.ModelSerializer):
    media = MediaSerializer()
    class Meta:
        model = Character
        fields = ['id', 'name', 'age', 'typeOfCharacter', 'backstory', 'image', 'media', 'user']
    
class VideoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Video
        fields = ['id', 'title', 'file']

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['username', 'password', 'is_admin']

class LogTableSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username', default="Unknown")

    class Meta:
        model = LogTable
        fields = ['id', 'username', 'operation', 'timestamp']

class MonitoredUsersSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username', default="Unknown")
    
    class Meta:
        model = MonitoredUsers
        fields = ['username', 'timestamp']