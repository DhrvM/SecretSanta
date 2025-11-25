# Secret Santa API - Backend

A FastAPI backend for the Secret Santa web application. This API handles party creation, participant management, matching, and email notifications.

## Tech Stack

- **Framework:** FastAPI (Python)
- **Database:** Supabase (PostgreSQL)
- **Email:** TBD (Nodemailer/Resend)

## Project Structure

```
backend/
├── app/
│   ├── __init__.py
│   ├── main.py              # FastAPI application entry point
│   ├── core/
│   │   └── config.py        # Environment configuration
│   ├── api/
│   │   └── routes/
│   │       ├── party.py     # Party endpoints
│   │       └── participant.py # Participant endpoints
│   ├── db/
│   │   └── supabase.py      # Supabase client
│   ├── schemas/
│   │   ├── party.py         # Pydantic models for Party
│   │   └── participant.py   # Pydantic models for Participant
│   └── utils/
│       ├── matching.py      # Secret Santa matching algorithm (TODO)
│       └── email.py         # Email sending service (TODO)
├── tests/
│   └── test_supabase_connection.py
├── requirements.txt
├── .env                     # Environment variables (not in git)
└── README.md
```

## Setup

### 1. Create Virtual Environment

```bash
cd backend
python -m venv env

# Windows
.\env\Scripts\activate

# macOS/Linux
source env/bin/activate
```

### 2. Install Dependencies

```bash
pip install -r requirements.txt
```

### 3. Configure Environment Variables

Create a `.env` file in the `backend/` directory:

```env
SUPABASE_URL="https://your-project.supabase.co"
SUPABASE_KEY="your-supabase-service-role-key"
EMAIL_SENDER="your-email@gmail.com"
EMAIL_PASSWORD="your-app-password"
SECRET_KEY="your-secret-key"
```

### 4. Run the Server

```bash
uvicorn app.main:app --reload
```

The API will be available at `http://127.0.0.1:8000`

## API Documentation

Once the server is running, visit:

- **Swagger UI:** http://127.0.0.1:8000/docs
- **ReDoc:** http://127.0.0.1:8000/redoc

## API Endpoints

### Party Routes (`/api/party`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/party` | Create a new party |
| `GET` | `/api/party/{id}` | Get party details |
| `DELETE` | `/api/party/{id}` | Delete a party (requires passcode) |
| `POST` | `/api/party/{id}/lock` | Start matching & lock party (requires passcode) |
| `POST` | `/api/party/{id}/resend` | Resend all emails (requires passcode) |

### Participant Routes (`/api/party/{id}/participants`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/party/{id}/participants` | List all participants |
| `POST` | `/api/party/{id}/participants` | Join a party |
| `DELETE` | `/api/party/{id}/participants/{pid}` | Remove participant (requires passcode) |
| `POST` | `/api/party/{id}/participants/resend-mine` | Resend match email |

## Database Schema

### `parties` Table

| Column | Type | Description |
|--------|------|-------------|
| `id` | text (PK) | 6-character party code |
| `passcode` | uuid | Auto-generated admin passcode |
| `name` | text | Party name |
| `description` | text | Party description |
| `budget` | int4 | Gift budget amount |
| `currency` | text | Currency code (USD, EUR, etc.) |
| `event_date` | date | Event date |
| `event_time` | timetz | Event time |
| `organizer_name` | text | Organizer's name |
| `organizer_email` | text | Organizer's email |
| `status` | bool | `true` = OPEN, `false` = LOCKED |
| `created_time` | timestamp | Creation timestamp |

### `participants` Table

| Column | Type | Description |
|--------|------|-------------|
| `id` | uuid (PK) | Auto-generated ID |
| `party_id` | text (FK) | Reference to party |
| `name` | text | Participant name |
| `email` | text | Participant email |
| `giftee_id` | uuid (FK) | ID of assigned giftee (after matching) |
| `created_at` | timestamp | Join timestamp |

## Running Tests

```bash
# From the backend directory
python -m tests.test_supabase_connection
```

## TODO

- [ ] Implement matching algorithm (`utils/matching.py`)
- [ ] Implement email service (`utils/email.py`)
- [ ] Add input validation for party codes
- [ ] Add rate limiting
- [ ] Add comprehensive test suite

