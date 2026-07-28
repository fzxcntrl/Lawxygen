import os
import json
from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session, select
from groq import Groq, APIError, RateLimitError
import logging

from database import get_session
from auth import get_current_user
from models import User, Draft, LegalNoticeRequest, DraftRead

router = APIRouter(prefix="/drafts", tags=["drafts"])
logger = logging.getLogger(__name__)

# Initialize Groq client
try:
    groq_client = Groq(api_key=os.getenv("GROQ_API_KEY"))
except Exception as e:
    groq_client = None
    logger.error(f"Failed to initialize Groq client: {e}")

GROQ_MODEL = os.getenv("GROQ_MODEL", "llama3-70b-8192")

@router.post("/generate", response_model=DraftRead)
def generate_draft(
    request: LegalNoticeRequest,
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session)
):
    if not groq_client:
        raise HTTPException(status_code=500, detail="Groq API client is not configured.")

    prompt = f"""
You are an expert Indian lawyer. Draft a formal Legal Notice based on the following details.
The legal notice must be drafted strictly in accordance with Indian legal formatting and standards.
Do not include any placeholders that cannot be deduced from the provided information.

Sender Details: {request.sender_details}
Recipient Details: {request.recipient_details}
Subject: {request.subject}
Facts of the matter: {request.facts}
Relief Sought: {request.relief_sought}
Deadline to Respond: {request.deadline}

Produce the final legal notice only. Do not add any introductory or concluding remarks of your own.
"""
    try:
        completion = groq_client.chat.completions.create(
            messages=[
                {"role": "system", "content": "You are a professional Indian lawyer drafting a legal notice."},
                {"role": "user", "content": prompt}
            ],
            model=GROQ_MODEL,
            max_tokens=2500,
            temperature=0.2
        )
        
        choice = completion.choices[0]
        generated_text = choice.message.content
        
        # Check if the output was cut off
        if choice.finish_reason == "length":
            generated_text += "\n\n[WARNING: The generation was cut off due to length limits. Please review and complete manually.]"
            
    except RateLimitError:
        raise HTTPException(status_code=429, detail="Groq API rate limit exceeded. Please try again later.")
    except APIError as e:
        logger.error(f"Groq API Error: {e}")
        raise HTTPException(status_code=502, detail="Error communicating with the Groq API.")
    except Exception as e:
        logger.error(f"Unexpected error: {e}")
        raise HTTPException(status_code=500, detail="An unexpected error occurred during generation.")

    # Save to DB
    db_draft = Draft(
        user_id=current_user.id,
        document_type="Legal Notice",
        input_fields_json=json.dumps(request.model_dump()),
        generated_text=generated_text
    )
    session.add(db_draft)
    session.commit()
    session.refresh(db_draft)
    
    return db_draft

@router.get("", response_model=list[DraftRead])
def get_drafts(
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session)
):
    drafts = session.exec(select(Draft).where(Draft.user_id == current_user.id).order_by(Draft.created_at.desc())).all()
    return drafts
