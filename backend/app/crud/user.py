from typing import Optional
from motor.motor_asyncio import AsyncIOMotorCollection
from app.schemas.user import UserCreate, UserLogin
from app.utils.security import hash_password, verify_password


async def create_user(collection: AsyncIOMotorCollection, user: UserCreate) -> Optional[str]:
    """Creates an usuario en la base de datos."""
    existing_user = await collection.find_one({"email": user.email})
    if existing_user:
        return None

    new_user = user.model_dump()
    new_user["hashed_password"] = hash_password(new_user.pop("password"))

    result = await collection.insert_one(new_user)
    # Retorna el ID del usuario creado
    return str(result.inserted_id)  


async def login(collection: AsyncIOMotorCollection, user: UserLogin) -> Optional[str]:
    """Comprueba el email y la contraseña introducidos."""
    existing_user = await collection.find_one({"email": user.email})
    if not existing_user:
        return None

    if user and verify_password(user.password, existing_user["hashed_password"]):
        return str(existing_user["_id"])
