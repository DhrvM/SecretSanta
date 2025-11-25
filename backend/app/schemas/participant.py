from pydantic import BaseModel, EmailStr
from typing import Optional
from uuid import UUID


# --- Request Schemas ---

class ParticipantJoin(BaseModel):
    """Schema for joining a party"""
    name: str
    email: EmailStr


class ResendMyMatch(BaseModel):
    """Schema for requesting a resend of your match email"""
    email: EmailStr


class ParticipantUpdate(BaseModel):
    """Schema for updating a participant (admin only)"""
    passcode: str
    new_email: Optional[EmailStr] = None
    new_name: Optional[str] = None


# --- Response Schemas ---

class ParticipantPublic(BaseModel):
    """Public view of a participant (name only)"""
    id: UUID
    name: str


class ParticipantPrivate(BaseModel):
    """Admin view of a participant (includes email)"""
    id: UUID
    name: str
    email: EmailStr
