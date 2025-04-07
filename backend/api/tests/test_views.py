from rest_framework.test import APITestCase
from django.urls import reverse
from api.views import mock_characters, Character
from django.core.files.uploadedfile import SimpleUploadedFile
import io
from PIL import Image

class CharacterViewSetTest(APITestCase):
    def setUp(self):
        # Clear and repopulate the mock_characters for each test to avoid test interdependency
        mock_characters.clear()
        mock_characters.extend([
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
        ])
        from api.views import mock_characters as original_mock_characters
        self.character_data = original_mock_characters.copy()

    def test_list_characters(self):
        response = self.client.get("/api/characters/")
        self.assertEqual(response.status_code, 200)
        self.assertGreater(len(response.data), 0)

    def test_filter_by_typeOfMedia(self):
        response = self.client.get("/api/characters/", {'typeOfMedia': 'Video Game'})
        self.assertEqual(response.status_code, 200)
        self.assertTrue(all('Video Game' in c['typeOfMedia'] for c in response.data))

    def test_order_by_age_descending(self):
        response = self.client.get("/api/characters/", {'ordering': 'age', 'order': 'desc'})
        self.assertEqual(response.status_code, 200)
        ages = [c['age'] for c in response.data]
        self.assertEqual(ages, sorted(ages, reverse=True))

    def test_create_character(self):

        def get_mock_image():
            image = Image.new("RGB", (100, 100), color="red")
            img_io = io.BytesIO()
            image.save(img_io, format='PNG')
            img_io.seek(0)
            return SimpleUploadedFile("cloud.png", img_io.read(), content_type="image/png")
    
        new_character = {
            "name": "Aloy",
            "mediaOfOrigin": "Horizon Zero Dawn",
            "age": 19,
            "typeOfMedia": "Video Game",
            "typeOfCharacter": "Protagonist",
            "backstory": "A skilled hunter in a world overrun by robots.",
            "image": get_mock_image()
        }
        response = self.client.post("/api/characters/", data=new_character, format='multipart')
        print(response.data)  # Debug output
        self.assertEqual(response.status_code, 201)

    def test_update_character(self):
        updated_data = {
            "age": 50
        }
        response = self.client.put("/api/characters/Saul Goodman/", data=updated_data, format='json')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data['age'], 50)

    def test_delete_character(self):
        response = self.client.delete("/api/characters/Saul Goodman/")
        self.assertEqual(response.status_code, 204)
        self.assertNotIn("Saul Goodman", [c.name for c in mock_characters])

    