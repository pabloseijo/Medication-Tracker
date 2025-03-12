from typing import Optional
from motor.motor_asyncio import AsyncIOMotorCollection
from app.schemas.meds import SporadicMedicationCreate, TreatmentCreate


async def add_sporadic_medication(
    collection: AsyncIOMotorCollection, medication: SporadicMedicationCreate
) -> Optional[str]:
    """Añade una toma de medicamentos para el usuario asociado."""

    result = await collection.insert_one(medication.model_dump())

    return str(result.inserted_id)


async def add_treatment(
    collection: AsyncIOMotorCollection, treatment: TreatmentCreate
) -> Optional[str]:
    """Añade un tratamiento para el usuario asoaciado"""

    result = await collection.insert_one(treatment.model_dump())

    return str(result.inserted_id)
