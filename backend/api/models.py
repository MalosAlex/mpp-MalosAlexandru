from django.utils import timezone
from django.db import models

# Create your models here.
class Media(models.Model):
    name = models.CharField(max_length=200)
    typeOfMedia = models.CharField(max_length=200, db_index=True)

    def __str__(self):
        return self.name
    
class User(models.Model):
    username = models.CharField(max_length=200, unique=True)
    password = models.CharField(max_length=200)
    is_admin = models.BooleanField(default=False)

    def __str__(self):
        return self.username

class Character(models.Model):
    name = models.CharField(max_length=100, unique=True)
    age = models.IntegerField(db_index=True)
    typeOfCharacter = models.CharField(max_length=100)
    backstory = models.TextField(default="No backstory provided")
    image = models.CharField(max_length=200)
    media = models.ForeignKey(Media, on_delete=models.CASCADE, related_name='characters', db_index=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE,null=True, blank=True, related_name='characters')


    def __str__(self):
        return self.name
    
class LogTable(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True, related_name='LogTable')
    operation = models.CharField(max_length=200)
    timestamp = models.DateTimeField(default=timezone.now) 
    
    def __str__(self):
        return f"{self.timestamp} - {self.operation}"
    
class MonitoredUsers(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='monitoredUsers')
    timestamp = models.DateTimeField(default=timezone.now) 
    def __str__(self):
        return str(self.user)

class Video(models.Model):
    title = models.CharField(max_length=200)
    file = models.FileField(upload_to='videos/')  # This will store the file in the "media/videos" directory

    def __str__(self):
        return self.title
