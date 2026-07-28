from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
import numpy as np
import json
import os
import logging
from sentence_transformers import SentenceTransformer

from auth import get_current_user
from models import User

router = APIRouter(prefix="/research", tags=["research"])
logger = logging.getLogger(__name__)

# Global variables to hold our in-memory index
index_data = None
model = None

def load_index():
    global index_data, model
    index_path = os.path.join(os.path.dirname(__file__), "vector_index.npz")
    if os.path.exists(index_path):
        logger.info("Loading vector index...")
        data = np.load(index_path, allow_pickle=True)
        embeddings = data["embeddings"]
        chunks = json.loads(data["chunks"])
        index_data = {"embeddings": embeddings, "chunks": chunks}
        
        logger.info("Loading embedding model...")
        model = SentenceTransformer("all-MiniLM-L6-v2")
        logger.info("Search index ready!")
    else:
        logger.warning(f"Vector index not found at {index_path}. Run ingest.py first.")

# Load the index on module import (which happens during FastAPI startup)
try:
    load_index()
except Exception as e:
    logger.error(f"Failed to load search index: {e}")

class SearchRequest(BaseModel):
    query: str

class SearchResult(BaseModel):
    doc_id: str
    title: str
    source_url: str
    chunk_text: str
    score: float

@router.post("/search", response_model=list[SearchResult])
def search_docs(
    request: SearchRequest,
    current_user: User = Depends(get_current_user)
):
    if not index_data or not model:
        raise HTTPException(status_code=503, detail="Search index is not initialized.")
        
    query = request.query.strip()
    if not query:
        return []
        
    # Embed the query
    query_embedding = model.encode([query])[0]
    
    # Compute cosine similarities
    # cosine similarity = dot(a, b) / (norm(a) * norm(b))
    doc_embeddings = index_data["embeddings"]
    
    # Sentence Transformers output is already normalized or we can just compute it safely
    dot_products = np.dot(doc_embeddings, query_embedding)
    query_norm = np.linalg.norm(query_embedding)
    doc_norms = np.linalg.norm(doc_embeddings, axis=1)
    
    # Prevent division by zero
    norms = query_norm * doc_norms
    norms[norms == 0] = 1e-10
    
    similarities = dot_products / norms
    
    # Get top 5 indices
    top_k = 5
    # np.argsort returns ascending, so we take the last K and reverse
    best_indices = np.argsort(similarities)[-top_k:][::-1]
    
    results = []
    for idx in best_indices:
        chunk = index_data["chunks"][idx]
        score = float(similarities[idx])
        # Filter out very low relevance if desired, but returning top-K is fine
        results.append(SearchResult(
            doc_id=chunk["doc_id"],
            title=chunk["title"],
            source_url=chunk["source_url"],
            chunk_text=chunk["chunk_text"],
            score=score
        ))
        
    return results
