from typing import Optional
from pydantic import BaseModel
from datetime import date, datetime


class SporadicMedicationCreate(BaseModel):
    user_id: Optional[str]
    name: str
    datetime: datetime
    dosage_amount: float
    dosage_unit: str


class TreatmentCreate(BaseModel):
    user_id: Optional[str]
    name: str
    start_date: date
    frequency_amount: int
    frequency_unit: str
    duration_days: int
    dosage_amount: float
    dosage_unit: str
