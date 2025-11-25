from app.utils.email import send_match_email
from datetime import date

def test_sending_emails():
    print("📧 Starting Email Test...")

    # Mock Party Data
    mock_party = {
        "name": "Test Winter Wonderland",
        "event_date": date.today(),
        "event_time": "18:00:00",
        "budget": 50,
        "currency": "USD",
        "description": "This is a test party to verify email functionality."
    }

    # Test Case 1: Dhruv
    recipient_1 = {
        "name": "Dhruv Malpani",
        "email": "dhruv.malpani2005@gmail.com"
    }
    match_1_name = "Wasif Umair"
    
    print(f"Attempting to send to {recipient_1['email']}...")
    success = send_match_email(recipient_1, match_1_name, mock_party)
    print(f"Result: {'✅ Sent' if success else '❌ Failed'}")

    # Test Case 2: Wasif
    recipient_2 = {
        "name": "Wasif Umair",
        "email": "wasifumair2005@gmail.com"
    }
    match_2_name = "Dhruv Malpani"

    print(f"Attempting to send to {recipient_2['email']}...")
    success = send_match_email(recipient_2, match_2_name, mock_party)
    print(f"Result: {'✅ Sent' if success else '❌ Failed'}")

if __name__ == "__main__":
    test_sending_emails()

