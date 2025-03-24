from datetime import datetime, timedelta

from fastapi import Depends, HTTPException
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt
from models.users_model import User
from passlib.context import CryptContext
from schemas import UserModel
from sqlalchemy.orm import Session

from .config import settings
from .database import get_db

SECRET_KEY = settings.SECRET_KEY
ALGORITHM = settings.ALGORITHM
ACCESS_TOKEN_EXPIRE_MINUTES = settings.ACCESS_TOKEN_EXPIRE_MINUTES

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/login/")

def hash_password(password: str):
    return pwd_context.hash(password)

def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def create_access_token(data: dict, expires_delta: timedelta = None):
    to_encode = data.copy()
    expire = datetime.now() + (expires_delta or timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES))
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

def decode_access_token(token: str):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload
    except JWTError as e:
        raise HTTPException(status_code=401, detail="Invalid or expired token")

def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)) -> UserModel:
    payload = decode_access_token(token)
    if not payload:
        raise HTTPException(status_code=401, detail="Invalid or expired token")
    
    user = db.query(User).filter(User.username == payload["sub"]).first()
    if not user:
        raise HTTPException(status_code=401, detail="User not found")
    
    # Convert SQLAlchemy User object to Pydantic UserModel
    return UserModel.model_validate(user)

def role_required(allowed_roles: list):
    def role_checker(user: UserModel = Depends(get_current_user)):
        if user.role not in allowed_roles:
            raise HTTPException(status_code=403, detail="Access forbidden: insufficient permissions")
        return user
    return role_checker

def create_default_user(db: Session):
    """
    Creates a default admin user if no users exist in the database.
    """
    # Check if any user exists
    if not db.query(User).first():
        # Create a default admin user
        admin_user = User(
            username="admin",
            first_name="Admin",
            last_name="User",
            email="admin@admin.com",
            hashed_password=hash_password("admin"),  # Replace with a secure password
            date_joined=datetime.now(),
            role="admin"  # Assuming the User model has a 'role' field
        )
        db.add(admin_user)
        db.commit()
        db.refresh(admin_user)
        print("Default admin user created.")
        return admin_user
    else:
        print("Default admin user already exists.")
        return None