from fastapi import APIRouter, Depends, HTTPException, Query, status
from motor.motor_asyncio import AsyncIOMotorCollection
from app.crud.meds import add_sporadic_medication, add_treatment
from app.database import get_database
from app.schemas.meds import SporadicMedicationCreate, TreatmentCreate
from app.services.cima import (
    obtener_medicamento_por_codigo,
    obtener_medicamento_por_nombre,
)
from app.services.typesense import search_medications


meds_router = APIRouter()


@meds_router.get("/meds")
async def read_root(code: str):
    med = obtener_medicamento_por_codigo(code)
    return med


# 🔎 Endpoint para autocompletado
@meds_router.get("/search")
def search_meds(q: str = Query(..., description="Nombre del medicamento")):
    results = search_medications(q)
    suggestions = [hit["document"]["name"] for hit in results["hits"]]
    return {"suggestions": suggestions}


@meds_router.get("/med_name")
def autocomplete_meds(name: str):
    med = obtener_medicamento_por_nombre(name)
    return med


@meds_router.post("/sporadic", status_code=status.HTTP_201_CREATED)
async def create_sporadic_medication(
    medication: SporadicMedicationCreate,
    db: AsyncIOMotorCollection = Depends(get_database),
):
    try:
        mock_user = await db.users.find_one({"email": "mock@example.com"})
        if not mock_user:
            return None

        medication.user_id = mock_user["_id"]
        result = await add_sporadic_medication(db.sporadic_medication, medication)
        if not result:
            raise ValueError("No se ha podido insertar la medicación")

        return {"id": str(result)}
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e)
        )


@meds_router.post("/treatments", status_code=status.HTTP_201_CREATED)
async def create_treatment(
    treatment: TreatmentCreate,
    db: AsyncIOMotorCollection = Depends(get_database),
):
    try:
        mock_user = await db.users.find_one({"email": "mock@example.com"})
        if not mock_user:
            return None

        treatment.user_id = mock_user["_id"]
        result = await add_treatment(db.treatments, treatment)
        if not result:
            raise ValueError("No se ha podido insertar el tratamiento")

        return {"id": str(result)}
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e)
        )
