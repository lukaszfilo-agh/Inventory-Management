from typing import List

from models import Warehouse, Item, User
from core import get_db, get_current_user
from fastapi import APIRouter, Depends, HTTPException
from schemas import WarehouseBase, WarehouseModel, WarehouseUpdate
from sqlalchemy.orm import Session

router = APIRouter(prefix="/warehouses", tags=["Warehouses"])


@router.post("/add",
             response_model=WarehouseModel,
             response_description="The created warehouse",
             summary="Create a new warehouse",
             description="Creates a new warehouse and returns the created warehouse model.")
async def create_warehouse(warehouse: WarehouseBase, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    """
    Create a new warehouse.
    - Accepts warehouse data in the form of `WarehouseBase`.
    - Returns the created `WarehouseModel`.
    """

    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Not authorized to perform this action")
    
    new_warehouse = Warehouse(**warehouse.model_dump())
    db.add(new_warehouse)
    db.commit()
    db.refresh(new_warehouse)
    return new_warehouse


@router.get("/get",
            response_model=List[WarehouseModel],
            response_description="A list of all warehouses",
            summary="Get all warehouses",
            description="Fetches a list of all warehouses in the system.")
async def get_warehouses(db: Session = Depends(get_db)):
    """
    Retrieve all warehouses.
    - Returns a list of `WarehouseModel` representing all warehouses.
    """
    return db.query(Warehouse).all()


@router.get("/get/{warehouse_id}",
            response_model=WarehouseModel,
            response_description="The requested warehouse",
            summary="Get a specific warehouse",
            description="Fetches a single warehouse by its ID.")
async def get_warehouse(warehouse_id: int, db: Session = Depends(get_db)):
    """
    Retrieve a specific warehouse by its ID.
    - If the warehouse doesn't exist, raises a 404 error.
    - Returns the `WarehouseModel` for the requested warehouse.
    """
    warehouse = db.query(Warehouse).filter(Warehouse.id == warehouse_id).one_or_none()
    if not warehouse:
        raise HTTPException(status_code=404, detail="Warehouse not found.")
    return warehouse


@router.patch("/{warehouse_id}",
              response_model=WarehouseModel,
              response_description="The updated warehouse",
              summary="Update a warehouse",
              description="Updates a warehouse's details and returns the updated warehouse model.")
async def update_warehouse(warehouse_id: int, warehouse: WarehouseUpdate, db: Session = Depends(get_db)):
    """
    Update a warehouse by its ID.
    - Accepts partial updates in the form of `WarehouseUpdate`.
    - Returns the updated `WarehouseModel`.
    """
    warehouse_to_update = db.query(Warehouse).filter(Warehouse.id == warehouse_id).one_or_none()
    if not warehouse_to_update:
        raise HTTPException(status_code=404, detail="Warehouse not found.")
    
    update_data = warehouse.model_dump(exclude_unset=True)  # Only include provided fields
    for key, value in update_data.items():
        setattr(warehouse_to_update, key, value)
    
    db.commit()
    db.refresh(warehouse_to_update)
    return warehouse_to_update


@router.delete("/{warehouse_id}",
               response_description="Warehouse deletion status",
               summary="Delete a warehouse",
               description="Deletes a warehouse by its ID and returns a deletion message.")
async def delete_warehouse(warehouse_id: int, db: Session = Depends(get_db)):
    """
    Delete a warehouse by its ID.
    - If the warehouse is not empty (contains items), raises a 400 error.
    - Returns a success message upon successful deletion.
    """
    warehouse = db.query(Warehouse).filter(Warehouse.id == warehouse_id).one_or_none()
    if not warehouse:
        raise HTTPException(status_code=404, detail="Warehouse not found.")

    if db.query(Item).filter(Item.warehouse_id == warehouse_id).count() > 0:
        raise HTTPException(status_code=400, detail="Warehouse is not empty and cannot be deleted.")

    db.delete(warehouse)
    db.commit()
    return {"message": f"Warehouse {warehouse_id} deleted successfully."}
