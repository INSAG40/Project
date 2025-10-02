from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.authtoken.models import Token
from django.contrib.auth import authenticate, login
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from .serializers import RegisterSerializer, UserSerializer, LoginSerializer
from .models import Transaction
from .serializers import TransactionSerializer
from django.http import HttpResponse
from django.conf import settings
import requests
from collections import deque
from datetime import datetime, timezone
import csv

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
    queryset = Transaction.objects.all()
    serializer_class = TransactionSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        if not serializer.is_valid(raise_exception=True):
            print("Transaction Serializer Errors:", serializer.errors)
        transaction = serializer.save()
        transaction.perform_aml_analysis()

    def delete(self, request, *args, **kwargs):
        # Delete all transactions
        Transaction.objects.all().delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


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


class PingAPI(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        return Response({
            "status": "ok",
            "auth": True,
            "base": "/api/auth/",
            "marble_base_url": getattr(settings, 'MARBLE_BASE_URL', None)
        })


class MarbleRulesProxyAPI(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        base = settings.MARBLE_BASE_URL.rstrip('/')
        try:
            res = requests.get(f"{base}/rules")
            return Response(res.json(), status=res.status_code)
        except Exception as e:
            return Response({"error": str(e)}, status=500)


class MarbleScoreProxyAPI(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        base = settings.MARBLE_BASE_URL.rstrip('/')
        try:
            res = requests.post(f"{base}/score", json=request.data)
            return Response(res.json(), status=res.status_code)
        except Exception as e:
            return Response({"error": str(e)}, status=500)


class MarbleEventsAPI(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        try:
            # Try proxying to Marble; if it fails or returns empty, fallback to in-memory recent events buffer
            base = settings.MARBLE_BASE_URL.rstrip('/')
            limit = int(request.query_params.get('limit', 50))
            since = request.query_params.get('since')  # ISO timestamp
            # Attempt Marble proxy
            try:
                query = f"limit={limit}"
                if since:
                    query += f"&since={since}"
                res = requests.get(f"{base}/events?{query}", timeout=5)
                if res.ok and res.headers.get('content-type', '').startswith('application/json'):
                    data = res.json()
                    events = data if isinstance(data, list) else data.get('events', [])
                    if events:
                        return Response({"events": events}, status=200)
            except Exception as e:
                print('Marble proxy error:', e)

            # Fallback to in-memory
            events = list(RECENT_EVENTS)
            # Filter by since
            if since:
                try:
                    since_dt = datetime.fromisoformat(since.replace('Z', '+00:00'))
                    events = [e for e in events if _parse_iso(e.get('timestamp')) >= since_dt]
                except Exception as e:
                    print('Since parsing error:', e)
            return Response({"events": events[-limit:]}, status=200)
        except Exception as e:
            print('Events endpoint unexpected error:', e)
            return Response({"events": []}, status=200)


# In-memory recent events buffer for demo fallback
RECENT_EVENTS: deque = deque(maxlen=200)

def _iso_now() -> str:
    return datetime.now(timezone.utc).isoformat()

def _parse_iso(s: str | None) -> datetime:
    if not s:
        return datetime.min.replace(tzinfo=timezone.utc)
    try:
        return datetime.fromisoformat(s.replace('Z', '+00:00'))
    except Exception:
        return datetime.min.replace(tzinfo=timezone.utc)


class MarbleDemoGenerateEventAPI(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        try:
            # Generate a demo scored transaction event and store in-memory
            body = request.data or {}
            raw_score = body.get('score', 0.5)
            try:
                score = float(raw_score)
            except Exception:
                score = 0.5
            amount = body.get('amount', 1234.56)
            try:
                amount = float(amount)
            except Exception:
                amount = 1234.56
            ev = {
                "id": body.get('id') or f"demo-{int(datetime.now().timestamp()*1000)}",
                "type": body.get('type', 'transaction_scored'),
                "timestamp": _iso_now(),
                "payload": {
                    "transactionId": body.get('transactionId', f"txn-{int(datetime.now().timestamp())}"),
                    "amount": amount,
                    "currency": body.get('currency', 'USD'),
                    "from": body.get('from', 'ACC-001234'),
                    "to": body.get('to', 'ACC-009876'),
                    "score": score,
                    "risk": 'high' if score >= 0.8 else ('medium' if score >= 0.5 else 'low'),
                },
            }
            RECENT_EVENTS.append(ev)
            return Response(ev, status=201)
        except Exception as e:
            print('demo-generate error:', e)
            return Response({"error": str(e)}, status=500)

    def delete(self, request):
        try:
            RECENT_EVENTS.clear()
            return Response(status=204)
        except Exception as e:
            print('demo-clear error:', e)
            return Response({"error": str(e)}, status=500)
