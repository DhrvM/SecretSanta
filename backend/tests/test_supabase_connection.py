import uuid
from app.db.supabase import supabase
import pytest

def test_supabase_connection_and_operations():
    """
    Tests connection to Supabase by performing an insert and delete operation
    on the 'parties' table.
    """
    print("\nStarting Supabase Connection Test...")
    
    # Generate unique test data
    test_id = f"TEST{uuid.uuid4().hex[:6].upper()}"
    test_party_data = {
        "id": test_id,
        # "passcode" is omitted - Supabase will auto-generate it (uuid default)
        "name": "Test Party",
        "description": "Integration Test Party",
        "budget": 50,
        "currency": "USD",
        "event_date": "2024-12-25",
        "event_time": "10:00:00+00:00",
        "organizer_name": "Test Organizer",
        "organizer_email": "test@example.com",
        "status": True
    }

    try:
        # 1. Insert Operation
        print(f"Attempting to insert party with id: {test_id}")
        response = supabase.table("parties").insert(test_party_data).execute()
        
        # Verify Insert
        assert len(response.data) > 0, "Insert failed: No data returned"
        inserted_party = response.data[0]
        assert inserted_party["id"] == test_id
        print(f"✅ INSERT Successful (passcode auto-generated: {inserted_party['passcode']})")

        # 2. Delete Operation
        print(f"Attempting to delete party with id: {test_id}")
        response = supabase.table("parties").delete().eq("id", test_id).execute()
        
        # Verify Delete
        assert len(response.data) > 0, "Delete failed: No data returned"
        deleted_party = response.data[0]
        assert deleted_party["id"] == test_id
        print("✅ DELETE Successful")
        
        print("\nPASSED: Supabase connection, insert, and delete operations working correctly.")

    except Exception as e:
        print(f"\nFAILED: An error occurred: {str(e)}")
        # Cleanup attempt in case delete failed
        try:
            supabase.table("parties").delete().eq("id", test_id).execute()
        except:
            pass
        raise e

if __name__ == "__main__":
    try:
        test_supabase_connection_and_operations()
    except:
        exit(1)

