from supabase import create_client, Client
from app.core.config import settings

url: str = settings.SUPABASE_URL
key: str = settings.SUPABASE_KEY

if not url or not key:
    raise ValueError("Supabase URL and Key must be set in environment variables. Please check your .env file.")

supabase: Client = create_client(url, key)
