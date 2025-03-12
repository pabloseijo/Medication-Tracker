from typing import Optional
from motor.motor_asyncio import AsyncIOMotorCollection
from app.schemas.meds import SporadicMedicationCreate


async def add_sporadic_medication(
    collection: AsyncIOMotorCollection, medication: SporadicMedicationCreate
) -> Optional[str]:
    """Creates an usuario en la base de datos."""
    mock_user = await collection.find_one({"email": "mock@example.com"})
    if not mock_user:
        return None

    medication.user_id = mock_user["_id"]

    result = await collection.insert_one(medication.model_dump())

    return str(result.inserted_id)
