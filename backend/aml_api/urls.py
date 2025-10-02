from django.urls import path
from .views import (
    RegisterAPI,
    LoginAPI,
    UserAPI,
    TransactionListCreateAPI,
    TransactionRetrieveUpdateDestroyAPI,
    ExportAllTransactionsCSV,
    MarbleRulesProxyAPI,
    MarbleScoreProxyAPI,
    MarbleEventsAPI,
    PingAPI,
    MarbleDemoGenerateEventAPI,
)

urlpatterns = [
    path('register/', RegisterAPI.as_view(), name='register'),
    path('login/', LoginAPI.as_view(), name='login'),
    path('user/', UserAPI.as_view(), name='user'),
    path('transactions/', TransactionListCreateAPI.as_view(), name='transaction-list-create'),
    path('transactions/<str:pk>/', TransactionRetrieveUpdateDestroyAPI.as_view(), name='transaction-detail'),
    path('export-all-transactions-csv/', ExportAllTransactionsCSV.as_view(), name='export-all-transactions-csv'),
    path('marble/rules/', MarbleRulesProxyAPI.as_view(), name='marble-rules'),
    path('marble/score/', MarbleScoreProxyAPI.as_view(), name='marble-score'),
    path('marble/events/', MarbleEventsAPI.as_view(), name='marble-events'),
    path('marble/demo-generate/', MarbleDemoGenerateEventAPI.as_view(), name='marble-demo-generate'),
    path('marble/clear-demo/', MarbleDemoGenerateEventAPI.as_view(), name='marble-clear-demo'),
    path('ping/', PingAPI.as_view(), name='ping'),
]
