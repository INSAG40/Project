import csv
import random
from datetime import datetime, timedelta

NUM_TRANSACTIONS = 50  # how many transactions to generate
CSV_FILE = "simulated_transactions.csv"

def generate_transaction(i):
    txn_ts = int(datetime.now().timestamp() * 1000) + i
    txn_id = f"TXN-{i+1:03d}-{txn_ts}"

    from_acc = f"ACC-{1000 + i}"
    to_acc = f"ACC-{2000 + i}"

    # Random amount
    amount = round(random.uniform(500, 60000), 2)

    # Decide risk and status
    if amount >= 50000:
        risk_score = round(random.uniform(6.5, 8.0), 1)
        status = 'flagged'
        flags = 'Large amount transaction'
    elif amount >= 30000:
        risk_score = round(random.uniform(4.0, 5.5), 1)
        status = 'suspicious'
        flags = 'Moderate amount transaction'
    else:
        risk_score = round(random.uniform(0.0, 3.0), 1)
        status = 'normal'
        flags = ''

    # Random date within last 30 days
    date = (datetime.now() - timedelta(days=random.randint(0,30))).date()

    description = "Simulated transaction"

    return [txn_id, date.isoformat(), from_acc, to_acc, f"${amount}", risk_score, status, flags, description]

def main():
    with open(CSV_FILE, mode='w', newline='') as f:
        writer = csv.writer(f)
        writer.writerow(['Transaction ID','Date','From','To','Amount','Risk Score','Status','Flags','Description'])
        for i in range(NUM_TRANSACTIONS):
            writer.writerow(generate_transaction(i))
    print(f"{NUM_TRANSACTIONS} transactions generated in {CSV_FILE}")

if __name__ == "__main__":
    main()
