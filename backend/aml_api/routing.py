from django.urls import re_path
from . import consumers

websocket_urlpatterns = [
    re_path(r'ws/aml/transactions/$', consumers.TransactionConsumer.as_asgi()),
]
