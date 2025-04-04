from typing import Optional
from motor.motor_asyncio import AsyncIOMotorCollection
from app.schemas.user import UserCreate, UserLogin, UserUpdate
from app.utils.security import hash_password, verify_password


async def create_user(
    collection: AsyncIOMotorCollection, user: UserCreate
) -> Optional[str]:
    """Creates an usuario en la base de datos."""
    existing_user = await collection.find_one({"email": user.email})
    if existing_user:
        return None

    new_user = user.model_dump()
    new_user["hashed_password"] = hash_password(new_user.pop("password"))

    result = await collection.insert_one(new_user)
    # Retorna el ID del usuario creado
    return str(result.inserted_id)


async def login_user(
    collection: AsyncIOMotorCollection, user: UserLogin
) -> Optional[str]:
    """Comprueba el email y la contraseña introducidos."""
    existing_user = await collection.find_one({"email": user.email})
    if not existing_user:
        return None

    if user and verify_password(user.password, existing_user["hashed_password"]):
        return str(existing_user["_id"])


async def update_user(
    collection: AsyncIOMotorCollection, user: UserUpdate, email: str
) -> Optional[str]:
    """Comprueba el email y la contraseña introducidos."""
    existing_user = await collection.find_one({"email": email})
    if not existing_user:
        return None

    await collection.update_one({"email": email}, {"$set": user.model_dump()})

    return str(existing_user["_id"])


async def get_user_data(
    collection: AsyncIOMotorCollection, email: str
) -> Optional[UserUpdate]:
    """Comprueba el email y la contraseña introducidos."""
    existing_user = await collection.find_one({"email": email})
    if not existing_user:
        return None

    # Retornar los datos del usuario como un objeto UserUpdate
    return UserUpdate(
        name=existing_user.get("name"),
        surname=existing_user.get("surname"),
        age=existing_user.get("age"),
        height=existing_user.get("height"),
        weight=existing_user.get("weight"),
        diabetes=existing_user.get("diabetes"),
        hypertension=existing_user.get("hypertension"),
        isMedic=existing_user.get("isMedic"),
        patients=existing_user.get("patients"),
    )
