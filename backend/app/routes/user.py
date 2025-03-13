from fastapi import APIRouter, Depends, HTTPException, status
from motor.motor_asyncio import AsyncIOMotorCollection

from app.crud.user import create_user, get_user_data, login_user, update_user
from app.database import get_database
from app.utils.config import CURRENT_USER_EMAIL
from app.schemas.user import Token, UserCreate, UserLogin, UserUpdate
from app.utils.security import create_access_token

user_router = APIRouter()


@user_router.post(
    "/register", response_model=Token, status_code=status.HTTP_201_CREATED
)
async def register(
    user: UserCreate, db: AsyncIOMotorCollection = Depends(get_database)
):
    try:
        await create_user(db.users, user)
        access_token = create_access_token(data={"sub": user.email})
        return {"access_token": access_token, "token_type": "bearer"}
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@user_router.post("/login", response_model=Token, status_code=status.HTTP_200_OK)
async def login(user: UserLogin, db: AsyncIOMotorCollection = Depends(get_database)):
    try:
        await login_user(db.users, user)
        access_token = create_access_token(data={"sub": user.email})
        return {"access_token": access_token, "token_type": "bearer"}
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

@user_router.get("/profile", response_model=UserUpdate, status_code=status.HTTP_200_OK)
async def get_profile(db: AsyncIOMotorCollection = Depends(get_database)):
    try:
        result = await get_user_data(db.users, CURRENT_USER_EMAIL)
        print(result)
        return result
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@user_router.put("/profile", status_code=status.HTTP_200_OK)
async def update(user: UserUpdate, db: AsyncIOMotorCollection = Depends(get_database)):
    try:
        await update_user(db.users, user, CURRENT_USER_EMAIL)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
