from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.orm import declarative_base
from models import Warehouse, Item, Category, Base  # Make sure models.py contains your classes
from dotenv import load_dotenv
import os

load_dotenv()

DB_URL = os.getenv("PROD_DB")


engine = create_engine(DB_URL)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

# Create tables in the database
Base.metadata.create_all(bind=engine)

# Function to add data to the database
def add_data():
    # Open a session
    db = SessionLocal()

    # Add categories
    category_1 = Category(name="Electronics")
    category_2 = Category(name="Furniture")
    category_3 = Category(name="Clothing")
    category_4 = Category(name="Toys")
    db.add(category_1)
    db.add(category_2)
    db.add(category_3)
    db.add(category_4)
    db.commit()

    # Add warehouses
    warehouse_1 = Warehouse(name="Warehouse A", location="New York")
    warehouse_2 = Warehouse(name="Warehouse B", location="Los Angeles")
    warehouse_3 = Warehouse(name="Warehouse C", location="Chicago")
    warehouse_4 = Warehouse(name="Warehouse D", location="Miami")
    db.add(warehouse_1)
    db.add(warehouse_2)
    db.add(warehouse_3)
    db.add(warehouse_4)
    db.commit()

    # Add items
    item_1 = Item(name="Laptop", quantity=50, date_added="2025-03-01", price=999.99, warehouse_id=1, category_id=1)
    item_2 = Item(name="Sofa", quantity=20, date_added="2025-03-01", price=499.99, warehouse_id=2, category_id=2)
    item_3 = Item(name="T-Shirt", quantity=100, date_added="2025-03-05", price=19.99, warehouse_id=3, category_id=3)
    item_4 = Item(name="Action Figure", quantity=150, date_added="2025-03-06", price=12.99, warehouse_id=4, category_id=4)
    item_5 = Item(name="Smartphone", quantity=200, date_added="2025-03-02", price=699.99, warehouse_id=1, category_id=1)
    item_6 = Item(name="Dining Table", quantity=30, date_added="2025-03-03", price=349.99, warehouse_id=2, category_id=2)
    item_7 = Item(name="Jacket", quantity=75, date_added="2025-03-04", price=59.99, warehouse_id=3, category_id=3)
    item_8 = Item(name="Toy Car", quantity=120, date_added="2025-03-07", price=9.99, warehouse_id=4, category_id=4)
    item_9 = Item(name="Headphones", quantity=80, date_added="2025-03-02", price=129.99, warehouse_id=1, category_id=1)
    item_10 = Item(name="Coffee Table", quantity=25, date_added="2025-03-05", price=79.99, warehouse_id=2, category_id=2)

    db.add(item_1)
    db.add(item_2)
    db.add(item_3)
    db.add(item_4)
    db.add(item_5)
    db.add(item_6)
    db.add(item_7)
    db.add(item_8)
    db.add(item_9)
    db.add(item_10)
    db.commit()

    db.close()

# Run the function to add data
add_data()