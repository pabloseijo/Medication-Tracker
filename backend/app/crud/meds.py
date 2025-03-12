from typing import Optional
from motor.motor_asyncio import AsyncIOMotorCollection
from app.schemas.meds import Medication
from typing import List, Optional

async def add_sporadic_medication(
    collection: AsyncIOMotorCollection, medication: Medication
) -> Optional[str]:
    """Añade una toma de medicamentos para el usuario asociado."""

    result = await collection.insert_one(medication.model_dump())

    return str(result.inserted_id)


async def add_treatment(
    collection: AsyncIOMotorCollection, treatment: Medication
) -> Optional[str]:
    """Añade un tratamiento para el usuario asoaciado"""

    result = await collection.insert_one(treatment.model_dump())

    return str(result.inserted_id)


async def get_all_treatments(
    collection: AsyncIOMotorCollection, user_id: str
) -> List[dict]:
    """Obtiene todos los tratamientos de un usuario."""
    treatments = []
    async for treatment in collection.find({"user_id": user_id}):
        treatment["_id"] = str(treatment["_id"])  # Convertir ObjectId a string
        treatments.append(treatment)
    return treatments

async def get_all_sporadic_medications(
    collection: AsyncIOMotorCollection, user_id: str
) -> List[dict]:
    """Obtiene todas las medicaciones esporádicas de un usuario."""
    medications = []
    async for medication in collection.find({"user_id": user_id}):
        medication["_id"] = str(medication["_id"])  # Convertir ObjectId a string
        medication["user_id"] = str(medication["user_id"])  # Asegurarse de que user_id también sea str
        medications.append(medication)
    return medications
