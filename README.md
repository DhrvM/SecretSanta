# SecretSanta 🎁

Full-stack Secret Santa application: a FastAPI backend that manages parties and participants (with Supabase for data), and a small React frontend to create and join Secret Santa parties.

---

## Table of contents

- [Quick start](#quick-start)
- [Backend (API)](#backend-api)
- [Frontend](#frontend)
- [Running both locally](#running-both-locally)
- [Testing](#testing)
- [Project structure](#project-structure)
- [Environment & configuration](#environment--configuration)
- [Contributing](#contributing)
- [License](#license)

---

## Quick start

Prerequisites:

- Python 3.10+ (for the backend)
- Node 16+/npm (for the frontend)

Clone the repository and open the workspace:

```powershell
git clone https://github.com/DhrvM/SecretSanta.git
cd SecretSanta
```

Continue with the specific backend / frontend sections below.

---

## Backend (API)

The backend is a FastAPI app in `backend/app`. It uses Supabase for the data layer and provides endpoints for parties, participants, matching, and email notifications.

Setup (Windows PowerShell example):

```powershell
# change to backend folder
Set-Location -Path ./backend

# create venv (if you don't already have one)
python -m venv env

# activate the venv for the current PowerShell session
. .\env\Scripts\Activate.ps1

# install dependencies
pip install -r requirements.txt

# run the development server
uvicorn app.main:app --reload
```


#
The backend includes a `README.md` at `backend/README.md` with more details on routes, database schema and env vars.

---

## Frontend

The frontend is a small React app (Vite) in the `frontend/` folder.

Setup and run the frontend:

```powershell
# change to frontend directory
Set-Location -Path ./frontend

# install node dependencies
npm install

# start dev server
npm run dev
```

The Vite dev server runs on a local port (usually 5173) and will proxy or call the backend API directly when configured.

---

## Running both locally

Open two terminals (or use your IDE integrated terminals):

Terminal 1 (backend):

```powershell
Set-Location -Path ./backend
. .\env\Scripts\Activate.ps1
uvicorn app.main:app --reload
```

Terminal 2 (frontend):

```powershell
Set-Location -Path ./frontend
npm run dev
```

Open the frontend in your browser (default Vite port is shown in the terminal) and use the UI to exercise the backend API.

---

## Testing

Basic tests exist in `backend/tests/` for Supabase and email helpers. Example to run tests (from the backend folder):

```powershell
Set-Location -Path ./backend
# run pytest
pytest -q
```

You can run individual tests directly with python as well if needed.

---

## Project structure (high level)

```
.
├── backend/                # FastAPI backend
│   ├── app
│   │   ├── api/routes      # API route definitions
│   │   ├── core            # config & settings
│   │   ├── db              # Supabase client
│   │   ├── schemas         # Pydantic models
│   │   └── utils           # matching & email helpers
│   ├── requirements.txt
│   └── README.md
├── frontend/               # React (Vite) frontend
│   ├── src
│   └── package.json
├── tests/ (root)           # (not used) — main tests live under backend/tests
└── README.md               # <- this file
```

---

## Environment & configuration

Sensitive keys and runtime configuration should be added to a `.env` file (not checked into source). Example variables used by the backend:

```env
SUPABASE_URL="https://your-project.supabase.co"
SUPABASE_KEY="your-supabase-service-role-key"
EMAIL_SENDER="your-email@example.com"
EMAIL_PASSWORD="your-email-password-or-api-key"
SECRET_KEY="some-secret-for-hashing-or-sessions"
```

Refer to `backend/README.md` for full environment variable explanations for the API.

---

## Contributing

Contributions are welcome! Suggested workflow:

1. Fork the repository
2. Create a feature branch
3. Add tests for new behavior
4. Open a pull request with a clear description

Please follow the repository's style and add any new configuration to README and tests.

---

## License

This project is open source — see the `LICENSE` file for details.

---

If anything is missing or you want the README tailored differently (more setup details, CI steps, or deploy instructions), tell me and I’ll update it. ✅