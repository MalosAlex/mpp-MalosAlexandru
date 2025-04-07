from django.core.files.uploadedfile import SimpleUploadedFile
from django.test import TestCase
from api.serializers import CharacterSerializer
from api.models import Character
from PIL import Image
import io

class MySerializerTest(TestCase):
    def test_serializer_valid_data(self):
        # Create an in-memory image
        image = Image.new('RGB', (100, 100), color='blue')
        image_io = io.BytesIO()
        image.save(image_io, format='PNG')  # Save the image in PNG format
        image_io.seek(0)  # Go to the beginning of the BytesIO object

        # Create a SimpleUploadedFile with the in-memory image
        image_file = SimpleUploadedFile(
            "cloud.png",  # filename
            image_io.read(),  # read the image data
            content_type="image/png"  # MIME type of the file
        )

        data = {
            'name': 'Cloud Strife',
            'mediaOfOrigin': 'Final Fantasy VII',
            'age': 21,
            'typeOfMedia': 'Video Game',
            'typeOfCharacter': 'Protagonist',
            'backstory': 'The main character of all of the ff7 games, along the story we experience Cloud\'s identity crisis which is also the main theme of the games',
            'image': image_file  # Use the valid in-memory image here
        }

        serializer = CharacterSerializer(data=data)
        self.assertTrue(serializer.is_valid())

    def test_serializer_invalid_data(self):
        data = {'name': 'sk'}
        serializer = CharacterSerializer(data=data)
        self.assertFalse(serializer.is_valid())
        self.assertIn('name', serializer.errors)
