from typing import List
from pydantic import BaseModel, EmailStr


class UserCreate(BaseModel):
    name: str
    surname: str
    password: str
    email: EmailStr
    age: float
    height: float
    weight: float
    diabetes: bool
    hypertension: bool
    isMedic: bool
    patients: List[str] = []  # Lista de IDs de pacientes (vacía por defecto)


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class UserUpdate(BaseModel):
    name: str
    surname: str
    age: float
    height: float
    weight: float
    diabetes: bool
    hypertension: bool
    isMedic: bool
    patients: List[str] = []  # Lista de IDs de pacientes (vacía por defecto)
    

class Token(BaseModel):
    access_token: str
    token_type: str