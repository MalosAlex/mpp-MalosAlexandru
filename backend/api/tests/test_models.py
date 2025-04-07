from django.test import TestCase
from django.core.exceptions import ValidationError
from django.db import IntegrityError
from api.models import Character

class CharacterModelTest(TestCase):
    
    def test_character_creation(self):
        character = Character.objects.create(
            name='John Doe',
            mediaOfOrigin='Movie',
            age=30,
            typeOfMedia='Film',
            typeOfCharacter='Hero',
            backstory='An orphan raised by wolves.',
            image='images/john_doe.jpg'
        )
        self.assertEqual(character.name, 'John Doe')
        self.assertEqual(character.age, 30)
        self.assertEqual(character.backstory, 'An orphan raised by wolves.')
    
    def test_unique_name(self):
        Character.objects.create(
            name='John Doe',
            mediaOfOrigin='Movie',
            age=30,
            typeOfMedia='Film',
            typeOfCharacter='Hero',
            backstory='An orphan raised by wolves.',
            image='images/john_doe.jpg'
        )
        with self.assertRaises(IntegrityError):
            Character.objects.create(
                name='John Doe',  # Duplicate name
                mediaOfOrigin='TV Show',
                age=25,
                typeOfMedia='TV',
                typeOfCharacter='Villain',
                backstory='Was once a hero.',
                image='images/john_doe2.jpg'
            )

    def test_str_method(self):
        character = Character(name="Jane Doe")
        self.assertEqual(str(character), "Jane Doe")

    def test_default_backstory(self):
        character = Character.objects.create(
            name='Alex',
            mediaOfOrigin='Book',
            age=25,
            typeOfMedia='Literature',
            typeOfCharacter='Anti-Hero',
            image='images/alex.jpg'
        )
        self.assertEqual(character.backstory, "No backstory provided")
