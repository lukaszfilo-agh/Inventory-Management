from fastapi import FastAPI, Depends
from typing import Annotated
from sqlalchemy.orm import Session
from database import engine
import models
from fastapi.middleware.cors import CORSMiddleware
from routers import warehouse, item, category, health, stock
import os
from database import get_db

frontend_url = os.getenv("FRONTEND_URL")

app = FastAPI()

origins = [
    frontend_url
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_methods=["*"],  # Allow all HTTP methods (GET, POST, etc.)
    allow_headers=["*"],  # Allow all headers
)

# Register routers
app.include_router(health.router)
app.include_router(warehouse.router)
app.include_router(category.router)
app.include_router(item.router)
app.include_router(stock.router)

# Dependency to get the DB session
db_dependency = Annotated[Session, Depends(get_db)]

models.Base.metadata.create_all(bind=engine)