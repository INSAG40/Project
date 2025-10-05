import json
from channels.generic.websocket import AsyncWebsocketConsumer

class TransactionConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        await self.channel_layer.group_add("transactions_group", self.channel_name)
        await self.accept()

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard("transactions_group", self.channel_name)

    async def send_transaction(self, event):
        transaction = event['transaction']
        await self.send(text_data=json.dumps(transaction))
