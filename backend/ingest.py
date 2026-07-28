import os
import glob
import json
import numpy as np
from sentence_transformers import SentenceTransformer

def ingest_documents():
    data_dir = os.path.join(os.path.dirname(__file__), "data", "legal_docs")
    files = glob.glob(os.path.join(data_dir, "*.json"))
    
    if not files:
        print("No json files found in data/legal_docs/")
        return

    print(f"Loading embedding model...")
    model = SentenceTransformer("all-MiniLM-L6-v2")
    
    chunks = []
    
    for fpath in files:
        with open(fpath, "r", encoding="utf-8") as f:
            doc = json.load(f)
            
        doc_id = doc["doc_id"]
        title = doc["title"]
        source_url = doc["source_url"]
        full_text = doc["full_text"]
        
        # Simple chunking by paragraph (split by double newline)
        paragraphs = [p.strip() for p in full_text.split("\n\n") if len(p.strip()) > 50]
        
        for i, para in enumerate(paragraphs):
            chunks.append({
                "doc_id": doc_id,
                "title": title,
                "source_url": source_url,
                "chunk_text": para,
                "chunk_id": f"{doc_id}_chunk_{i}"
            })
            
    print(f"Total chunks created: {len(chunks)}")
    
    # Extract text to embed
    texts_to_embed = [c["chunk_text"] for c in chunks]
    
    print("Embedding chunks...")
    embeddings = model.encode(texts_to_embed, show_progress_bar=True)
    
    # Save the index
    out_path = os.path.join(os.path.dirname(__file__), "vector_index.npz")
    np.savez(
        out_path, 
        embeddings=embeddings, 
        chunks=json.dumps(chunks)
    )
    
    print(f"Saved vector index to {out_path}")

if __name__ == "__main__":
    ingest_documents()
