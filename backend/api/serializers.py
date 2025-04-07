from rest_framework import serializers
from .models import Character

class CharacterSerializer(serializers.ModelSerializer):
    class Meta:
        model = Character
        fields = '__all__'

    def validate_name(self, value):
        # Example: Name must not be empty or too short
        if not value:
            raise serializers.ValidationError("Name cannot be empty.")
        if len(value) < 3:
            raise serializers.ValidationError("Name must be at least 3 characters long.")
        return value

    def validate_age(self, value):
        # Example: Age must be a positive number
        if value <= 0:
            raise serializers.ValidationError("Age must be a positive number.")
        return value

    def validate_mediaOfOrigin(self, value):
        # Example: MediaOfOrigin should not be empty
        if not value:
            raise serializers.ValidationError("MediaOfOrigin cannot be empty.")
        return value

    def validate(self, data):
        # Add general validation rules if needed
        return data