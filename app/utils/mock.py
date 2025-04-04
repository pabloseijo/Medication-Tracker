from motor.motor_asyncio import AsyncIOMotorDatabase
from app.crud.user import create_user
from app.schemas.user import Patient, UserCreate


async def create_mocks(db: AsyncIOMotorDatabase):
    # Crear usuarios mock (pacientes)
    mock_patients = [
        UserCreate(
            name="Miguel",
            surname="Leal",
            password="miguelleal",
            email="miguelleal8@gmail.com",
            age=21,
            height=193,
            weight=104.0,
            diabetes=False,
            hypertension=False,
            isMedic=False,
            patients=[],
        ),
        UserCreate(
            name="Juan",
            surname="Perez",
            password="juan",
            email="juan@gmail.com",
            age=78,
            height=170,
            weight=66.5,
            diabetes=True,
            hypertension=True,
            isMedic=False,
            patients=[],
        ),
    ]

    for patient in mock_patients:
        await create_user(db.users, patient)

    patients_for_medic = []
    for patient in mock_patients:
        # Convertir el usuario mock en un objeto Patient
        patient_obj = Patient(
            name=patient.name,
            surname=patient.surname,
            age=patient.age,
            height=patient.height,
            weight=patient.weight,
            diabetes=patient.diabetes,
            hypertension=patient.hypertension,
        )
        patients_for_medic.append(patient_obj)

    mock_medic = UserCreate(
        name="Javier",
        surname="Pérez",
        password="javiermedico",
        email="javier@gmail.com",
        age=35,
        height=182,
        weight=75.0,
        diabetes=False,
        hypertension=False,
        isMedic=True,
        patients=patients_for_medic,
    )

    await create_user(db.users, mock_medic)
