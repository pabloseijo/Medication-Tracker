from fastapi import APIRouter, Query
from app.services.cima import cima
from app.services.typesense import search_medications
meds_router = APIRouter()

@meds_router.get("/meds")
async def read_root(code: str):
    med = cima.obtener_medicamento_por_codigo(code)
    return med



@meds_router.get("/search")
def search_meds(q: str = Query(..., description="Nombre del medicamento")):
    results = search_medications(q)
    suggestions = [hit["document"]["name"] for hit in results["hits"]]
    return {"suggestions": suggestions}


# 🔎 Endpoint para autocompletado
@meds_router.get("/meds")
def autocomplete_meds(name: str):
    med = cima.obtener_medicamento_por_nombre(name)
    return med
