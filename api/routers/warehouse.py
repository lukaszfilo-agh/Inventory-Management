from fastapi import APIRouter, HTTPException, Depends
from typing import List
from sqlalchemy.orm import Session
import models
from database import get_db
from schemas import WarehouseBase, WarehouseModel, ItemModel

router = APIRouter(prefix="/warehouses", tags=["Warehouses"])

@router.post("/", response_model=WarehouseModel)
async def create_warehouse(warehouse: WarehouseBase, db: Session = Depends(get_db)):
    new_warehouse = models.Warehouse(**warehouse.model_dump())
    db.add(new_warehouse)
    db.commit()
    db.refresh(new_warehouse)
    return new_warehouse

@router.get("/", response_model=List[WarehouseModel])
async def get_warehouses(db: Session = Depends(get_db)):
    return db.query(models.Warehouse).all()

@router.get("/{warehouse_id}", response_model=WarehouseModel)
async def get_warehouse(warehouse_id: int, db: Session = Depends(get_db)):
    warehouse = db.query(models.Warehouse).filter(models.Warehouse.id == warehouse_id).one_or_none()
    if not warehouse:
        raise HTTPException(status_code=404, detail="Warehouse not found.")
    return warehouse

@router.get("/{warehouse_id}/items", response_model=List[ItemModel])  # Use ItemModel, not models.Item
async def get_warehouse_items(warehouse_id: int, db: Session = Depends(get_db)):
    warehouse = db.query(models.Warehouse).filter(models.Warehouse.id == warehouse_id).one_or_none()
    if not warehouse:
        raise HTTPException(status_code=404, detail="Warehouse not found.")
    items = db.query(models.Item).filter(models.Item.warehouse_id == warehouse_id).all()
    return items

@router.patch("/{warehouse_id}", response_model=WarehouseModel)
async def update_warehouse(warehouse_id: int, warehouse: WarehouseBase, db: Session = Depends(get_db)):
    warehouse_to_update = db.query(models.Warehouse).filter(models.Warehouse.id == warehouse_id).one_or_none()
    if not warehouse_to_update:
        raise HTTPException(status_code=404, detail="Warehouse not found.")
    for key, value in warehouse.model_dump(exclude_unset=True).items():
        setattr(warehouse_to_update, key, value)
    db.commit()
    db.refresh(warehouse_to_update)
    return warehouse_to_update

@router.delete("/{warehouse_id}")
async def delete_warehouse(warehouse_id: int, db: Session = Depends(get_db)):
    warehouse = db.query(models.Warehouse).filter(models.Warehouse.id == warehouse_id).one_or_none()
    if not warehouse:
        raise HTTPException(status_code=404, detail="Warehouse not found.")
    
    if db.query(models.Item).filter(models.Item.warehouse_id == warehouse_id).count() > 0:
        raise HTTPException(status_code=400, detail="Warehouse is not empty and cannot be deleted.")
    
    db.delete(warehouse)
    db.commit()
    return {"message": f"Warehouse {warehouse_id} deleted successfully."}