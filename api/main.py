from fastapi import FastAPI, HTTPException, Depends
from typing import Annotated, List
from sqlalchemy.orm import Session
from pydantic import BaseModel
from database import SessionLocal, engine
import models
from fastapi.middleware.cors import CORSMiddleware
import os

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

class WarehouseBase(BaseModel):
    name: str
    location: str

class WarehouseModel(WarehouseBase):
    id: int

    class Config:
        from_attributes = True

class ItemBase(BaseModel):
    name: str
    quantity: int
    date_added: str
    price: float
    warehouse_id: int
    category_id: int

class ItemModel(ItemBase):
    id: int

    class Config:
        from_attributes = True

class CategoryBase(BaseModel):
    name: str

class CategoryModel(CategoryBase):
    id: int

    class Config:
        from_attributes = True

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

db_dependency = Annotated[Session, Depends(get_db)]

models.Base.metadata.create_all(bind=engine)

@app.get("/health")
def health_check():
    return {"status": "ok", "message": "API is running"}

@app.post('/warehouses/', response_model=WarehouseModel)
async def create_warehouse(warehouse: WarehouseBase, db: db_dependency):
    new_warehouse = models.Warehouse(**warehouse.model_dump())
    db.add(new_warehouse)
    db.commit()
    db.refresh(new_warehouse)
    return new_warehouse

@app.get('/warehouses/', response_model=List[WarehouseModel])
async def get_warehouses(db: db_dependency):
    warehouses = db.query(models.Warehouse).all()
    return warehouses

@app.get('/warehouses/{warehouse_id}', response_model=WarehouseModel)
async def get_warehouse(warehouse_id: int, db: db_dependency):
    warehouse = db.query(models.Warehouse).filter(models.Warehouse.id == warehouse_id).one_or_none()
    
    if not warehouse:
        raise HTTPException(status_code=404, detail=f"Warehouse with ID {warehouse_id} does not exist.")
    
    return warehouse

@app.get('/warehouses/{warehouse_id}/items', response_model=List[ItemModel])
async def get_warehouse_items(warehouse_id: int, db: db_dependency):
    warehouse = db.query(models.Warehouse).filter(models.Warehouse.id == warehouse_id).one_or_none()

    if not warehouse:
        raise HTTPException(status_code=404, detail=f"Warehouse with ID {warehouse_id} does not exist.")
    
    items = db.query(models.Item).filter(models.Item.warehouse_id == warehouse_id).all()
    return items

@app.patch('/warehouses/{warehouse_id}', response_model=WarehouseModel)
async def update_warehouse(warehouse_id: int, warehouse: WarehouseBase, db: db_dependency):
    warehouse_to_update = db.query(models.Warehouse).filter(models.Warehouse.id == warehouse_id).one_or_none()

    if not warehouse_to_update:
        raise HTTPException(status_code=404, detail=f"Warehouse with ID {warehouse_id} does not exist.")
    
    warehouse_data = warehouse.model_dump(exclude_unset=True)
    for key, value in warehouse_data.items():
        setattr(warehouse_to_update, key, value)

    db.commit()
    db.refresh(warehouse_to_update)
    return warehouse_to_update

@app.delete("/warehouses/{warehouse_id}")
def delete_warehouse(warehouse_id: int, db: Session = Depends(get_db)):
    warehouse = db.query(models.Warehouse).filter(models.Warehouse.id == warehouse_id).one_or_none()
    
    if not warehouse:
        raise HTTPException(status_code=404, detail=f"Warehouse with ID {warehouse_id} does not exist.")

    # Check if warehouse is empty
    inventory_count = db.query(models.Item).filter(models.Item.warehouse_id == warehouse_id).count()
    if inventory_count > 0:
        raise HTTPException(status_code=400, detail=f"Warehouse with ID {warehouse_id} is not empty and cannot be deleted.")
    
    db.delete(warehouse)
    db.commit()
    
    return {"message": f"Warehouse with ID {warehouse_id} has been deleted successfully."}

@app.post('/categories/', response_model=CategoryModel)
async def create_category(category: CategoryBase, db: db_dependency):
    new_category = models.Category(**category.model_dump())
    db.add(new_category)
    db.commit()
    db.refresh(new_category)
    return new_category

@app.get('/categories/', response_model=List[CategoryModel])
async def get_categories(db: db_dependency):
    categories = db.query(models.Category).all()
    return categories

@app.get('/categories/{category_id}', response_model=CategoryModel)
async def get_category(category_id: int, db: db_dependency):
    category = db.query(models.Category).filter(models.Category.id == category_id).one_or_none()

    if not category:
        raise HTTPException(status_code=404, detail=f"Category with ID {category_id} does not exist.")
    
    return category

@app.patch('/categories/{category_id}', response_model=CategoryModel)
async def update_category(category_id: int, category: CategoryBase, db: db_dependency):
    category_to_update = db.query(models.Category).filter(models.Category.id == category_id).one_or_none()

    if not category_to_update:
        raise HTTPException(status_code=404, detail=f"Category with ID {category_id} does not exist.")
    
    category_data = category.model_dump(exclude_unset=True)
    for key, value in category_data.items():
        setattr(category_to_update, key, value)

    db.commit()
    db.refresh(category_to_update)
    return category_to_update

@app.get('/categories/{category_id}/items', response_model=List[ItemModel])
async def get_category_items(category_id: int, db: db_dependency):
    category = db.query(models.Category).filter(models.Category.id == category_id).one_or_none()

    if not category:
        raise HTTPException(status_code=404, detail=f"Category with ID {category_id} does not exist.")
    
    items = db.query(models.Item).filter(models.Item.category_id == category_id).all()
    return items

@app.post('/items/', response_model=ItemModel)
async def create_item(item: ItemBase, db: db_dependency):
    warehouse = db.query(models.Warehouse).filter(models.Warehouse.id == item.warehouse_id).one_or_none()
    category = db.query(models.Category).filter(models.Category.id == item.category_id).one_or_none()
    
    if not warehouse:
        raise HTTPException(status_code=404, detail=f"Warehouse with ID {item.warehouse_id} does not exist.")
    
    if not category:
        raise HTTPException(status_code=404, detail=f"Category with ID {item.category_id} does not exist.")
    
    new_item = models.Item(**item.model_dump())
    db.add(new_item)
    db.commit()
    db.refresh(new_item)
    return new_item

@app.get('/items/', response_model=List[ItemModel])
async def get_items(db: db_dependency):
    items = db.query(models.Item).all()
    return items

@app.get('/items/{item_id}', response_model=ItemModel)
async def get_item(item_id: int, db: db_dependency):
    item = db.query(models.Item).filter(models.Item.id == item_id).one_or_none()
    
    if not item:
        raise HTTPException(status_code=404, detail=f"Item with ID {item_id} does not exist.")
    
    return item

@app.delete("/items/{item_id}")
def delete_item(item_id: int, db: Session = Depends(get_db)):
    item = db.query(models.Item).filter(models.Item.id == item_id).one_or_none()
    
    if not item:
        raise HTTPException(status_code=404, detail=f"Item with ID {item_id} does not exist.")
    
    db.delete(item)
    db.commit()
    
    return {"message": f"Item with ID {item_id} has been deleted successfully."}