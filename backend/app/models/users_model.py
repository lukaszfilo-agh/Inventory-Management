from core.database import Base
from sqlalchemy import Boolean, Column, ForeignKey, Integer, String, Date
from sqlalchemy.orm import relationship


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    first_name = Column(String)
    last_name = Column(String)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    date_joined = Column(Date)
    role = Column(String, default="viewer")  # Roles: admin, manager, viewer
    is_active = Column(Boolean, default=True)

    class Config:
        orm_mode = True