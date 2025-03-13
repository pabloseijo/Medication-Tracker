from pydantic import BaseModel
from typing import Literal, Optional


class ChatMessage(BaseModel):
    """
    Modelo de datos para un mensaje de chat.
    """
    user_id: Optional[str] = None
    text: str
    author: Literal["user", "assistant"]
