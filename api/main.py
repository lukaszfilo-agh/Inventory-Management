from fastapi import FastAPI, Depends
from typing import Annotated
from sqlalchemy.orm import Session
from routers import health_router, item_router, stock_router, stockmovement_router, warehouse_router, category_router
from database import engine
import models
from fastapi.middleware.cors import CORSMiddleware
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
app.include_router(health_router.router)
app.include_router(warehouse_router.router)
app.include_router(category_router.router)
app.include_router(item_router.router)
app.include_router(stock_router.router)
app.include_router(stockmovement_router.router)

# Dependency to get the DB session
db_dependency = Annotated[Session, Depends(get_db)]

models.Base.metadata.create_all(bind=engine)
