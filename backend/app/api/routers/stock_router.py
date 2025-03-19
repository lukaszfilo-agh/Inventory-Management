from typing import List

from core import get_db
from fastapi import APIRouter, Depends, HTTPException
from models import Item, Stock, Warehouse
from schemas import StockModel
from sqlalchemy.orm import Session

router = APIRouter(prefix="/stock", tags=["Stock"])


@router.get("/get",
            response_model=List[StockModel],
            response_description="A list of all stock items",
            summary="Get all stock",
            description="Fetches a list of all stock items across all warehouses.")
async def get_stock(db: Session = Depends(get_db)):
    """
    Endpoint to get all stock items.
    - Returns a list of `StockModel` representing all stock items.
    """
    return db.query(Stock).all()


@router.get("/get/item/{item_id}",
            response_model=List[StockModel],
            response_description="List of stock for the specified item",
            summary="Get stock for a specific item",
            description="Fetches all stock records associated with a specific item.")
async def get_stock_for_item(item_id: int, db: Session = Depends(get_db)):
    """
    Endpoint to get all stock records for a specific item.
    - Returns a list of `StockModel` for the specified item.
    """
    item = db.query(Item).filter(Item.id == item_id).one_or_none()

    if not item:
        raise HTTPException(status_code=404, detail="Item not found.")

    stock = db.query(Stock).filter(Stock.item_id == item_id).all()
    return stock

@router.get("/get/warehouse/{warehouse_id}",
            response_model=List[StockModel],
            response_description="List of stock for the specified warehouse",
            summary="Get stock for a specific warehouse",
            description="Fetches all stock records associated with a specific warehouse.")
async def get_stock_for_warehouse(warehouse_id: int, db: Session = Depends(get_db)):
    """
    Endpoint to get all stock records for a specific warehouse.
    - Returns a list of `StockModel` for the specified warehouse.
    """
    warehouse = db.query(Warehouse).filter(Warehouse.id == warehouse_id).one_or_none()

    if not warehouse:
        raise HTTPException(status_code=404, detail="Warehouse not found.")

    stock = db.query(Stock).filter(Stock.warehouse_id == warehouse_id).all()
    return stock
