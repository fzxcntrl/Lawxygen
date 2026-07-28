# Legal Tech Co-Counsel

A full-stack monorepo for a "mini legal-tech co-counsel" application built within a tight 24-hour deadline. This app provides legal professionals with AI-assisted document drafting and a grounded Semantic Search (RAG) over a local corpus of legal sections and judgments.

## What's Implemented vs Skipped

**Implemented:**
- **Full-stack Monorepo**: Next.js 14 (App Router) frontend and FastAPI backend.
- **Authentication**: JWT-based stateless authentication with password hashing using bcrypt.
- **Drafting Module**: Generates legal documents by calling the Groq API (Llama 3) based on user prompts. Saves drafts to an SQLite database.
- **RAG Search Engine**: Ingests legal documents, creates embeddings using `sentence-transformers`, and performs vector similarity search.
- **Streaming RAG Endpoint**: A simulated token-by-token streaming response that explicitly includes inline citation markers and a structured JSON block of used sources at the end, preventing hallucination on zero-results.

**Skipped (due to 24h constraint):**
- **Production Database**: Used SQLite instead of a managed PostgreSQL instance for speed of local setup.
- **Live LLM for RAG Endpoint**: The streaming RAG endpoint is currently mocked to demonstrate the streaming behavior and citation grounding logic reliably without complex LLM orchestration in a single day.
- **Advanced Auth Features**: Password resets, email verification, and refresh tokens were omitted.
- **Complex UI State**: Error boundaries and complex loading states were simplified.

---

## Setup Instructions

### Prerequisites
- Node.js (v18+)
- Python 3.11+
- Groq API Key

### Backend Setup
1. Open a terminal and navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Create and activate a virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Create a `.env` file based on `.env.example`:
   ```bash
   cp .env.example .env
   ```
   Add your `GROQ_API_KEY` and a random string for `JWT_SECRET`.
5. Run the vector ingestion script to generate the embeddings:
   ```bash
   python ingest.py
   ```
6. Start the FastAPI server:
   ```bash
   uvicorn main:app --reload
   ```
   The backend will run on `http://localhost:8000`.

*(Note: To run the standalone streaming RAG endpoint specifically, run `uvicorn streaming_rag:app --port 8001`)*

### Frontend Setup
1. Open a new terminal and navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the Next.js development server:
   ```bash
   npm run dev
   ```
4. Open your browser to `http://localhost:3000`.

---

## Architecture Overview

### 1. Authentication
- **Design Decision**: Stateless JWT (JSON Web Tokens) stored in HTTP-only cookies (or local storage).
- **Why**: JWTs are perfect for a fast, stateless API layer like FastAPI. They avoid database lookups for session validation on every request, making the system highly scalable. We use `passlib` with `bcrypt` for secure password hashing.

### 2. Drafting Module
- **Design Decision**: Direct integration with Groq API (Llama 3) with structured prompting.
- **Why**: Groq provides incredibly low latency, which is crucial for a responsive user experience when generating long-form text. Drafts are immediately persisted to the SQLite database via SQLModel.

### 3. RAG Search Engine
- **Design Decision**: Local `sentence-transformers` (all-MiniLM-L6-v2) combined with raw NumPy arrays for vector similarity search (Cosine Similarity).
- **Why**: Instead of relying on a heavy vector database like Pinecone or setting up pgvector, saving embeddings as a local `.npz` file ensures the app works immediately out of the box with zero external infrastructure dependencies. `all-MiniLM-L6-v2` runs efficiently on CPU.

---

## Data Sources

The legal corpus used for the RAG search comprises sections from the Indian Contract Act, 1872, and related court judgments. All data was sourced from [Indian Kanoon](https://indiankanoon.org/). 

Example sources included in the `/data/legal_docs` directory:
- [Section 73 of the Indian Contract Act, 1872](https://indiankanoon.org/doc/135091/)
- [Section 74 of the Indian Contract Act, 1872](https://indiankanoon.org/doc/135092/)
- Selected judgments referencing these acts.

---

## What I'd build next with a week instead of a day

If given a week, I would replace the mocked streaming RAG with a live LLM integration (e.g. Langchain) capable of accurately citing sources. I would upgrade the simple paragraph chunking to semantic chunking with overlap for better retrieval context. The drafting module would be converted to stream its generation so the user isn't waiting on a single heavy request. For production readiness, I'd implement proper auth hardening (refresh tokens, rate limiting), add full unit and integration test coverage, and build a feature to cleanly export generated drafts to PDF. Finally, I would expand the corpus to include a second domain of law (e.g. property law).
