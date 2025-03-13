from typing import List, Optional
from pydantic import BaseModel, field_validator
from datetime import datetime


class Medication(BaseModel):
    user_id: Optional[str] = None
    name: str
    cantidad: int
    moments: List[bool]
    inicio: datetime = datetime.now()
    duration_days: int = 1

    @field_validator("inicio", mode="before")
    def parse_inicio(cls, value):
        if isinstance(value, str):
            # Convertir el string ISO a datetime
            return datetime.fromisoformat(value.replace("Z", "+00:00"))
        return value
