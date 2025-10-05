from rest_framework import generics, permissions, status, viewsets
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.authtoken.models import Token
from django.contrib.auth import authenticate, login
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from .serializers import RegisterSerializer, UserSerializer, LoginSerializer, RuleConfigurationSerializer, TransactionSerializer
from .models import Transaction, RuleConfiguration
from django.http import HttpResponse
import csv
from datetime import datetime
from rest_framework.permissions import AllowAny

class RegisterAPI(generics.GenericAPIView):
    serializer_class = RegisterSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        token, created = Token.objects.get_or_create(user=user)
        return Response({
            "user": UserSerializer(user, context=self.get_serializer_context()).data,
            "token": token.key
        })

@method_decorator(csrf_exempt, name='dispatch')
class LoginAPI(APIView):
    permission_classes = [permissions.AllowAny]
    serializer_class = LoginSerializer

    def post(self, request, *args, **kwargs):
        print("\nReceived login request:", request.data)
        serializer = LoginSerializer(data=request.data)
        print(f"Serializer initialized. Is valid: {serializer.is_valid()}")
        print(f"Serializer errors: {serializer.errors}")

        if not serializer.is_valid():
            print("Login Serializer Errors (from .is_valid()):")
            print(serializer.errors)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        username = serializer.validated_data['username']
        password = serializer.validated_data['password']
        user = authenticate(request, username=username, password=password)

        if user is not None:
            login(request, user)
            token, created = Token.objects.get_or_create(user=user)
            return Response({
                "user": UserSerializer(user).data,
                "token": token.key
            })
        else:
            print("Authentication failed: Invalid credentials for user", username)
            return Response({"error": "Invalid Credentials"}, status=status.HTTP_400_BAD_REQUEST)

class UserAPI(generics.RetrieveAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = UserSerializer

    def get_object(self):
        return self.request.user


class TransactionListCreateAPI(generics.ListCreateAPIView):
    queryset = Transaction.objects.all().order_by('-date', '-id')
    serializer_class = TransactionSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        transaction = serializer.save()
        
        # Only run AML if simulator didn't provide flags/status
        if not transaction.flags:
            transaction.perform_aml_analysis()
        else:
            transaction.save()

    def delete(self, request, *args, **kwargs):
        # Delete all transactions
        Transaction.objects.all().delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

    def get_queryset(self):
        last_id = self.request.query_params.get('last_id')
        if last_id:
            return Transaction.objects.filter(id__gt=last_id).order_by('date', 'id')
        return Transaction.objects.all().order_by('-date', '-id')
    


class TransactionRetrieveUpdateDestroyAPI(generics.RetrieveUpdateDestroyAPIView):
    queryset = Transaction.objects.all()
    serializer_class = TransactionSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_update(self, serializer):
        transaction = serializer.save()
        transaction.perform_aml_analysis()


class ExportAllTransactionsCSV(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, *args, **kwargs):
        transactions = Transaction.objects.all()
        serializer = TransactionSerializer(transactions, many=True)
        
        # Prepare CSV response
        response = HttpResponse(content_type='text/csv')
        response['Content-Disposition'] = 'attachment; filename="all_transactions_analysis.csv"'

        writer = csv.writer(response)
        writer.writerow(['Transaction ID', 'Date', 'From Account', 'To Account', 'Amount', 'Description', 'Risk Score', 'Status', 'Flags'])

        for transaction_data in serializer.data:
            writer.writerow([
                transaction_data['id'],
                transaction_data['date'],
                transaction_data['from_account'],
                transaction_data['to_account'],
                transaction_data['amount'],
                transaction_data['description'],
                transaction_data['risk_score'],
                transaction_data['status'],
                '; '.join(transaction_data['flags']),
            ])
        return response

@method_decorator(csrf_exempt, name='dispatch')
class SimulatorTransactionAPI(APIView):
    permission_classes = [AllowAny]
    """
    Endpoint for the simulator to POST transactions.
    """

    def post(self, request, *args, **kwargs):
        data = request.data

        # Required fields
        required_fields = ['transaction_id', 'amount', 'currency', 'sender', 'receiver']
        missing = [f for f in required_fields if f not in data]
        if missing:
            return Response({"error": f"Missing required fields: {missing}"}, status=400)

        # Prepare timestamp
        ts = data.get('timestamp')
        if ts:
            try:
                ts = datetime.fromisoformat(ts)
            except Exception:
                ts = datetime.utcnow()
        else:
            ts = datetime.utcnow()

        # Create Transaction instance
        txn = Transaction(
            id=data['transaction_id'],
            date=ts.date(),
            from_account=data['sender'],
            to_account=data['receiver'],
            amount=float(data['amount']),
            description=data.get('description', ''),
            risk_score=0.0,
            flags=[],
            status='normal'
        )
        txn.save()

        # Run your existing AML analysis
        txn.perform_aml_analysis()
        txn.save()

        return Response({
            "transaction_id": txn.id,
            "status": txn.status,
            "alerts": txn.flags
        }, status=201)

class RuleConfigurationViewSet(viewsets.ModelViewSet):
    queryset = RuleConfiguration.objects.all()
    serializer_class = RuleConfigurationSerializer

class TransactionViewSet(viewsets.ModelViewSet):
    queryset = Transaction.objects.all()
    serializer_class = TransactionSerializer
