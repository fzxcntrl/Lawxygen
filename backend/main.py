from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlmodel import SQLModel

from database import engine
from auth import router as auth_router, get_current_user
from drafts import router as drafts_router
from search import router as search_router
from models import User

app = FastAPI(title="Legal Tech Co-Counsel API")

import os

frontend_url = os.getenv("FRONTEND_URL", "http://localhost:3000")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[frontend_url, "http://localhost:3000"], # Support both prod and local
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
def on_startup():
    SQLModel.metadata.create_all(engine)

app.include_router(auth_router)
app.include_router(drafts_router)
app.include_router(search_router)

@app.get("/health")
def health_check():
    return {"status": "ok", "message": "Backend is running!"}

@app.get("/protected")
def protected_route(current_user: User = Depends(get_current_user)):
    return {"message": f"Hello {current_user.email}, this is a protected route."}
