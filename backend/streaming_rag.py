import asyncio
import json
from fastapi import FastAPI
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from typing import List, Dict

app = FastAPI(title="Streaming RAG Endpoint")

class QueryRequest(BaseModel):
    query: str

def retrieve(query: str) -> List[Dict]:
    """
    Mock retrieve function.
    Returns 3 fake results shaped like {"doc_id": str, "chunk_text": str, "score": float}
    We use a special trigger in the query "zero" to test the zero-results behavior.
    """
    if "zero" in query.lower():
        return []
        
    return [
        {"doc_id": "doc_101", "chunk_text": "The contract is binding if signed by both parties.", "score": 0.95},
        {"doc_id": "doc_202", "chunk_text": "A verbal agreement may be enforceable under specific circumstances.", "score": 0.88},
        {"doc_id": "doc_303", "chunk_text": "Termination requires a 30-day written notice.", "score": 0.75}
    ]

@app.post("/research/query")
async def research_query(request: QueryRequest):
    # 2. Call mocked retrieve function
    docs = retrieve(request.query)
    
    # 5. Zero-results case: 
    # If retrieve() returns zero results, immediately return a clear "no sources found"
    # response and DO NOT attempt generation at all. This prevents hallucination.
    if not docs:
        return {"message": "No sources found. I cannot answer this query without grounded sources."}
        
    async def llm_generator():
        """
        Mock LLM generator that streams words and includes citation markers.
        """
        # 4. Citation-grounding logic:
        # We track which docs are actually "used" in our generated response.
        # In a real RAG system, the LLM is prompted to include inline citations like [doc_id]
        # when it relies on a specific source chunk. Here we mock that behavior.
        used_docs = [docs[0], docs[1]] 
        
        # We mock a generated text that includes inline citations matching the doc_ids.
        # This explicitly fulfills the requirement: "Every claim in the streamed response 
        # must include an inline citation marker referencing a doc_id"
        mock_response_words = [
            "Based", "on", "the", "provided", "documents,", "a", "written", "contract", "is", "binding",
            "if", "signed", "by", "both", "parties.", f"[{used_docs[0]['doc_id']}]", "However,", "it's", "important",
            "to", "note", "that", "verbal", "agreements", "can", "also", "be", "enforceable", "under", "specific",
            "circumstances.", f"[{used_docs[1]['doc_id']}]"
        ]
        
        # 3. Streams the response back token-by-token
        for word in mock_response_words:
            yield word + " "
            await asyncio.sleep(0.1) # Small delay to simulate LLM token generation
            
        # 4. (Continued) After the stream completes, send a final JSON block listing 
        # exactly which source chunks were actually used/cited.
        # We use a separator so the client knows the text stream has ended and structured data begins.
        yield "\n\n---SOURCES---\n"
        yield json.dumps({"cited_sources": used_docs})

    # Return as a StreamingResponse
    return StreamingResponse(llm_generator(), media_type="text/plain")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)
