from fastapi import APIRouter, HTTPException, status
from app.db.supabase import supabase
from app.schemas.participant import ParticipantJoin, ParticipantPublic, ResendMyMatch
from app.schemas.party import PartyAdminAction
from typing import List

router = APIRouter(prefix="/api/party/{party_id}/participants", tags=["Participants"])


@router.get("", response_model=List[ParticipantPublic])
def list_participants(party_id: str):
    """List all participants in a party (names only)."""
    
    # Verify party exists
    party_response = supabase.table("parties").select("id").eq("id", party_id).execute()
    if not party_response.data:
        raise HTTPException(status_code=404, detail="Party not found")
    
    response = supabase.table("participants").select("id, name").eq("party_id", party_id).execute()
    
    return response.data


@router.post("", response_model=ParticipantPublic, status_code=status.HTTP_201_CREATED)
def join_party(party_id: str, participant: ParticipantJoin):
    """Join a party as a new participant."""
    
    # Verify party exists and is open
    party_response = supabase.table("parties").select("status").eq("id", party_id).execute()
    
    if not party_response.data:
        raise HTTPException(status_code=404, detail="Party not found")
    
    if not party_response.data[0]["status"]:  # Party is locked
        raise HTTPException(status_code=400, detail="Party is locked. No new participants allowed.")
    
    # Check if email already registered
    existing = supabase.table("participants").select("id").eq("party_id", party_id).eq("email", participant.email).execute()
    if existing.data:
        raise HTTPException(status_code=400, detail="This email is already registered for this party.")
    
    # Insert participant
    participant_data = {
        "party_id": party_id,
        "name": participant.name,
        "email": participant.email,
    }
    
    response = supabase.table("participants").insert(participant_data).execute()
    
    if not response.data:
        raise HTTPException(status_code=500, detail="Failed to join party")
    
    return response.data[0]


@router.delete("/{participant_id}", status_code=status.HTTP_204_NO_CONTENT)
def remove_participant(party_id: str, participant_id: str, auth: PartyAdminAction):
    """Remove a participant from the party. Requires master passcode."""
    
    # Verify passcode
    party_response = supabase.table("parties").select("passcode, status").eq("id", party_id).execute()
    
    if not party_response.data:
        raise HTTPException(status_code=404, detail="Party not found")
    
    if party_response.data[0]["passcode"] != auth.passcode:
        raise HTTPException(status_code=403, detail="Invalid passcode")
    
    if not party_response.data[0]["status"]:  # Party is locked
        raise HTTPException(status_code=400, detail="Cannot remove participants from a locked party.")
    
    # Delete participant
    response = supabase.table("participants").delete().eq("id", participant_id).eq("party_id", party_id).execute()
    
    if not response.data:
        raise HTTPException(status_code=404, detail="Participant not found")
    
    return None


@router.post("/resend-mine")
def resend_my_match(party_id: str, request: ResendMyMatch):
    """Resend match email to a specific participant by their email."""
    
    # Verify party is locked
    party_response = supabase.table("parties").select("*").eq("id", party_id).execute()
    
    if not party_response.data:
        raise HTTPException(status_code=404, detail="Party not found")
    
    if party_response.data[0]["status"]:  # Party is still open
        raise HTTPException(status_code=400, detail="Matching has not started yet.")
    
    # Find participant
    participant_response = supabase.table("participants").select("*").eq("party_id", party_id).eq("email", request.email).execute()
    
    if not participant_response.data:
        raise HTTPException(status_code=404, detail="Email not found in this party.")
    
    # TODO: Resend email via utils/email.py
    
    return {"message": "Match email has been resent."}

