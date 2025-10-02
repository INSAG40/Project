# simulator/sim.py
import requests
import random
from datetime import datetime, timedelta
import time

# Your backend simulator URL
URL = "http://127.0.0.1:8000/api/auth/api/simulator/transactions/"

# Number of transactions to generate
NUM_TRANSACTIONS = 50

# Helper function to generate random account IDs
def random_account(prefix="ACC"):
    return f"{prefix}-{random.randint(1000, 1999)}"

# Helper function to generate random transaction IDs
def random_txn_id():
    return f"TXN-{random.randint(1,999)}-{int(datetime.utcnow().timestamp()*1000)}"

# Helper function to generate random dates
def random_date(start_year=2024, end_year=2025):
    start = datetime(start_year, 1, 1)
    end = datetime(end_year, 12, 31)
    return start + (end - start) * random.random()

# High-risk keywords for description
DESCRIPTIONS = [
    "Regular payment", "Invoice", "Loan", "Cash transfer", 
    "Offshore transfer", "Salary", "Refund"
]

for i in range(NUM_TRANSACTIONS):
    amount = round(random.uniform(100, 60000), 2)

    # Decide status probability
    if amount > 50000:
        status = 'flagged'
    elif amount > 20000:
        status = random.choice(['normal', 'suspicious'])
    else:
        status = 'normal'

    txn_data = {
        "transaction_id": random_txn_id(),
        "amount": amount,
        "currency": "USD",
        "sender": random_account("ACC"),
        "receiver": random_account("ACC"),
        "description": random.choice(DESCRIPTIONS),
        "timestamp": random_date().isoformat()
    }

    try:
        response = requests.post(URL, json=txn_data)
        print(f"Sent {txn_data['transaction_id']} -> Amount: ${amount}, "
              f"Status: {status}, Response: {response.json()}")
    except Exception as e:
        print(f"Send error: {e}")

    # Optional: small delay between requests
    time.sleep(0.2)
