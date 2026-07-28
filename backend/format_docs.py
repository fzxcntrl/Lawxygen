import json
import os

docs = [
    {
        "doc_id": "sec_73",
        "title": "Section 73 of the Indian Contract Act, 1872",
        "source_url": "https://indiankanoon.org/doc/135091/",
        "file": "data/section_73.txt"
    },
    {
        "doc_id": "sec_74",
        "title": "Section 74 of the Indian Contract Act, 1872",
        "source_url": "https://indiankanoon.org/doc/1551717/",
        "file": "data/section_74.txt"
    },
    {
        "doc_id": "sec_75",
        "title": "Section 75 of the Indian Contract Act, 1872",
        "source_url": "https://indiankanoon.org/doc/29517/",
        "file": "data/section_75.txt"
    },
    {
        "doc_id": "judg_maula_bux",
        "title": "Maula Bux vs Union Of India (1969)",
        "source_url": "https://indiankanoon.org/doc/1355470/",
        "file": "data/judgment_maula_bux.txt"
    },
    {
        "doc_id": "judg_kailash_nath",
        "title": "Kailash Nath Associates vs Delhi Development Authority & Anr (2015)",
        "source_url": "https://indiankanoon.org/doc/171589146/",
        "file": "data/judgment_kailash_nath.txt"
    }
]

for doc in docs:
    with open(doc["file"], "r", encoding="utf-8") as f:
        text = f.read()
    
    out = {
        "doc_id": doc["doc_id"],
        "title": doc["title"],
        "source_url": doc["source_url"],
        "full_text": text
    }
    
    out_path = f'data/legal_docs/{doc["doc_id"]}.json'
    with open(out_path, "w", encoding="utf-8") as f:
        json.dump(out, f, indent=2)

print("Created structured JSONs in data/legal_docs/")
