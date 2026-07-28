# Legal Tech Co-Counsel

This is a monorepo for a mini legal-tech co-counsel web application.

## Structure
- `/frontend` - Next.js 14 (App Router) + TypeScript + Tailwind CSS
- `/backend` - FastAPI + SQLModel + SQLite

## Getting Started

### Backend
1. `cd backend`
2. `python -m venv venv`
3. `source venv/bin/activate` (or `venv\Scripts\activate` on Windows)
4. `pip install -r requirements.txt`
5. Copy `.env.example` to `.env` and fill in your keys.
6. `uvicorn main:app --reload` (Runs on http://localhost:8000)

### Frontend
1. `cd frontend`
2. `npm install`
3. Copy `.env.example` to `.env.local`
4. `npm run dev` (Runs on http://localhost:3000)
