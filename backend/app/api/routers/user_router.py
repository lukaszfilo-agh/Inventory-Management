from typing import List

import models as models
from core import (get_admin_emails, get_current_user, get_db, hash_password,
                  send_email, verify_password)
from fastapi import APIRouter, Depends, HTTPException
from models import User
from pydantic import BaseModel, ValidationError
from schemas import UserModel, UserCreate, PasswordChangeRequest, UserUpdate
from sqlalchemy.orm import Session

router = APIRouter(prefix="/users", tags=["Users"])


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

        admin_emails = get_admin_emails(db)
        for email in admin_emails:
            send_email(email, "New User Registration", f"User {new_user.username} has registered.")

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

@router.patch("/update/me", response_model=UserModel)
async def update_user(
    user_data: UserUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    user_to_update = db.query(User).filter(User.id == current_user.id).first()
    if not user_to_update:
        raise HTTPException(status_code=404, detail="User not found")
    try:
        validated_data = user_data.dict(exclude_unset=True)  # Pydantic handles validation
        for key, value in validated_data.items():
            setattr(user_to_update, key, value)
        db.commit()
        db.refresh(user_to_update)
        return UserModel.model_validate(user_to_update).model_dump()
    except ValidationError as e:
        raise HTTPException(status_code=422, detail=e.errors())

@router.patch("/change-password")
async def change_password(
    password_data: PasswordChangeRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    user_to_update = db.query(User).filter(User.id == current_user.id).first()
    if not user_to_update:
        raise HTTPException(status_code=404, detail="User not found")
    if verify_password(password_data.current_password, user_to_update.hashed_password):
        new_hashed_password = hash_password(password_data.new_password)
        user_to_update.hashed_password = new_hashed_password
        db.commit()
        db.refresh(user_to_update)
        return {"status": "ok", "message": "Password updated successfully"}
    else:
        raise HTTPException(status_code=400, detail="Incorrect old password")

@router.delete("/delete/{user_id}")
async def delete_user(user_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Not authorized to perform this action")
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    db.delete(user)
    db.commit()
    return {"status": "ok", "message": f"User {user_id} deleted"}