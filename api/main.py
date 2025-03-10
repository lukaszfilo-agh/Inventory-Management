from fastapi import FastAPI, HTTPException, Depends
from typing import Annotated, List
from sqlalchemy.orm import Session
from pydantic import BaseModel
from database import SessionLocal, engine
import models
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

origins = [
    "http://localhost:3000"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins)

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

class ItemModel(ItemBase):
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

@app.delete("/warehouses/{warehouse_id}")
def delete_warehouse(warehouse_id: int, db: Session = Depends(get_db)):
    warehouse = db.query(models.Warehouse).filter(models.Warehouse.id == warehouse_id).one_or_none()
    
    if not warehouse:
        raise HTTPException(status_code=404, detail=f"Warehouse with ID {warehouse_id} does not exist.")
    
    db.delete(warehouse)
    db.commit()
    
    return {"message": f"Warehouse with ID {warehouse_id} has been deleted successfully."}

@app.post('/items/', response_model=ItemModel)
async def create_item(item: ItemBase, db: db_dependency):
    warehouse = db.query(models.Warehouse).filter(models.Warehouse.id == item.warehouse_id).one_or_none()
    
    if not warehouse:
        raise HTTPException(status_code=404, detail=f"Warehouse with ID {item.warehouse_id} does not exist.")
    
    new_item = models.Item(**item.model_dump())
    db.add(new_item)
    db.commit()
    db.refresh(new_item)
    return new_item

@app.get('/items/', response_model=List[ItemModel])
async def get_items(db: db_dependency):
    items = db.query(models.Item).all()
    return items

@app.delete("/items/{item_id}")
def delete_item(item_id: int, db: Session = Depends(get_db)):
    item = db.query(models.Item).filter(models.Item.id == item_id).one_or_none()
    
    if not item:
        raise HTTPException(status_code=404, detail=f"Item with ID {item_id} does not exist.")
    
    db.delete(item)
    db.commit()
    
    return {"message": f"Item with ID {item_id} has been deleted successfully."}