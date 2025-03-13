from typing import Dict, Literal, Optional
from motor.motor_asyncio import AsyncIOMotorCollection
from typing import List, Optional

from app.schemas.messages import ChatMessage

async def add_message(
    collection: AsyncIOMotorCollection, message: ChatMessage, 
) -> Optional[str]:
    """Añade un mensaje asociado con el usuario."""

    result = await collection.insert_one(message.model_dump())

    return str(result.inserted_id)

async def get_all_user_conversation(
    collection: AsyncIOMotorCollection, user_id: str
) -> List[Dict[Literal["role", "content"], str]]:
    treatments = []
    """Devuelve todos los mensajes de las conversaciones del usuario."""
    async for message in collection.find({"user_id": user_id}):
        treatments.append({"role": message["author"], "content": message["text"]})

    return treatments


