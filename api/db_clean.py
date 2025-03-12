from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker
from dotenv import load_dotenv
import os

load_dotenv()

DB_URL = os.getenv("DATABASE_URL")

# Replace with your actual PostgreSQL connection string
engine = create_engine(DB_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def reset_database():
    db = SessionLocal()
    try:
        # Temporarily drop foreign key constraints
        db.execute(text("ALTER TABLE items DROP CONSTRAINT items_warehouse_id_fkey;"))
        db.execute(text("ALTER TABLE items DROP CONSTRAINT items_category_id_fkey;"))

        # Truncate tables and reset ID sequences
        db.execute(text("TRUNCATE TABLE warehouses, items, categories RESTART IDENTITY CASCADE;"))

        # Recreate foreign key constraints
        db.execute(text("""
            ALTER TABLE items ADD CONSTRAINT items_warehouse_id_fkey 
            FOREIGN KEY (warehouse_id) REFERENCES warehouses(id) ON DELETE CASCADE;
        """))
        db.execute(text("""
            ALTER TABLE items ADD CONSTRAINT items_category_id_fkey 
            FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE;
        """))

        db.commit()
    finally:
        db.close()

# Run the function to reset the database
reset_database()