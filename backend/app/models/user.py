from pydantic import BaseModel, EmailStr

class User(BaseModel):
    full_name: str 
    email: EmailStr
    hashed_password: str  
    age: int
    height: float
    weight: float
    diabetes: bool
    hypertension: bool
    
