from typing import List

import models as models
from core import get_current_user, get_db, hash_password, oauth2_scheme
from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import OAuth2PasswordBearer
from models import User
from pydantic import BaseModel, ValidationError
from schemas import UserBase, UserModel
from sqlalchemy.orm import Session

router = APIRouter(prefix="/users", tags=["Users"])

# Pydantic model for user registration
class UserCreate(BaseModel):
    username: str
    first_name: str
    last_name: str
    email: str
    password: str
    date_joined: str
    role: str  # "admin" or "user"

@router.post("/register", response_model=UserModel)
async def create_user(user_data: UserCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Not authorized to perform this action")
    try:
        # Validate input data using Pydantic
        validated_data = UserCreate(**user_data.dict())

        # Check if user already exists
        existing_user = db.query(User).filter(User.username == validated_data.username).first()
        if existing_user:
            raise HTTPException(status_code=400, detail="Username already exists")

        # Hash the password
        hashed_password = hash_password(validated_data.password)

        # Create new user
        new_user = User(
            username=validated_data.username,
            first_name=validated_data.first_name,
            last_name=validated_data.last_name,
            email=validated_data.email,
            hashed_password=hashed_password,
            date_joined=validated_data.date_joined,
            role=validated_data.role,
            is_active=True  # Assuming new users are active by default
        )
        db.add(new_user)
        db.commit()
        db.refresh(new_user)

        return UserModel.model_validate(new_user).model_dump()

    except ValidationError as e:
        raise HTTPException(status_code=422, detail=e.errors())

@router.get("/get", response_model=List[UserModel])
async def get_users(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Not authorized to perform this action")
    return db.query(User).all()

@router.get("/get/{user_id}", response_model=UserModel)
async def get_user(user_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Not authorized to perform this action")
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user

@router.get("/details", response_model=UserModel)
async def get_me(current_user: UserModel = Depends(get_current_user)):
    return current_user