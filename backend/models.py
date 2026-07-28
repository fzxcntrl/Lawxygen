from datetime import datetime
from typing import Optional
from sqlmodel import Field, SQLModel
from pydantic import BaseModel, EmailStr

class UserBase(SQLModel):
    email: str = Field(unique=True, index=True)

class User(UserBase, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    hashed_password: str
    created_at: datetime = Field(default_factory=datetime.utcnow)

class UserCreate(UserBase):
    password: str

class UserRead(UserBase):
    id: int
    created_at: datetime

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: Optional[str] = None

class Draft(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: int = Field(foreign_key="user.id")
    document_type: str
    input_fields_json: str
    generated_text: str
    created_at: datetime = Field(default_factory=datetime.utcnow)

class LegalNoticeRequest(BaseModel):
    sender_details: str
    recipient_details: str
    subject: str
    facts: str
    relief_sought: str
    deadline: str

class DraftRead(BaseModel):
    id: int
    document_type: str
    input_fields_json: str
    generated_text: str
    created_at: datetime
