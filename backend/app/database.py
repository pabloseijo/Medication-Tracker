from motor.motor_asyncio import AsyncIOMotorClient
import os
from dotenv import load_dotenv

load_dotenv()

MONGO_URI = os.getenv("MONGO_URI")
DB_NAME = os.getenv("DATABASE_NAME", "medication_tracker")

# Inicialización del cliente y la base de datos
client = None
database = None


async def start_client():
    """
    Crea y devuelve una conexión a MongoDB.
    """
    global client, database
    try:
        client = AsyncIOMotorClient(MONGO_URI)
        database = client[DB_NAME]
        print(f"Conectado a la base de datos: {DB_NAME}")
    except Exception as e:
        print(f"Error al conectar a MongoDB: {e}")
        raise


async def get_database():
    """
    Devuelve la base de datos especificada desde el cliente de MongoDB.
    """
    if database is None:
        raise RuntimeError("La base de datos no ha sido inicializada.")
    return database


async def close_client():
    """
    Cierra la conexión con la base de datos.
    """
    if client is not None:
        client.close()
        print("Conexión a MongoDB cerrada.")
