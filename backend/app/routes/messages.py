from motor.motor_asyncio import AsyncIOMotorCollection
from fastapi import APIRouter, Depends, HTTPException, status
from app.crud.messages import add_message, get_all_user_conversation
from app.database import get_database
from app.schemas.messages import ChatMessage
from app.services.chatbot import ChatbotService

message_router = APIRouter()
chatbot_service = ChatbotService()


@message_router.post(
    "/messages", response_model=ChatMessage, status_code=status.HTTP_201_CREATED
)
async def process_message(
    message: ChatMessage,
    db: AsyncIOMotorCollection = Depends(get_database),
):
    """
    Envía un mensaje al chatbot y devuelve la respuesta.
    """
    try:
        mock_user = await db.users.find_one({"email": "mock@example.com"})
        if not mock_user:
            return None
        # Se añade el mensaje a la base de datos
        message.user_id = str(mock_user["_id"])
        await add_message(db.messages, message)
        # Se recupera toda la conversacion del usuario
        conversation_history = await get_all_user_conversation(db.messages, message.user_id)

        chatbot_response = chatbot_service.get_chat_response(
            "Mock", conversation_history
        )

        # Verificar si la respuesta es None
        if chatbot_response is None:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="No se pudo generar una respuesta.",
            )

        # Almacenar la respuesta del asistente en Weaviate
        await add_message(db.messages, ChatMessage(user_id=str(mock_user["_id"]), author="assistant", text=chatbot_response))

        # Devolver la respuesta del asistente
        return ChatMessage(user_id=None, text=chatbot_response, author="assistant")
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
