import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

class Settings:
    SUPABASE_URL: str = os.getenv("SUPABASE_URL", "")
    SUPABASE_KEY: str = os.getenv("SUPABASE_KEY", "")
    EMAIL_SENDER: str | None = os.getenv("EMAIL_SENDER")
    EMAIL_PASSWORD: str | None = os.getenv("EMAIL_PASSWORD")
    SECRET_KEY: str | None = os.getenv("SECRET_KEY")

settings = Settings()
