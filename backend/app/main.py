from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.routes import party, participant

app = FastAPI(title="Secret Santa API")

# Enable CORS so your Frontend can talk to this Backend
origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "https://dhrvm.github.io",  # GitHub Pages deployment
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routers
app.include_router(party.router)
app.include_router(participant.router)


@app.get("/")
def read_root():
    return {"message": "Secret Santa API is running!"}
