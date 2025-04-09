from django.urls import path
from .consumers import CharacterConsumer

websocket_urlpatterns = [
    path('ws/characters/', CharacterConsumer.as_asgi()),
]
