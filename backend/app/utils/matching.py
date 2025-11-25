import random

def generate_derangement(participants):
    """
    participants: List of dicts with at least {"id": ...}

    Returns:
        List of dicts like:
        {"giver_id": X, "receiver_id": Y}
    """
    ids = [p["id"] for p in participants]
    deranged = ids.copy()

    # Keep shuffling until no one is matched to themselves
    while True:
        random.shuffle(deranged)
        if all(g != r for g, r in zip(ids, deranged)):
            break

    # Pair giver → receiver
    return [
        {"giver_id": giver, "receiver_id": receiver}
        for giver, receiver in zip(ids, deranged)
    ]