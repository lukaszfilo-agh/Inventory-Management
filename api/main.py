import os
from typing import Annotated

from fastapi import Depends, FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

import models
from database import engine, get_db
from routers import (category_router, health_router, item_router, stock_router,
                     stockmovement_router, warehouse_router)

frontend_url = os.getenv("FRONTEND_URL")

app = FastAPI(
    title="Inventory Manager API",
    description="API for managing warehouses, stock movements, and items.",
    version="1.0.0",
    contact={
        "name": "Łukasz",
        "email": "lukif02@gmail.com",
    },
    license_info={
        "name": "MIT",
        "url": "https://opensource.org/licenses/MIT",
    },
)

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
