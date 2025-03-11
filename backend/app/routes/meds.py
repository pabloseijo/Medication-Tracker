from fastapi import APIRouter
from app.services.cima import cima

meds_router = APIRouter()

@meds_router.get("/meds")
async def read_root(code: str):
    med = cima.obtener_medicamento_por_codigo(code)
    return med
