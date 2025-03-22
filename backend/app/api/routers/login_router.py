from core import get_db, verify_password, create_access_token
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from schemas import UserModel
from models import User

from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm

router = APIRouter()
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")

router = APIRouter(prefix="/login", tags=["Login"])

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")

@router.post("/")
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = db.query(User).filter(User.username == form_data.username).first()
    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(status_code=400, detail="Invalid credentials")
    
    token = create_access_token({"sub": user.username, "role": user.role})
    return {"access_token": token, "token_type": "bearer"}