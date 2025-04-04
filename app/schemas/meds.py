from typing import List, Optional
from pydantic import BaseModel
from datetime import datetime

class Medication(BaseModel):
    user_id: Optional[str] = None
    name:str
    cantidad: int
    moments: List[bool]
    inicio: datetime = datetime.now()
    duration_days: int = 1

