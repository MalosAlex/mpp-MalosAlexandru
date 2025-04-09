from channels.generic.websocket import AsyncWebsocketConsumer
import json

class CharacterConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.room_group_name = 'characters_group'

        # Join the group
        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )

        # Accept the WebSocket connection
        await self.accept()

    async def disconnect(self, close_code):
        # Leave the group when the WebSocket is disconnected
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )

    async def receive(self, text_data):
        text_data_json = json.loads(text_data)
        print(text_data_json)  # Handle the message here

        # Optionally send a confirmation message back
        await self.send(text_data=json.dumps({
            'message': 'Message received!'
        }))

    # This method will handle the 'new_character' event
    async def send_character(self, event):
        # The event contains the 'character' key
        character = event['character']  # Extract the character data

        # Send the character data to the WebSocket
        await self.send(text_data=json.dumps({
            'type': 'new_character',  # The type of message being sent
            'character': character,  # The character data
        }))
