from django.db import models

# Create your models here.
class Character(models.Model):
    name = models.CharField(max_length=100, unique=True)
    mediaOfOrigin = models.CharField(max_length=100)
    age = models.IntegerField()
    typeOfMedia = models.CharField(max_length=100)
    typeOfCharacter = models.CharField(max_length=100)
    backstory = models.TextField(default="No backstory provided")
    image = models.CharField(max_length=200)

    def __str__(self):
        return self.name

class Video(models.Model):
    title = models.CharField(max_length=200)
    file = models.FileField(upload_to='videos/')  # This will store the file in the "media/videos" directory

    def __str__(self):
        return self.title