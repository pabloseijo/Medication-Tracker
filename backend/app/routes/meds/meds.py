from fastapi import APIRouter

meds_router = APIRouter()

@meds_router.get("/")
def read_root():
    return {"message": "Hola, este es un mensaje desde la ruta de meds!"}
