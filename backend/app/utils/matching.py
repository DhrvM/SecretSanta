import random
from typing import List, Dict, Any

def generate_matches(participants: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    """
    Takes a list of participants (must have 'id').
    Returns a list of update dictionaries: [{'id': giver_id, 'giftee_id': receiver_id}]
    Ensures no one is assigned themselves.
    """
    if len(participants) < 2:
        raise ValueError("Need at least 2 participants to generate matches.")

    ids = [p['id'] for p in participants]
    givers = ids[:]
    receivers = ids[:]
    
    # Simple derangement shuffle
    # We shuffle receivers until no index matches the giver at that index
    while True:
        random.shuffle(receivers)
        if all(g != r for g, r in zip(givers, receivers)):
            break
            
    updates = []
    for giver_id, receiver_id in zip(givers, receivers):
        updates.append({
            "id": giver_id,
            "giftee_id": receiver_id
        })
        
    return updates
