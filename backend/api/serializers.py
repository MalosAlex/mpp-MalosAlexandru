from rest_framework import serializers
from .models import Character, Video


class CharacterSerializer(serializers.ModelSerializer):
    class Meta:
        model = Character
        fields = '__all__'


    def validate_age(self, value):
        # Example: Age must be a positive number
        if value <= 0:
            raise serializers.ValidationError("Age must be a positive number.")
        return value
    
    def create(self, validated_data):
        # No database operation, just return a new instance
        return Character(**validated_data)

    def validate_mediaOfOrigin(self, value):
        # Example: MediaOfOrigin should not be empty
        if not value:
            raise serializers.ValidationError("MediaOfOrigin cannot be empty.")
        return value

    def validate(self, data):
        # Add general validation rules if needed
        return data
    
class VideoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Video
        fields = ['id', 'title', 'file']