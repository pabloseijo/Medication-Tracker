from typing import Optional
from pydantic import BaseModel, EmailStr

class UserCreate(BaseModel):
    id: Optional[str]
    name: str
    surname: str
    password: str
    email: EmailStr
    age: float
    height: float
    weight: float
    diabetes: bool
    hypertension: bool

class UserLogin(BaseModel):
    email: EmailStr
    password: str


