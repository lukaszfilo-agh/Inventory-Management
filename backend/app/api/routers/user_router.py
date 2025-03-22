import models as models
from core import get_db
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from schemas import UserModel, UserBase
from core import hash_password
from pydantic import BaseModel
from models import User
from typing import List

from fastapi.security import OAuth2PasswordBearer

outer = APIRouter()
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")

router = APIRouter(prefix="/users", tags=["Users"])

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")

# Pydantic model for user registration
class UserCreate(BaseModel):
    username: str
    password: str
    role: str  # "admin" or "user"

@router.post("/register", response_model=UserModel)
def create_user(user_data: UserCreate, db: Session = Depends(get_db)):
    # Check if user already exists
    existing_user = db.query(User).filter(User.username == user_data.username).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Username already exists")

    # Hash the password
    hashed_password = hash_password(user_data.password)

    # Create new user
    new_user = User(username=user_data.username, hashed_password=hashed_password, role=user_data.role)
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return {"message": "User created successfully", "username": new_user.username}

@router.get("/", response_model=List[UserModel])
def get_users(db: Session = Depends(get_db)):
    return db.query(User).all()