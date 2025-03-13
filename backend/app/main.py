from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.crud.user import create_user
from app.database import get_database, start_client, close_client
from contextlib import asynccontextmanager
from app.routes.meds import meds_router
from app.routes.user import user_router
from app.schemas.user import UserCreate
from app.services.typesense import create_meds_collection


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

    # Crear usuario mock
    db = await get_database()
    users_collection = db.users
    mock_user = await users_collection.find_one({"email": "mock@example.com"})
    if not mock_user:
        mock_user_data = UserCreate(
            name="Mock",
            surname="User",
            password="mockpassword",
            email="mock@example.com",
            age=30,
            height=175,
            weight=70.0,
            diabetes=False,
            hypertension=False,
        )
        await create_user(users_collection, mock_user_data)
        print("Usuario mock creado.")

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


# Endpoint raíz
@app.get("/", tags=["Root"])
async def read_root():
    return {"message": "Bienvenido a la API de seguimiento de medicación"}
