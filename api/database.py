from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
import os
from dotenv import load_dotenv

if os.getenv('RUNNING_IN_DOCKER') != 'true':
    load_dotenv()

URL_DB = 'sqlite:///./db/inventory.db'

DATABASE_URL = os.getenv("DATABASE_URL", URL_DB)

print(DATABASE_URL)

engine = create_engine(DATABASE_URL)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

# Dependency to get the DB session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()