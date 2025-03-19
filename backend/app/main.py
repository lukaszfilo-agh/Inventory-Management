from typing import Annotated

import models as models
from api import api_router
from core import settings, engine, get_db
from fastapi import Depends, FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

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
    settings.FRONTEND_URL,
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_methods=["*"],  # Allow all HTTP methods (GET, POST, etc.)
    allow_headers=["*"],  # Allow all headers
)

# Register routers
app.include_router(api_router)

# Dependency to get the DB session
db_dependency = Annotated[Session, Depends(get_db)]

models.Base.metadata.create_all(bind=engine)
