from typing import List

from core import (get_admin_emails, get_current_user, get_db, hash_password,
                  send_email, verify_password)
from fastapi import APIRouter, Depends, HTTPException
from models import User
from pydantic import ValidationError
from schemas import UserModel, UserCreate, PasswordChangeRequest, UserUpdate
from sqlalchemy.orm import Session

router = APIRouter(prefix="/users", tags=["Users"])


@router.post("/register", response_model=UserModel, summary="Register a new user")
async def create_user(user_data: UserCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    """
    Register a new user.
    - Only accessible by admin users.
    - Validates input, checks for duplicate usernames, and hashes the password.
    - Sends a notification email to all admins.
    """
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

@router.get("/get", response_model=List[UserModel], summary="Get all users")
async def get_users(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    """
    Retrieve all users.
    - Only accessible by admin users.
    - Returns a list of all users in the system.
    """
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Not authorized to perform this action")
    return db.query(User).all()

@router.get("/get/{user_id}", response_model=UserModel, summary="Get a specific user")
async def get_user(user_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    """
    Retrieve a specific user by their ID.
    - Only accessible by admin users.
    - Returns the `UserModel` for the requested user.
    """
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Not authorized to perform this action")
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user

@router.get("/details", response_model=UserModel, summary="Get current user details")
async def get_me(current_user: UserModel = Depends(get_current_user)):
    """
    Retrieve details of the currently authenticated user.
    - Returns the `UserModel` for the current user.
    """
    return current_user

@router.patch("/update/me", response_model=UserModel, summary="Update current user details")
async def update_user(
    user_data: UserUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Update details of the currently authenticated user.
    - Accepts partial updates in the form of `UserUpdate`.
    - Returns the updated `UserModel`.
    """
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

@router.patch("/change-password", summary="Change current user's password")
async def change_password(
    password_data: PasswordChangeRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Change the password of the currently authenticated user.
    - Verifies the current password before updating.
    - Returns a success message upon successful password change.
    """
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

@router.delete("/delete/{user_id}", summary="Delete a user")
async def delete_user(user_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    """
    Delete a user by their ID.
    - Only accessible by admin users.
    - Returns a success message upon successful deletion.
    """
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Not authorized to perform this action")
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    db.delete(user)
    db.commit()
    return {"status": "ok", "message": f"User {user_id} deleted"}