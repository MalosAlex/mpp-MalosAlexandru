from django.db import models

# Create your models here.
class Character(models.Model):
    name = models.CharField(max_length=100, unique=True)
    mediaOfOrigin = models.CharField(max_length=100)
    age = models.IntegerField()
    typeOfMedia = models.CharField(max_length=100)
    typeOfCharacter = models.CharField(max_length=100)
    backstory = models.TextField(default="No backstory provided")
    image = models.ImageField(upload_to='images/')

    def __str__(self):
        return self.name
