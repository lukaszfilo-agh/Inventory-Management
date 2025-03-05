from fastapi import FastAPI, HTTPException, Depends
from typing import Annotated
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