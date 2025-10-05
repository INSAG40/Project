# aml/rules_engine.py
from .models import RuleGroup, PeerGroupBaseline, Alert, Transaction
from asgiref.sync import async_to_sync
from channels.layers import get_channel_layer
from datetime import date

ALERT_THRESHOLD = 60

def get_account_tx(account):
    # Replace with real query
    from .models import Transaction
    return Transaction.objects.filter(from_account=account).order_by('-date')

def compute_recent_features(account, transactions):
    features = {}
    last_30 = [t.amount for t in transactions if (date.today() - t.date).days <= 30]
    features['sum_30d'] = sum(last_30)
    features['avg_30d'] = sum(last_30)/len(last_30) if last_30 else 0

    # New counterparty ratio
    seen = set()
    new_counterparties = 0
    for t in transactions[:30]:
        if t.to_account not in seen:
            new_counterparties += 1
            seen.add(t.to_account)
    features['new_counterparty_ratio'] = new_counterparties/30
    return features

def evaluate_transaction(tx: Transaction):
    scores = []
    rule_groups = RuleGroup.objects.filter(enabled=True)

    for rg in rule_groups:
        # Compute features
        features = compute_recent_features(tx.from_account, get_account_tx(tx.from_account))
        # Example: peer baseline
        peer_baseline = PeerGroupBaseline.objects.filter(peer_group='default').last()
        if not peer_baseline:
            peer_baseline = PeerGroupBaseline()  # default empty

        # Rule 1: dev_vs_self_z
        z = (features['sum_30d'] - peer_baseline.sum_30d_mean) / (peer_baseline.sum_30d_std + 1e-6)
        if z > rg.thresholds.get('dev_vs_self_z', 3):
            scores.append(('dev_vs_self', rg.weights.get('dev_vs_self_z', 10), {'z': z}))

        # Rule 2: ratio_vs_peer
        ratio = features['avg_30d'] / (peer_baseline.group_p75_avg + 1e-6)
        if ratio > rg.thresholds.get('ratio_vs_peer',5):
            scores.append(('ratio_vs_peer', rg.weights.get('ratio_vs_peer',25), {'ratio': ratio}))

        # Rule 3: new_counterparty_ratio
        if features['new_counterparty_ratio'] > rg.thresholds.get('new_counterparty_ratio',0.6):
            scores.append(('new_counterparty', rg.weights.get('new_counterparty_ratio',20), {}))

    # Calculate total score
    total_score = sum([s[1] for s in scores])
    if total_score >= ALERT_THRESHOLD:
        tx.status = 'flagged'
    elif total_score >= ALERT_THRESHOLD/2:
        tx.status = 'suspicious'
    else:
        tx.status = 'normal'

    tx.risk_score = total_score
    tx.flags = [s[0] for s in scores]
    tx.save(update_fields=['risk_score','flags','status'])

    # Save alert
    if total_score >= ALERT_THRESHOLD/2:
        Alert.objects.create(transaction=tx, score=total_score, rules_triggered=[s[0] for s in scores],
                             human_readable=f"Triggered rules: {scores}")

    # Broadcast to frontend via WebSocket
    channel_layer = get_channel_layer()
    async_to_sync(channel_layer.group_send)(
        "transactions_group",
        {"type":"send_transaction","transaction":tx_to_dict(tx)}
    )

def tx_to_dict(tx):
    return {
        "id": tx.id,
        "date": str(tx.date),
        "from_account": tx.from_account,
        "to_account": tx.to_account,
        "amount": float(tx.amount),
        "description": tx.description,
        "risk_score": tx.risk_score,
        "status": tx.status,
        "flags": tx.flags
    }
