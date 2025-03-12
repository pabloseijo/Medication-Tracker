from fastapi import APIRouter, Depends, HTTPException, Query, status
from motor.motor_asyncio import AsyncIOMotorCollection
from app.crud.meds import add_sporadic_medication, add_treatment, get_all_sporadic_medications, get_all_treatments
from app.database import get_database
from app.schemas.meds import Medication 
from app.services.cima import (
    obtener_medicamento_por_codigo,
    obtener_medicamento_por_nombre,
    obtener_medicamentos_por_nombre,
)
from app.services.typesense import search_medications
from fastapi.encoders import jsonable_encoder

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
    # med = obtener_medicamento_por_nombre(name)
    med = obtener_medicamentos_por_nombre(name) # Array de medicamentos
    return med

@meds_router.post("/sporadic", status_code=status.HTTP_201_CREATED)
async def create_sporadic_medication(
    medication: Medication,
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
    treatment: Medication,
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



@meds_router.get("/treatments")
async def get_treatments(
    db: AsyncIOMotorCollection = Depends(get_database),
):
    mock_user = await db.users.find_one({"email": "mock@example.com"})
    if not mock_user:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")

    treatments = await db.treatments.find({"user_id": mock_user["_id"]}).to_list(None)
    
    # Convertir ObjectId a str en cada tratamiento
    for treatment in treatments:
        treatment["_id"] = str(treatment["_id"])
        treatment["user_id"] = str(treatment["user_id"])

    return treatments  

@meds_router.get("/sporadic", status_code=status.HTTP_200_OK)
async def read_sporadic_medications(
    db: AsyncIOMotorCollection = Depends(get_database),
):
    """
    Devuelve todas las medicaciones esporádicas del usuario mock.
    Se busca el usuario mock y se filtran las medicaciones por user_id.
    """
    try:
        # Buscar el usuario mock
        mock_user = await db.users.find_one({"email": "mock@example.com"})
        if not mock_user:
            raise HTTPException(status_code=404, detail="Usuario no encontrado")

        # Obtener las medicaciones esporádicas del usuario mock
        medications = []
        async for medication in db.sporadic_medication.find({"user_id": mock_user["_id"]}):
            # Convertir ObjectId a str
            medication["_id"] = str(medication["_id"])
            medication["user_id"] = str(medication["user_id"])
            medications.append(medication)

        # Devolver las medicaciones
        return medications
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e)
        )
