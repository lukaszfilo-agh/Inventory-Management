from typing import Annotated

import models as models
from api import api_router
from core import engine, get_db, settings, create_default_user
from fastapi import Depends, FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
import logging

# Initialize logger
logger = logging.getLogger("uvicorn")
logger.setLevel(logging.INFO)

# Initialize FastAPI app
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

# Configure CORS
origins = [settings.FRONTEND_URL]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_methods=["GET", "POST", "PUT", "DELETE"],  # Restrict to necessary methods
    allow_headers=["Authorization", "Content-Type"],  # Restrict to necessary headers
)

# Register API routers
app.include_router(api_router)

@app.on_event("startup")
async def on_startup():
    """Startup event to initialize the database and create default user."""
    logger.info("Starting up the application...")

    # Create database tables
    try:
        models.Base.metadata.create_all(bind=engine)
        logger.info("Database tables created successfully.")
    except Exception as e:
        logger.error(f"Error creating database tables: {e}")
        raise

    # Create the default user
    try:
        with next(get_db()) as db:  # Use context manager for session lifecycle
            create_default_user(db)
            logger.info("Default user created successfully.")
    except Exception as e:
        logger.error(f"Error creating default user: {e}")
        raise