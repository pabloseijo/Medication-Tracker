from typing import Optional
from pydantic import BaseModel, EmailStr

class UserCreate(BaseModel):
    """Esquema para crear un usuario (sin ID)"""
    id: Optional[str]
    name: str
    surname: str
    email: EmailStr
    age: float
    height: float
    weight: float
    diabetes: bool
    hypertension: bool

