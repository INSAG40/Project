from django.urls import path
from rest_framework.routers import DefaultRouter
from .views import (
    RegisterAPI, LoginAPI, UserAPI,
    ExportAllTransactionsCSV, SimulatorTransactionAPI,
    RuleConfigurationViewSet, TransactionViewSet
)

router = DefaultRouter()
router.register(r'rules', RuleConfigurationViewSet, basename='rules')
router.register(r'transactions', TransactionViewSet, basename='transactions')

urlpatterns = [
    path('register/', RegisterAPI.as_view(), name='register'),
    path('login/', LoginAPI.as_view(), name='login'),
    path('user/', UserAPI.as_view(), name='user'),
    path('export-all-transactions-csv/', ExportAllTransactionsCSV.as_view(), name='export-all-transactions-csv'),
    path('api/simulator/transactions/', SimulatorTransactionAPI.as_view(), name='simulator_transactions'),
] + router.urls
