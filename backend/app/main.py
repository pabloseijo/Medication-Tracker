from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import  start_client, close_client
from contextlib import asynccontextmanager
from app.routes.meds import meds_route 

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
    print("Conexión a MongoDB establecida.")

    yield  # Permite que la aplicación se ejecute

    # Cerrar conexión al terminar
    print("Apagando aplicación...")
    await close_client()
    print("Conexión a MongoDB cerrada.")


app = FastAPI(
    title="Medication Tracker API",
    description="API para gestionar el seguimiento de medicación",
    version="0.0.1"
)

# Configuración de CORS 
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.add_api_route(meds_route)
# Endpoint raíz
@app.get("/", tags=["Root"])
async def read_root():
    return {"message": "Bienvenido a la API de seguimiento de medicación"}

