from core import (create_access_token, get_db, oauth2_scheme, role_required,
                  verify_password)
from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from models import User
from schemas import UserModel
from sqlalchemy.orm import Session

router = APIRouter(prefix="/login", tags=["Login"])

@router.post("/")
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = db.query(User).filter(User.username == form_data.username).first()
    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(status_code=400, detail="Invalid credentials")
    
    token = create_access_token({"sub": user.username, "role": user.role})
    return {"access_token": token, "token_type": "bearer"}

@router.get("/admin-only")
def admin_only_endpoint(user: UserModel = Depends(role_required(["admin"]))):
    return {"message": "Welcome, admin!"}