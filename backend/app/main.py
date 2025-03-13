from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from app.database import close_client, get_database, start_client
from app.routes.meds import meds_router
from app.routes.user import user_router
from app.services.typesense import create_meds_collection
from app.utils.mock import create_mocks
from app.routes.messages import message_router

CURRENT_USER_EMAIL = "javier@gmail.com"


@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Maneja el ciclo de vida de la aplicación:
    - Conecta a MongoDB antes de iniciar.
    - Cierra la conexión al apagar la app.
    """
    print("Iniciando aplicación...")
    # Crear conexión a MongoDB
    await start_client()
    create_meds_collection()
    print("Conexión a MongoDB establecida.")

    await create_mocks(await get_database())

    yield  # Permite que la aplicación se ejecute

    # Cerrar conexión al terminar
    print("Apagando aplicación...")
    await close_client()
    print("Conexión a MongoDB cerrada.")


app = FastAPI(
    title="Medication Tracker API",
    description="API para gestionar el seguimiento de medicación",
    version="0.0.1",
    lifespan=lifespan,
)

# Configuración de CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.include_router(meds_router)
app.include_router(user_router)
app.include_router(message_router)


# Endpoint raíz
@app.get("/", tags=["Root"])
async def read_root():
    return {"message": "Bienvenido a la API de seguimiento de medicación"}
