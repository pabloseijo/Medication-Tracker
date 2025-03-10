from typing import Optional
from motor.motor_asyncio import AsyncIOMotorCollection
from app.schemas.user import UserCreate


async def create_user(collection: AsyncIOMotorCollection, user: UserCreate) -> Optional[str]:
    """Crea un usuario en la base de datos."""
    existing_user = await collection.find_one({"email": user.email})
    if existing_user:
        return None

    new_user = user.model_dump()
    new_user["hashed_password"] = new_user.pop("password")  # Simulación de hash

    result = await collection.insert_one(new_user)
    # Retorna el ID del usuario creado
    return str(result.inserted_id)  

