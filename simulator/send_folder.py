import csv
import requests
import os
from datetime import datetime, timezone

API_URL = "http://127.0.0.1:8000/api/auth/api/simulator/transactions/"

def send_row(row):
    txn = {
        "transaction_id": row.get("transaction_id"),
        "amount": float(row.get("amount", 0)),
        "currency": row.get("currency", "USD"),
        "sender": row.get("sender"),
        "receiver": row.get("receiver"),
        "timestamp": row.get("timestamp", datetime.now(timezone.utc).isoformat()),
        "description": row.get("description", "CSV transaction"),
    }
    try:
        r = requests.post(API_URL, json=txn, timeout=5)
        try:
            resp = r.json()
        except Exception:
            resp = r.text
        print(f"Sent {txn['transaction_id']} -> Status: {r.status_code}, Response: {resp}")
    except Exception as e:
        print(f"Error sending {txn['transaction_id']}: {e}")

def process_folder(folder):
    for fname in os.listdir(folder):
        if not fname.lower().endswith(".csv"):
            continue
        path = os.path.join(folder, fname)
        print(f"Processing {path}")
        with open(path, newline="") as fh:
            reader = csv.DictReader(fh)
            for row in reader:
                send_row(row)
        os.rename(path, path + ".processed")

if __name__ == "__main__":
    folder = input("Enter CSV folder path: ")
    process_folder(folder)
