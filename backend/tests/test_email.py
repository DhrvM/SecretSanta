import sys
from pathlib import Path

# Add backend directory to path
sys.path.append(str(Path(__file__).parent.parent))

from app.utils.email import send_match_email, send_host_email

def test_email():
    # Mock data
    host = {"name": "Dhruv", "email": "dhruv.malpani2005@gmail.com"}
    participant = {"name": "Dhruv (Participant)", "email": "dhruv.malpani2005@gmail.com"}
    
    party_details = {
        "name": "Test Christmas Party 2025",
        "event_date": "2025-12-25",
        "event_time": "18:00:00",
        "budget": 50,
        "currency": "USD",
        "description": "This is a test party to verify the email templates."
    }
    
    print("Sending Host Email...")
    send_host_email(host, party_details, "TEST-CODE-123", "https://dhrvm.github.io/SecretSanta/room/test-id")
    
    print("Sending Match Email...")
    send_match_email(participant, "Santa Claus", "santa@northpole.com", party_details)

if __name__ == "__main__":
    test_email()
